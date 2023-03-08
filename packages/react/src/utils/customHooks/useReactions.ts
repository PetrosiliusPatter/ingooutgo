import { Connection, Node } from "@ingooutgo/core"
import { reaction } from "mobx"
import { useEffect } from "react"

import { EditorStore } from "../../stores/EditorStore"

export type Reactions = {
  onConnection?: (connection: Connection<any>) => void
  onConnectionRemoval?: (connection: Connection<any>) => void
  onNodeRemoval?: (node: Node) => void
  onSelectionChanged?: (selectedNodes: Node[]) => void
}

export const useReactions = (store: EditorStore, reactions?: Reactions) => {
  useEffect(() => {
    return reaction(
      () => store.getAllConnections(),
      (connections, prevConnections) => {
        const addedConnections = connections.filter(
          (connection) => !prevConnections.includes(connection)
        )
        const removedConnections = prevConnections.filter(
          (connection) => !connections.includes(connection)
        )

        if (addedConnections.length && reactions?.onConnection) {
          for (const connection of addedConnections) {
            reactions?.onConnection(connection)
          }
        }

        if (removedConnections.length && reactions?.onConnectionRemoval) {
          for (const connection of removedConnections) {
            reactions?.onConnectionRemoval(connection)
          }
        }
      }
    )
  }, [store, reactions?.onConnection, reactions?.onConnectionRemoval])

  useEffect(() => {
    return reaction(
      () => store.nodes,
      (nodes, prevNodes) => {
        const removedNodes = prevNodes.filter((node) => !nodes.includes(node))

        if (removedNodes.length && reactions?.onNodeRemoval) {
          for (const node of removedNodes) {
            reactions?.onNodeRemoval(node)
          }
        }
      }
    )
  }, [store, reactions?.onNodeRemoval])

  useEffect(() => {
    return reaction(
      () => store.selectedNodes,
      (selectedNodes, prevSelectedNodes) => {
        if (selectedNodes.length !== prevSelectedNodes.length) {
          reactions?.onSelectionChanged?.(selectedNodes)
        }
      }
    )
  }, [store, reactions?.onSelectionChanged])
}
