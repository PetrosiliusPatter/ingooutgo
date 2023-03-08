import { EditorStore } from "../stores/EditorStore"
import { Catalog, NodeRegistration, Position } from "../types"

const findRegistrationInCatalog = (
  catalog: Catalog,
  registrationId: string
): NodeRegistration | undefined => {
  let found = catalog.nodes.find((n) => n.id === registrationId)
  if (!found) {
    for (const category of Object.values(catalog.subcategories)) {
      found = findRegistrationInCatalog(category, registrationId)
      if (found) {
        break
      }
    }
  }
  return found
}

type SerializedConnection = {
  from: string
  to: string
}

type SerializedNode = {
  registrationId: string
  inputNames: Record<string, string>
  outputNames: Record<string, string>
  data: Record<string, any>
  position: Position
}

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
    .filter((n) => n.registrationId)
    .map((node) => ({
      registrationId: node.registrationId as string,
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
    const nodeReg = findRegistrationInCatalog(
      store.rootCatalog,
      serializedNode.registrationId
    )
    if (!nodeReg) {
      console.error(
        `Could not find registration for node with id ${serializedNode.registrationId}`
      )
      return []
    }
    const node = nodeReg.create()
    node.registrationId = serializedNode.registrationId
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
