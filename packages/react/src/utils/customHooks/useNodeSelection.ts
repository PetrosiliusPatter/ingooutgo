import { Box, boxesIntersect, useSelectionContainer } from "@air/react-drag-to-select"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Intersection, ShapeInfo } from "kld-intersections"
import { useEffect } from "react"

import { useIsKeyPressed } from "."
import { EditorStore } from "../../stores/EditorStore"

type Props = {
  store: EditorStore
  wrapperRef: React.RefObject<HTMLDivElement>
}

export const useNodeSelection = ({ store, wrapperRef }: Props) => {
  const shiftPressed = useIsKeyPressed("Shift")

  useEffect(() => {
    store.setIsExtendingSelection(shiftPressed)
  }, [shiftPressed, store])

  const { DragSelection } = useSelectionContainer({
    onSelectionStart: () => {
      store.setSelectedNodes([])
      store.setSelectedConnections([])
    },
    onSelectionChange: (box: Box) => {
      const wrapperBounds = wrapperRef.current?.getBoundingClientRect()
      if (!wrapperBounds) return

      const selectedNodeIds: string[] = []
      store.nodeElements.forEach((v, k) => {
        if (boxesIntersect(box, v.getBoundingClientRect())) {
          selectedNodeIds.push(k)
        }
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
