import { mathCatalog } from "../examples/nodes-example/index.ts"
import { addNodeRegistraion } from "../examples/nodes-example/src/nodes/math/AddNode.ts"
import {
  EditorStore,
  IngoNodeFromRegistration,
  loadSerializedNodes,
  SerializedNode,
  serializeNodes,
} from "../index.ts"

type AddNodeType = IngoNodeFromRegistration<typeof addNodeRegistraion>

const store = new EditorStore(mathCatalog)

const createAddNode = () => {
  const addNode1 = addNodeRegistraion.createNode()
  store.addNode(addNode1)

  return addNode1
}

const editNodeValue = (node: AddNodeType) => {
  node.inputs.a.next(10)
}

const serializeNode = (node: AddNodeType) => serializeNodes([node], {})

const clearAndLoad = (serializedNodes: SerializedNode[]): AddNodeType => {
  store.clear()
  return loadSerializedNodes(store, serializedNodes)[0] as AddNodeType
}

const readNodeValue = (node: AddNodeType, label?: string) => {
  const subscription = node.outputs.output?.subscribe((r) =>
    console.log(label ?? "Result:", r)
  )
  subscription?.unsubscribe()
}

const main = () => {
  const addNode = createAddNode()
  editNodeValue(addNode)
  readNodeValue(addNode, "Before serialization")

  const serialized = serializeNode(addNode)

  const newAddNode = clearAndLoad(serialized)
  if (!newAddNode) throw new Error("Could not load node")
  readNodeValue(newAddNode, "After serialization")
}

main()
