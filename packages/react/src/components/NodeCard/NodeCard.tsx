import camelcase from "camelcase"
import { observer } from "mobx-react-lite"
import * as React from "react"
import Draggable, { DraggableEventHandler } from "react-draggable"
import { IconProps } from "tabler-icons-react"
import * as Icons from "tabler-icons-react"

import { StoreContext } from "../../stores/EditorStore"
import { classNames } from "../../utils/styleUtils"
import { NodeField } from "../NodeField"
import { Divider, NodeIconWrapper, NodeLabel, NodeTitleBar, NodeWrapper } from "./styles"

type NodeCardProps = {
  nodeId: string
}

export const NodeCard: React.FC<NodeCardProps> = observer(({ nodeId }: NodeCardProps) => {
  const { store } = React.useContext(StoreContext)
  const nodeRef = React.useRef(null)

  React.useEffect(() => {
    if (!nodeRef.current) return
    store.setNodeElement(nodeId, nodeRef.current)
    return () => {
      store.removeNodeElement(nodeId)
    }
  }, [nodeRef, store])

  const nodeData = store.getNodeById(nodeId)
  const position = store.nodePositions.get(nodeId) || { x: 0, y: 0 }
  const fixSelected = store.selectedNodes.find((n) => n.id === nodeId)
  const tempSelected = store.tempSelection.nodeIds.find((n) => n === nodeId)
  const selected = (fixSelected || tempSelected) != undefined

  const onDragStartHander = React.useCallback<DraggableEventHandler>(
    (e) => {
      if (!nodeData) return
      e.stopPropagation()

      if (!selected) {
        store.setSelectedNodes([nodeData])
      }

      if (!store.isExtendingSelection) {
        store.setSelectedConnections([])
        return
      }
      e.preventDefault()

      if (selected) {
        const newSelection = store.selectedNodes.filter((n) => n.id !== nodeId)
        store.setIsExtendingSelection(false)
        store.setSelectedNodes(newSelection)
        store.setIsExtendingSelection(true)
      }

      return false
    },
    [nodeData, selected, nodeId, store.isExtendingSelection, store.selectedNodes]
  )

  const onDragHandler = React.useCallback<DraggableEventHandler>(
    (_, data) => {
      if (nodeData && !store.isExtendingSelection && !selected) {
        store.setSelectedNodes([nodeData])
      }
      store.offsetSelectedNodesPosition({ x: data.deltaX, y: data.deltaY })
    },
    [nodeData, selected, store.isExtendingSelection, store.selectedNodes]
  )

  const renderedIcon = React.useMemo(() => {
    if (!nodeData?.icon) return <></>

    const iconName = camelcase(nodeData.icon, { pascalCase: true })
    if (!Icons[iconName as keyof typeof Icons]) return <></>

    const TablerIcon: React.FC<IconProps> = Icons[iconName as keyof typeof Icons]
    return (
      <NodeIconWrapper className={classNames.nodeTitleIcon} selected={selected}>
        <TablerIcon size={"1rem"} />
      </NodeIconWrapper>
    )
  }, [selected, nodeData?.icon])

  const renderedFields = React.useMemo(() => {
    if (!nodeData) return <></>

    const inFields = Object.values(nodeData.inputs).map((info, ind) => (
      <NodeField key={`input-${ind}`} nodeId={nodeId} fieldId={info.id} />
    ))
    const outFields = Object.values(nodeData.outputs).map((info, ind) => (
      <NodeField key={`output-${ind}`} nodeId={nodeId} fieldId={info.id} />
    ))
    return [...inFields, ...outFields]
  }, [nodeId, nodeData?.inputs, nodeData?.outputs])

  if (!nodeData) return <></>
  return (
    <Draggable
      onStart={onDragStartHander}
      onDrag={onDragHandler}
      position={position}
      cancel=".field-comp"
    >
      <NodeWrapper className={classNames.nodeCard} selected={selected} ref={nodeRef}>
        <NodeTitleBar
          className={classNames.nodeTitleBar}
          titleBarColor={nodeData.accentColor}
        >
          {renderedIcon}
          <NodeLabel className={classNames.nodeTitleLabel}>{nodeData.name}</NodeLabel>
        </NodeTitleBar>
        <Divider
          className={classNames.nodeDivider}
          titleBarColor={nodeData.accentColor}
        />
        {renderedFields}
      </NodeWrapper>
    </Draggable>
  )
})
