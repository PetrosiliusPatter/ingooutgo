# IngoOutgo

[![IngoOutgo CI](https://github.com/petrosiliuspatter/ingooutgo/actions/workflows/main.yaml/badge.svg)](https://github.com/petrosiliuspatter/ingooutgo/actions/workflows/main.yaml)

A custom frontend for Emil Widlund's amazing [Nodl](https://github.com/emilwidlund/nodl)!

[View Demo](https://petrosiliuspatter.github.io/ingooutgo/)
![Visual representation of IngoOutgo](assets/ingooutgo.png?raw=true)

Differences to the original Nodl UI:

- UI is themable, using classnames and css variables (to-do: how-to)
- Custom rendering of connections between nodes
- While creating a new connection, the connection snaps to compatible sockets
- Nodes can be defined with accent color and a neat icon
- Fields for nodes can be defined with custom UI components
- Selecting nodes feels a bit nicer (opinionated)

---

### NodeEditor

The fundamental piece which renders a surface with fully interactive Nodes & Connections.

#### API

- `store: EditorStore` An Editor store which holds the internal editor state along with associated nodes.
- `reactions?: Reactions` An optional dictionary with callbacks.
  - `onConnection?: (connection: Connection<any>) => void` A callback which fires when new connections are made.
  - `onConnectionRemoval?: (connection: Connection<any>) => void` An callback which fires when connections are removed.
  - `onNodeRemoval?: (node: IngoNode) => void` An callback which fires when nodes are removed.
  - `onSelectionChanged?: (nodes: IngoNode[], connections: Connection<any>) => void` An callback which fires when selected nodes changes.
- `customPathFunc?: (start: Position, end: Position) => string` A function to generate the SVG-Path between two points. Used for rendering the connections ([see here](#custom-path-function)).

```typescript
// see below on how to create a node catalog
const nodeCatalog: Catalog = {
  nodes: [],
  subcategories: {
    mathNodes: mathCatalog,
    stringNodes: stringCatalog,
  },
}
const store = new EditorStore(nodeCatalog)

const App = () => {
  return (
    <Canvas
      store={store}
      reactions={{
        onConnection: (connection) => console.log("NEW CONNECTION", connection),
        onConnectionRemoval: (connection) =>
          console.log("REMOVED CONNECTION", connection),
        onNodeRemoval: (node) => console.log("REMOVED NODE", node),
        onSelectionChanged: (nodes, connections) =>
          console.log("SELECTION CHANGED", { nodes, connections }),
      }}
    />
  )
}
```

#### Editor Store

The manager which is responsible for the editor state.

##### Properties

- `nodes: IngoNode[]` The associated nodes.
- `connections: Connection<any>[]` The associated connections.
- `selectedNodes: IngoNode[]` The currently selected nodes.
- `selectedConnections: Connection<any>[]` The currently selected connections.
- `nodeCatalog: Catalog` The node catalog.
- `mousePosition: MousePosition` Current mouse position within the Canvas surface.

##### Methods

- `addNode(node: IngoNode, position: {x: number, y: number})` Used to add a node at the given position.
- `removeNode(nodeId: IngoNode['id'])` Removes a node from the store.
- `setNodePosition(nodeId: IngoNode["id"], position: { x: number; y: number }` Sets the position of a node.
- `connectSockets(a: ConnectionIds | undefined, b: ConnectionIds | undefined)` Connects two sockets (each defined as `[nodeId, socketId]`)
- `removeConnection(connectionId: Connection<any>["id"])` Removes a connection from the store.
- `checkConnectionCompatibility(connectIdsA?: ConnectionIds, connectIdsB?: ConnectionIds): [Output<any>, Input<any>] | false` Checks for compatibility between nodes, and if compatible, returns them ordered as [Output<any>, Input<any>]
- `setSelectedNodes(nodes: IngoNode[])` Selects the given nodes.
- `setSelectedConnections(connections: Connection<any>[])` Selects the given connections.
- `deleteSelection()` Deletes the currently selected nodes & connections.
- `clear()` Deletes all nodes and connections.

#### Serialization

I expose two helpful functions for (de-)serializing the editor.

- `serializeStore(store: EditorStore): SerializedStore` Serializes into a nice object that you can store wherever.
- `loadSerializedStore(catalog: Catalog, serialized: SerializedStore): EditorStore` Takes a `Catalog` and serialized store, and returns a proper EditorStore.

As you can see, you still need to provide a `Catalog` for the store to work properly.

### Defining Nodes

To use nodl-nodes in the editor, you need to create a `NodeRegistration`. They contain all the information needed to create and render the node.
`NodeRegistration`s accept the following props:

- `id` To identify the registration
- `name` The name of the node
- `node` The nodl-node class
- `components` A dictionary of components to use for each socket. The keys should match the socket keys.
- `accentColor` An optional accent color to use for the node.
- `icon` An optional icon to use for the node (as TablerIcon name).

#### Example for a NodeRegistration (see examples/nodes-example)

```typescript
import { NodeRegistration } from "@ingooutgo/react"
import { Input, Output, Node } from "@nodl/core"
import { combineLatest, map } from "rxjs"

import { createNumberField } from "../../components/NumberField"

const numberSchema = z.number().describe("number")

// Define a nodl node
class AddNode extends Node {
  inputs = {
    a: new Input({
      name: "A",
      type: numberSchema,
      defaultValue: 1,
    }),
    b: new Input({
      name: "B",
      type: numberSchema,
      defaultValue: 1,
    }),
  }

  outputs = {
    output: new Output({
      name: "Output",
      type: numberSchema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => inputs.reduce((sum, value) => sum + value))
      ),
    }),
  }
}

// And create a NodeRegistration for it
const addNodeRegistraion = new NodeRegistration({
  id: "string/add",
  name: "Add",
  node: AddNode,
  components: {
    a: createNumberField({ schema: numberSchema }),
    b: createNumberField({ schema: numberSchema }),
    output: createNumberField({ schema: numberSchema }),
  },
  accentColor: "#2596be",
  icon: "MathSymbols",
})
```

### Defining a Catalog

For users to be able to select the node in the editor, and for the editor to be able to serialize them, you need to put your `NodeRegistration`s into a `Catalog`.
They are pretty straightforward:

```typescript
const mathCatalog: Catalog = {
  label: "Math",
  nodes: [addNodeRegistraion, subtractNodeRegistration],
  subcategories: {},
}
```

### Custom look

You can customize the theme of the editor using css variables, or by using exposed classnames. This was not tested extensively, but a small example is available [here](examples/react-example/src/containers/App/App.styles.ts).

You can also pass in a function to generating the SVG-Path for connections between nodes.

#### CSS variables

These are the available css variables and their default:

```css
.ingo {
  --color-text: rgba(255, 255, 255, 0.9);
  --color-editor-background: #343a40;
  --color-browser-divider: #343a40;
  --color-browser-background: rgba(0, 0, 0, 0.5);
  --color-browser-entry-highlight: rgba(0, 0, 0, 0.2);
  --color-node-background: #212529;
  --color-node-divider: #343a40;
  --color-node-background-lighter: #464c51;
  --color-node-icon-background: #464c51;
  --color-node-socket: #ffffff;
  --color-connection: #ffff;
  --color-selection: rgba(253, 126, 20, 1);
  --color-connection-selection: rgba(253, 126, 20, 1);
  --color-selection-shadow: rgba(253, 126, 20, 0.2);
  --color-input-border: #343a40;
  --color-input-background: #464c51;
  --color-input-background-lighter: #464c51;
  --node-border-radius: 0.5rem;
  --font-size: 1rem;
  --icon-size: 1rem;
  --socket-size: 0.5rem;
}
```

#### CSS classes

And these are the classnames for various components:

| Classname                       | Target                                     |
| ------------------------------- | ------------------------------------------ |
| `.ingo`                         | All components                             |
| `.connection-g`                 | A connection between sockets               |
| `.browser-search`               | The Search-field for the node browser      |
| `.browser-divider`              | The divider in the node browser            |
| `.browser-entry`                | An entry in the node browser               |
| `.browser-entry-label`          | The label for an entry in the node browser |
| `.node-browser`                 | The node browser itself                    |
| `.node-card`                    | The whole node card                        |
| `.node-title-bar`               | The title bar of a node                    |
| `.node-title-label`             | The title label of a node                  |
| `.node-title-icon`              | The icon of a node                         |
| `.node-divider`                 | The divider in the node card               |
| `.node-field`                   | A field inside a node                      |
| `.node-field-label`             | The label of a field                       |
| `.node-field-type`              | The type-text of a field                   |
| `.node-field-socket`            | The socket of a field                      |
| `.node-field-hover-zone`        | The hover zone of a field                  |
| `.node-field-component-wrapper` | The wrapper around a component for a field |
| `.editor-wrapper`               | The wrapper around the whole editor        |
| `.nodes-container`              | The container of the nodes                 |

#### Custom Path Function

You can pass in a function to generate the path for connections between sockets. The function should take two arguments: `from` and `to`, which are the coordinates of the sockets. The function should return a string that can be used as the `d`-attribute of an SVG-Path.

```typescript
// To render the path as a straight line between the sockets.
const customPathFunction = (from: Position, to: Position) => {
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
}
```
