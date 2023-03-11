import { EditorStore } from "../stores/EditorStore"
import { Catalog, SerializedConnection, SerializedNode } from "../types"

export type SerializedStore = {
  nodes: SerializedNode[]
  connections: SerializedConnection[]
}

export const serializeStore = (store: EditorStore): SerializedStore => {
  const serializedConnections = store.getAllConnections().map((connection) => {
    return {
      from: connection.from.id,
      to: connection.to.id,
    }
  })
  const serializedNodes: SerializedNode[] = store.nodes
    .filter((n) => n.data.registrationId)
    .map((node) => ({
      registrationId: node.data.registrationId as string,
      inputNames: Object.entries(node.inputs).reduce((acc, [name, input]) => {
        return { ...acc, [input.id]: name }
      }, {} as Record<string, string>),
      outputNames: Object.entries(node.outputs).reduce((acc, [name, output]) => {
        return { ...acc, [output.id]: name }
      }, {} as Record<string, string>),
      data: node.data,
      position: store.nodePositions.get(node.id) || { x: 0, y: 0 },
    }))
  return {
    nodes: serializedNodes,
    connections: serializedConnections,
  }
}

export const loadSerializedStore = (catalog: Catalog, serialized: SerializedStore) => {
  const store = new EditorStore(catalog)
  const newNodes = serialized.nodes.flatMap((serializedNode) => {
    const regId = serializedNode.data.registrationId || ""
    const nodeReg = store.getRegistrationById(regId)
    if (!nodeReg) {
      console.error(`Could not find registration for node with id ${regId}`)
      return []
    }
    const node = nodeReg.createNode()
    node.data = serializedNode.data
    return { serializedNode, node }
  })
  newNodes.forEach(({ serializedNode, node }) =>
    store.addNode(node, serializedNode.position)
  )
  serialized.connections.forEach((serializedConnection) => {
    const aNode = newNodes.find(
      ({ serializedNode }) => serializedNode.outputNames[serializedConnection.from]
    )
    const bNode = newNodes.find(
      ({ serializedNode }) => serializedNode.inputNames[serializedConnection.to]
    )

    if (!aNode || !bNode) {
      console.error(
        `Could not find connection for ${serializedConnection.from} -> ${serializedConnection.to}`
      )
      return
    }
    const aSocketId =
      aNode.node.outputs[aNode.serializedNode.outputNames[serializedConnection.from]].id
    const bSocketId =
      bNode.node.inputs[bNode.serializedNode.inputNames[serializedConnection.to]].id

    store.connectSockets([aNode.node.id, aSocketId], [bNode.node.id, bSocketId])
  })
  return store
}
