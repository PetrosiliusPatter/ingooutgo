import { observer } from "../../deps/mobx-react-lite.ts"
import {
  MouseEvent,
  React,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "../../deps/react.ts"
import { z } from "../../deps/zod.ts"

import { EditorStore, StoreContext } from "../../stores/EditorStore.ts"
import { SerializedNodeSchema } from "../../types/IngoNode.ts"
import { useCopyPasteNodes } from "../../utils/customHooks/useCopyPasteNodes.ts"
import { useKeyboardActions } from "../../utils/customHooks/useKeyboardActions.ts"
import { useNodeSelection } from "../../utils/customHooks/useNodeSelection.ts"
import { Reactions, useReactions } from "../../utils/customHooks/useReactions.ts"
import { loadSerializedNodes } from "../../utils/storeSerialization.ts"
import { classNames } from "../../utils/styleUtils.ts"
import { Connection, PathFunc } from "../Connection/Connection.tsx"
import { NodeBrowser } from "../NodeBrowser/NodeBrowser.tsx"
import { NodeCard } from "../NodeCard/NodeCard.tsx"
import {
  EditorContentWrapper,
  EditorWrapper,
  LayerWrapper,
  NodesContainer,
} from "./styles.ts"

const Nodes = observer(() => {
  const { store } = useContext(StoreContext)
  return (
    <>
      {Array.from(store?.nodes?.values() ?? []).map((node, ind) => (
        <NodeCard key={`node-${ind}`} nodeId={node.id}></NodeCard>
      ))}
    </>
  )
})

type ConnectionProps = {
  wrapperEl: HTMLElement | null
  customPathFunc?: PathFunc
}
const Connections = observer(
  ({ wrapperEl, customPathFunc }: ConnectionProps) => {
    const { store } = useContext(StoreContext)

    if (!wrapperEl) return null
    if (!store) return null

    const currConStart = store.connectionStartIds?.[1]
    const currConEnd = store.connectionEndIds?.[1] ?? "mouse"

    return (
      <svg width="100%" height="100%">
        {store.getAllConnections().map((connection) => (
          <Connection
            container={wrapperEl}
            key={connection.id}
            connectionId={connection.id}
            a={connection.from.id}
            b={connection.to.id}
            pathFunc={customPathFunc}
          />
        ))}

        {currConStart && currConEnd && (
          <Connection
            container={wrapperEl}
            key={"currCon"}
            a={currConStart}
            b={currConEnd}
            pathFunc={customPathFunc}
          />
        )}
      </svg>
    )
  },
)

type EditorProps = {
  store: EditorStore
  reactions?: Reactions
  customPathFunc?: PathFunc
}

export const NodeEditor = observer(
  ({ store, reactions, customPathFunc }: EditorProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const nodesRef = useRef<HTMLDivElement>(null)

    // This is a hack to rerender once the ref is aquired
    // https://stackoverflow.com/a/65942218/8506535
    const [, setRefAquired] = useState(false)
    useEffect(() => {
      setRefAquired(true)
    }, [])

    useKeyboardActions(store)
    useReactions(store, reactions)
    const { DragSelection } = useNodeSelection({ store, wrapperRef, nodesRef })

    const { copyNodes, pasteNodes } = useCopyPasteNodes(store)

    const onMouseMove = useCallback(
      (e: MouseEvent<HTMLElement>) => {
        const pos = {
          x: e.nativeEvent.clientX,
          y: e.nativeEvent.clientY,
        }
        if (wrapperRef.current) {
          const wrapperBounds = wrapperRef.current.getBoundingClientRect()
          pos.x -= wrapperBounds.left
          pos.y -= wrapperBounds.top
        }
        store.setMousePosition(pos)
      },
      [store],
    )

    useEffect(() => {
      if (!wrapperRef.current) return
      const wrapper = wrapperRef.current

      store.setEditorContentWrapperElement(wrapper)
      wrapper.addEventListener("mouseup", store.confirmConnection)
      return () => {
        wrapper.removeEventListener("mouseup", store.confirmConnection)
      }
    }, [store])

    return (
      <StoreContext.Provider value={{ store }}>
        <EditorWrapper className={classNames.editorWrapper}>
          <NodesContainer
            onMouseMove={onMouseMove}
            onMouseDown={() => store.setTempSelection()}
            className={classNames.nodesContainer}
            onPaste={(e) => pasteNodes(e.clipboardData.getData("Text"))}
            onCopy={copyNodes}
          >
            <EditorContentWrapper
              ref={wrapperRef}
            >
              <DragSelection />
              <LayerWrapper
                ref={nodesRef}
              >
                <Nodes />
              </LayerWrapper>
              <LayerWrapper>
                <Connections
                  wrapperEl={wrapperRef.current}
                  customPathFunc={customPathFunc}
                />
              </LayerWrapper>
            </EditorContentWrapper>
            <NodeBrowser />
          </NodesContainer>
        </EditorWrapper>
      </StoreContext.Provider>
    )
  },
)
