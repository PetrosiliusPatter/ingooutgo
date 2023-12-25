import {
  MouseEventHandler,
  React,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "../../deps/react.ts"

import { observer } from "../../deps/mobx-react-lite.ts"
import { StoreContext } from "../../stores/EditorStore.ts"
import { Position } from "../../types/Misc.ts"
import { stopEvent } from "../../utils/misc.ts"
import { classNames } from "../../utils/styleUtils.ts"
import { StyledG } from "./styles.ts"

export type PathFunc = (start: Position, end: Position) => string

type ConnectionProps = {
  container: HTMLElement
  connectionId?: string
  a: string
  b: string
  pathFunc?: PathFunc
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
    const { store } = useContext(StoreContext)

    const conRef = useRef<SVGPathElement>(null)

    const aPos = a === "mouse" ? store?.mousePosition : store?.getSocketRect(a)
    const bPos = b === "mouse" ? store?.mousePosition : store?.getSocketRect(b)

    useEffect(() => {
      if (!connectionId || !conRef.current || !store) return
      store.setConnectionElement(connectionId, conRef.current)
      return () => {
        store.setConnectionElement(connectionId, null)
      }
    }, [connectionId, store])

    const isFixSelected = !!store?.selectedConnections.find((c) => c.id === connectionId)
    const isTempSelected = !!connectionId &&
      store?.tempSelection.connectionIds.includes(connectionId)
    const isSelected = isFixSelected || isTempSelected

    const pathString = useMemo(() => {
      if (!aPos || !bPos) return ""
      return (pathFunc ?? defaultPathFunc)(aPos, bPos)
    }, [aPos, bPos, pathFunc])

    const handleOnClick = useCallback<MouseEventHandler>(
      (e) => {
        stopEvent(e)
        if (!store) return

        const con = store.getAllConnections().find((c) => c.id === connectionId)
        if (!con) return

        if (store.isExtendingSelection) {
          store.setSelectedConnections([...store.selectedConnections, con])
        } else {
          store.setSelectedNodes([])
          store.setSelectedConnections([con])
        }
      },
      [connectionId, store],
    )

    if (!aPos || !bPos) return <></>
    return (
      <StyledG selected={isSelected} className={classNames.connectionG}>
        <path
          ref={conRef}
          className="connector"
          d={pathString}
          fill="none"
          strokeWidth="4"
          onMouseDown={handleOnClick}
        />
      </StyledG>
    )
  },
)
