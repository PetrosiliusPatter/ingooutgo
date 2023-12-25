import { Intersection, ShapeInfo } from "../../deps/kld-intersections.ts"
import {
  Box,
  boxesIntersect,
  useSelectionContainer,
} from "../../deps/react-drag-to-select.ts"
import { RefObject, useEffect } from "../../deps/react.ts"

import { EditorStore } from "../../stores/EditorStore.ts"
import { useIsKeyPressed } from "./useIsKeyPressed.ts"

type Props = {
  store: EditorStore
  wrapperRef: RefObject<HTMLDivElement>
  nodesRef: RefObject<HTMLDivElement>
}

export const useNodeSelection = ({ store, wrapperRef, nodesRef }: Props) => {
  const shiftPressed = useIsKeyPressed("Shift")

  useEffect(() => {
    store.setIsExtendingSelection(shiftPressed)
  }, [shiftPressed, store])

  const { DragSelection } = useSelectionContainer({
    onSelectionStart: () => {
      store.setSelectedNodes([])
      store.setSelectedConnections([])
    },
    shouldStartSelecting: (e) => {
      if (!e) return false
      if (!nodesRef.current) return false
      if (nodesRef.current === e) {
        store.confirmTempSelection()
        return true
      }
      if (!(e instanceof HTMLElement || e instanceof SVGElement)) return false

      return !nodesRef.current?.contains(e)
    },
    onSelectionChange: (box: Box) => {
      const wrapperBounds = wrapperRef.current?.getBoundingClientRect()
      if (!wrapperBounds) return

      const selectedNodeIds: string[] = []
      store.nodeElements.forEach((v, k) => {
        if (!boxesIntersect(box, v.getBoundingClientRect())) return
        selectedNodeIds.push(k)
      })

      const selectedConnIds: string[] = []
      store.connectionElements.forEach((v, k) => {
        const path = v.getAttribute("d")
        if (!path) return

        const pathShape = ShapeInfo.path(path)
        const boxShape = ShapeInfo.rectangle({
          ...box,
          left: box.left - wrapperBounds.left,
          top: box.top - wrapperBounds.top,
        })
        const intersections = Intersection.intersect(pathShape, boxShape)
        if (intersections.status === "Intersection") {
          return selectedConnIds.push(k)
        }

        const pathBounds = v.getBoundingClientRect()
        if (
          pathBounds.x > box.left &&
          pathBounds.x < box.left + box.width &&
          pathBounds.y > box.top &&
          pathBounds.y < box.top + box.height
        ) {
          return selectedConnIds.push(k)
        }
      })

      store.setTempSelection(selectedNodeIds, selectedConnIds)
    },
    onSelectionEnd: () => {
      store.confirmTempSelection()
    },
  })

  return { DragSelection }
}
