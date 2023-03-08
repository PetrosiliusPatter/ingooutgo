import { observer } from "mobx-react-lite"
import * as React from "react"

import { StoreContext } from "../../stores/EditorStore"
import { Position } from "../../types/Misc"
import { elToPos } from "../../utils/misc"
import { classNames } from "../../utils/styleUtils"
import { StyledG } from "./styles"

type ConnectionProps = {
  container: HTMLElement
  connectionId?: string
  a: string
  b: string
  pathFunc?: (start: Position, end: Position) => string
}

const defaultPathFunc = (start: Position, end: Position) => {
  const x1 = start.x
  const y1 = start.y
  const x4 = end.x
  const y4 = end.y
  const min_diff = 20
  let offset: number

  if (Math.abs(y4 - y1) < min_diff * 2) {
    offset = Math.abs(y4 - y1) / 2
  } else {
    offset = min_diff
  }

  let offsetX = offset
  let offsetY = offset

  if (y4 - y1 < 0) {
    offsetY = -offset
  }

  if (x4 - x1 < -(min_diff * 2)) {
    offsetX = -offset
  }

  const midX = (x4 - x1) / 2 + x1

  return `
        M${x1},${y1} 
        L${midX - offsetX},${y1} 
        Q${midX},${y1} ${midX},${y1 + offsetY} 
        L${midX},${y4 - offsetY}
        Q${midX},${y4} ${midX + offsetX},${y4}
        L${x4},${y4}
    `
}

export const Connection = observer(
  ({ a, b, container, connectionId, pathFunc }: ConnectionProps) => {
    const { store } = React.useContext(StoreContext)

    const conRef = React.useRef<SVGPathElement>(null)

    const aRect = store.getSocketRect(a)
    const aPos =
      a === "mouse" ? store.mousePosition : aRect ? elToPos(aRect, container) : null
    const bRect = store.getSocketRect(b)
    const bPos =
      b === "mouse" ? store.mousePosition : bRect ? elToPos(bRect, container) : null

    React.useEffect(() => {
      if (!connectionId || !conRef.current) return
      store.setConnectionElement(connectionId, conRef.current)
      return () => {
        store.setConnectionElement(connectionId, null)
      }
    }, [connectionId, conRef.current])

    const isFixSelected = !!store.selectedConnections.find((c) => c.id === connectionId)
    const isTempSelected =
      !!connectionId && store.tempSelection.connectionIds.includes(connectionId)
    const isSelected = isFixSelected || isTempSelected

    const pathString = React.useMemo(() => {
      if (!aPos || !bPos) return ""
      return (pathFunc ?? defaultPathFunc)(aPos, bPos)
    }, [aPos, bPos, pathFunc])

    const handleOnClick = React.useCallback(() => {
      const con = store.getAllConnections().find((c) => c.id === connectionId)
      if (!con) return

      if (!store.isExtendingSelection) {
        store.setSelectedConnections([con])
        return
      }
      if (!isFixSelected) {
        store.setSelectedConnections([...store.selectedConnections, con])
        return
      }
      const newSel = store.selectedConnections.filter((c) => c.id !== connectionId)
      store.setIsExtendingSelection(false)
      store.setSelectedConnections(newSel)
      store.setIsExtendingSelection(true)
    }, [
      connectionId,
      isFixSelected,
      store.isExtendingSelection,
      store.selectedConnections,
    ])

    if (!aPos || !bPos) return <></>
    return (
      <StyledG selected={isSelected} className={classNames.connectionG}>
        <path
          ref={conRef}
          className="connector"
          d={pathString}
          fill="none"
          strokeWidth="4"
          onClick={handleOnClick}
        />
      </StyledG>
    )
  }
)
