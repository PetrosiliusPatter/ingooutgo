import { observer } from "mobx-react-lite"
import * as React from "react"

import { EditorStore, StoreContext } from "../../stores/EditorStore"
import {
  Reactions,
  useKeyboardActions,
  useNodeSelection,
  useReactions,
} from "../../utils/customHooks"
import { classNames } from "../../utils/styleUtils"
import { Connection } from "../Connection"
import { NodeBrowser } from "../NodeBrowser"
import { NodeCard } from "../NodeCard/NodeCard"
import { EditorContentWrapper, NodesContainer, EditorWrapper } from "./styles"

const Nodes = observer(() => {
  const { store } = React.useContext(StoreContext)
  return (
    <>
      {Array.from(store.nodes.values() || []).map((node, ind) => (
        <NodeCard key={`node-${ind}`} nodeId={node.id}></NodeCard>
      ))}
    </>
  )
})

type ConnectionProps = {
  wrapperEl: HTMLElement | null
}
const Connections = observer(({ wrapperEl }: ConnectionProps) => {
  const { store } = React.useContext(StoreContext)

  if (!wrapperEl) return null

  const currConStart = store.connectionStartIds?.[1]
  const currConEnd = store.connectionEndIds?.[1] || "mouse"

  return (
    <svg id="connections" width="100%" height="100%">
      {store.getAllConnections().map((connection) => (
        <Connection
          container={wrapperEl}
          key={connection.id}
          connectionId={connection.id}
          a={connection.from.id}
          b={connection.to.id}
        />
      ))}

      {currConStart && currConEnd && (
        <Connection
          container={wrapperEl}
          key={"currCon"}
          a={currConStart}
          b={currConEnd}
        />
      )}
    </svg>
  )
})

type EditorProps = {
  store: EditorStore
  reactions?: Reactions
}

export const NodeEditor = observer(({ store, reactions }: EditorProps) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  // This is a hack to rerender once the ref is aquired
  // https://stackoverflow.com/a/65942218/8506535
  const [, setRefAquired] = React.useState(false)
  React.useEffect(() => {
    setRefAquired(true)
  }, [])

  useKeyboardActions(store)
  useReactions(store, reactions)
  const { DragSelection } = useNodeSelection({ store, wrapperRef })

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
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
    [wrapperRef.current, store]
  )

  React.useEffect(() => {
    if (!wrapperRef.current) return
    const wrapper = wrapperRef.current

    const confirmConnection = () => store.confirmConnection()

    wrapper.removeEventListener("mouseup", confirmConnection)
    wrapper.addEventListener("mouseup", confirmConnection)
    return () => {
      wrapper.removeEventListener("mouseup", confirmConnection)
    }
  }, [store, wrapperRef.current])

  return (
    <StoreContext.Provider value={{ store }}>
      <EditorWrapper className={classNames.editorWrapper}>
        <NodesContainer
          onMouseMove={onMouseMove}
          onMouseDown={() => store.setTempSelection()}
          className={classNames.nodesContainer}
        >
          <EditorContentWrapper ref={wrapperRef}>
            <DragSelection />
            <Nodes />
            <Connections wrapperEl={wrapperRef.current} />
          </EditorContentWrapper>
          <NodeBrowser />
        </NodesContainer>
      </EditorWrapper>
    </StoreContext.Provider>
  )
})
