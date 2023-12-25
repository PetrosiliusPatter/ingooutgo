import { reaction, toJS } from "../../deps/mobx.ts"
import { Connection } from "../../deps/nodl.ts"
import { useEffect } from "../../deps/react.ts"

import { EditorStore } from "../../stores/EditorStore.ts"
import { IngoNode } from "../../types/IngoNode.ts"

export type Reactions = {
  onConnection?: (connection: Connection<any>) => void
  onConnectionRemoval?: (connection: Connection<any>) => void
  onNodeRemoval?: (node: IngoNode) => void
  onSelectionChanged?: (
    selectedNodes: IngoNode[],
    selectedConnections: Connection<any>[],
  ) => void
}

export const useReactions = (store: EditorStore, reactions?: Reactions) => {
  useEffect(() => {
    return reaction(
      () => store.getAllConnections(),
      (connections, prevConnections) => {
        const addedConnections = connections.filter(
          (connection) => !prevConnections.includes(connection),
        )
        const removedConnections = prevConnections.filter(
          (connection) => !connections.includes(connection),
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
      },
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
      },
    )
  }, [store, reactions?.onNodeRemoval])

  useEffect(() => {
    return reaction(
      () => ({
        nodes: store.selectedNodes,
        connections: store.selectedConnections,
      }),
      ({ nodes, connections }, { nodes: prevNodes, connections: prevConnections }) => {
        const differentNodes = nodes.length !== prevNodes.length ||
          nodes.some((node) => prevNodes.find((n) => n.id !== node.id))
        const differentConnections = connections.length !== prevConnections.length ||
          connections.some((connection) =>
            prevConnections.find((c) => c.id !== connection.id)
          )
        if (differentNodes || differentConnections) {
          reactions?.onSelectionChanged?.(toJS(nodes), toJS(connections))
        }
      },
    )
  }, [store, reactions?.onSelectionChanged])
}
