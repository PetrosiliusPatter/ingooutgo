import { useCallback } from "../../deps/react.ts"
import { z } from "../../deps/zod.ts"
import { EditorStore } from "../../stores/EditorStore.ts"
import { SerializedNodeSchema } from "../../types/IngoNode.ts"
import { Position } from "../../types/Misc.ts"
import { loadSerializedNodes, serializeNodes } from "../storeSerialization.ts"

export const useCopyPasteNodes = (store: EditorStore) => {
  const copyNodes = useCallback(
    () => {
      const nodesToCopy = store.selectedNodes
      const mousePosition = store.mousePosition
      const offsetNodePositions = nodesToCopy.reduce(
        (acc, node, i) => {
          const nodePosition = store.nodePositions.get(node.id)
          return {
            ...acc,
            [node.id]: {
              x: nodePosition ? (nodePosition.x - mousePosition.x) : (i * 10),
              y: nodePosition ? (nodePosition.y - mousePosition.y) : (i * 10),
            },
          }
        },
        {} as Record<string, Position>,
      )
      const serialized = serializeNodes(nodesToCopy, offsetNodePositions)
      navigator.clipboard.writeText(JSON.stringify(serialized))
    },
    [store],
  )

  const pasteNodes = useCallback((clipboard: string) => {
    const parsedCopiedNodesRes = z.array(SerializedNodeSchema).safeParse(
      JSON.parse(clipboard),
    )
    if (!parsedCopiedNodesRes.success) {
      console.error("Could not parse copied nodes", parsedCopiedNodesRes.error)
      return
    }

    const parsedCopiedNodes = parsedCopiedNodesRes.data.map((n) => ({
      ...n,
      position: {
        x: n.position.x + store.mousePosition.x,
        y: n.position.y + store.mousePosition.y,
      },
    }))

    const insertedNodes = loadSerializedNodes(store, parsedCopiedNodes)
    store.clearSelection()
    store.setSelectedNodes(insertedNodes)
  }, [store])

  return { copyNodes, pasteNodes }
}
