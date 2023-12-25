import { toJS } from "../deps/mobx.ts"
import { Connection } from "../deps/nodl.ts"
import { EditorStore } from "../stores/EditorStore.ts"
import { IngoNode, SerializedNode } from "../types/IngoNode.ts"
import { Position } from "../types/Misc.ts"
import { isDefined } from "./typeUtils.ts"

export const serializeConnection = (connection: Connection<any>) => ({
  from: connection.from.id,
  to: connection.to.id,
})

export const serializeAllNodes = (store: EditorStore) => {
  const positionsForNodes = store.nodes.reduce(
    (acc, { id }) => ({ ...acc, [id]: store.nodePositions.get(id) }),
    {} as Record<string, Position | undefined>,
  )

  return serializeNodes(store.nodes, positionsForNodes)
}

export const serializeNodes = (
  nodes: IngoNode[],
  positionsForNodes: Record<IngoNode["id"], Position | undefined>,
) => {
  const serializedNodes: SerializedNode[] = nodes
    .map((node) => ({
      inputNames: Object.entries(node.inputs).reduce(
        (acc, [name, input]) => ({ ...acc, [input.id]: name }),
        {} as Record<string, string>,
      ),
      outputNames: Object.entries(node.outputs).reduce(
        (acc, [name, output]) => ({ ...acc, [output.id]: name }),
        {} as Record<string, string>,
      ),
      data: toJS(node.data),
      position: toJS(positionsForNodes[node.id]) ?? { x: 0, y: 0 },
      outConnections: node.connections.reduce((acc, connection) => {
        const outputList = acc[connection.from.name] ?? []
        return { ...acc, [connection.from.name]: [...outputList, connection.to.id] }
      }, {} as Record<string, string[]>),
    }))

  return serializedNodes
}

export const loadSerializedNodes = (
  store: EditorStore,
  serializedNodes: SerializedNode[],
): IngoNode[] => {
  const newNodes = serializedNodes.map((serializedNode) => {
    const regId = serializedNode.data.registrationId
    if (!regId) {
      console.error(`Could not get registration id (data is ${serializedNode.data})`)
      return
    }

    const nodeReg = store.getRegistrationById(regId)
    if (!nodeReg) {
      console.error(`Could not find registration for node with id ${regId}`)
      return
    }

    const node = nodeReg.createNode()
    node.data = serializedNode.data

    return { serializedNode, node }
  }).filter(isDefined)

  const newConnections = newNodes.flatMap(({ serializedNode, node }) =>
    Object.entries(serializedNode.outConnections).flatMap(([outputName, socketIds]) =>
      socketIds.map((socketId) => {
        const newSocketIdToConnectFrom = Object.values(node.outputs)
          .find(({ name }) => name === outputName)?.id

        if (!newSocketIdToConnectFrom) return

        const newNodeToConnectTo = newNodes.find(({ serializedNode }) =>
          serializedNode.inputNames[socketId]
        )
        const socketNameToConnectTo = newNodeToConnectTo?.serializedNode
          .inputNames[socketId]

        const newSocketToConnectTo = newNodeToConnectTo?.node
          .inputs[socketNameToConnectTo ?? ""]?.id

        if (!newSocketToConnectTo) return

        return {
          from: [node.id, newSocketIdToConnectFrom] as [string, string],
          to: [newNodeToConnectTo.node.id, newSocketToConnectTo] as [string, string],
        }
      }).filter(isDefined)
    )
  )

  newNodes.forEach(({ serializedNode, node }) =>
    store.addNode(node, serializedNode.position)
  )

  newConnections.forEach(({ from, to }) => store.connectSockets(from, to))

  return newNodes.map(({ node }) => node)
}
