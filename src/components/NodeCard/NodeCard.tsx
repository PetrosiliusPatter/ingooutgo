import { camelcase } from "../../deps/camelcase.ts"
import { Draggable, DraggableEventHandler } from "../../deps/react-draggable.ts"
import {
  FC,
  React,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../deps/react.ts"
import * as Icons from "../../deps/tabler-icons-react.ts"
import { IconProps } from "../../deps/tabler-icons-react.ts"

import { observer } from "../../deps/mobx-react-lite.ts"
import { StoreContext } from "../../stores/EditorStore.ts"
import { classNames } from "../../utils/styleUtils.ts"
import { NodeField } from "../NodeField/NodeField.tsx"
import {
  Divider,
  NodeIconWrapper,
  NodeLabel,
  NodeTitleBar,
  NodeWrapper,
} from "./styles.ts"
import { stopEvent } from "../../utils/misc.ts"
type NodeCardProps = {
  nodeId: string
}

export const NodeCard: FC<NodeCardProps> = observer(
  ({ nodeId }: NodeCardProps) => {
    const { store } = useContext(StoreContext)
    const nodeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!nodeRef.current) return
      store?.setNodeElement(nodeId, nodeRef.current)
      return () => {
        store?.removeNodeElement(nodeId)
      }
    }, [store, nodeId])

    const nodeData = store?.getNodeById(nodeId)
    const position = store?.nodePositions.get(nodeId) ?? { x: 0, y: 0 }
    const fixSelected = store?.selectedNodes.find((n) => n.id === nodeId)
    const tempSelected = store?.tempSelection.nodeIds.find((n) => n === nodeId)
    const selected = (fixSelected ?? tempSelected) != undefined

    const nodeRegistration = useMemo(() => {
      if (!store) return null

      const registrationId = nodeData?.data.registrationId
      if (!registrationId) return null

      return store.getRegistrationById(registrationId)
    }, [nodeData?.data.registrationId, store])

    const onDragStartHander = useCallback<DraggableEventHandler>(
      (e) => {
        if (!store) return
        if (!nodeData) return
        e.stopPropagation()

        if (!selected) {
          store.setSelectedNodes([nodeData])
        }

        if (!store.isExtendingSelection) return

        e.preventDefault()

        if (selected) {
          store.setIsExtendingSelection(false)
          store.setSelectedNodes([nodeData])
          store.setIsExtendingSelection(true)
        }

        return false
      },
      [store, nodeData, selected],
    )

    const onDragHandler = useCallback<DraggableEventHandler>(
      (_, data) => {
        if (!store) return
        if (nodeData && !store.isExtendingSelection && !selected) {
          store.setSelectedNodes([nodeData])
        }
        store.offsetSelectedNodesPosition({ x: data.deltaX, y: data.deltaY })
      },
      [nodeData, selected, store],
    )

    const renderedIcon = useMemo(() => {
      const icon = nodeRegistration?.icon
      if (!icon) return <></>

      const iconName = camelcase(icon, { pascalCase: true })
      if (!Icons[iconName as keyof typeof Icons]) return <></>

      const TablerIcon: FC<IconProps> = Icons[iconName as keyof typeof Icons]
      return (
        <NodeIconWrapper className={classNames.nodeTitleIcon} selected={selected}>
          <TablerIcon size={"1rem"} />
        </NodeIconWrapper>
      )
    }, [selected, nodeRegistration?.icon])

    const renderedFields = useMemo(() => {
      if (!nodeData) return <></>

      const inFields = Object.values(nodeData.inputs).map((info, ind) => (
        <NodeField key={`input-${ind}`} nodeId={nodeId} fieldId={info.id} />
      ))
      const outFields = Object.values(nodeData.outputs).map((info, ind) => (
        <NodeField key={`output-${ind}`} nodeId={nodeId} fieldId={info.id} />
      ))
      return [...inFields, ...outFields]
    }, [nodeData, nodeId])

    if (!nodeData) return <></>
    return (
      // @ts-ignore - draggable typings are wrong
      <Draggable
        onStart={onDragStartHander}
        onDrag={onDragHandler}
        position={position}
        cancel=".field-comp"
        nodeRef={nodeRef}
      >
        <NodeWrapper
          className={classNames.nodeCard}
          selected={selected}
          ref={nodeRef}
        >
          <NodeTitleBar
            className={classNames.nodeTitleBar}
            titleBarColor={nodeRegistration?.accentColor}
          >
            {renderedIcon}
            <NodeLabel className={classNames.nodeTitleLabel}>{nodeData.name}</NodeLabel>
          </NodeTitleBar>
          <Divider
            className={classNames.nodeDivider}
            titleBarColor={nodeRegistration?.accentColor}
          />
          {renderedFields}
        </NodeWrapper>
      </Draggable>
    )
  },
)
