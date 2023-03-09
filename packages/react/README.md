# @ingooutgo/react

A React based UI for IngoOutgo.

This library is powered by MobX under the hood; and may be observed by an external MobX-instance for UI reactivity.

[View Demo](https://petrosiliuspatter.github.io/ingooutgo/)

![Visual representation of IngoOutgo](../../assets/ingooutgo.png?raw=true)

### Getting Started

#### Installation

```
# Using NPM
npm install @ingooutgo/core @ingooutgo/react

# Using Yarn
yarn add @ingooutgo/core @ingooutgo/react

# Using Bun
bun install @ingooutgo/core @ingooutgo/react
```

#### Additional dependencies

Make sure to also install the following packages:

```
# Using NPM
npm install react react-dom rxjs zod

# Using Yarn
yarn add react react-dom rxjs zod

# Using Bun
bun install react react-dom rxjs zod
```

### API

#### Canvas

The fundamental piece which renders a surface with fully interactive Nodes & Connections.

Supports the following props:

- `store: CanvasStore` A Canvas store which holds the internal canvas state along with associated nodes.
- `className?: string` An optional className to assign the Canvas.
- `onConnection?(connection: Connection<unknown>)` An optional callback which fires when new connections are made.
- `onConnectionRemoval?(connection: Connection<unknown>)` An optional callback which fires when connections are removed.
- `onNodeRemoval?(node: Node)` An optional callback which fires when nodes are removed.
- `onSelectionChanged?(nodes: Node[])` An optional callback which fires when selected nodes changes.

```typescript
const store = new CanvasStore()

store.setNodes([
  [additionNode1, { x: -220, y: 100 }],
  [additionNode2, { x: -220, y: -100 }],
  [additionNode3, { x: 220, y: 0 }],
])

export const App = () => {
  return (
    <Canvas
      store={store}
      onConnection={(connection) => console.log("NEW CONNECTION", connection)}
      onConnectionRemoval={(connection) => console.log("REMOVED CONNECTION", connection)}
      onNodeRemoval={(node) => console.log("REMOVED NODE", node)}
      onSelectionChanged={(nodes) => console.log("SELECTION CHANGED", nodes)}
    />
  )
}
```

#### Canvas Store

The manager which is responsible for the canvas state.

##### Properties

- `nodes: Node[]` The associated nodes.
- `selectedNodes: Node[]` The currently selected nodes.
- `selectionBounds: Bounds | null` The current selected area's bounds.
- `mousePosition: MousePosition` Current mouse position within the Canvas surface.

##### Methods

- `setNodes(nodesWithPosition: [Node, {x: number, y: number}][])` Used to initialize the store with nodes along with their position.
- `removeNode(nodeId: Node['id'])` Removes a node from the store.
- `selectNodes(nodes: Node[])` Selects the given nodes.
- `dispose()` Disposes the store and its internal reactions.

### Example

```typescript
import { Node, Input, Output } from "@ingooutgo/core"
import { Canvas, CanvasStore } from "@ingooutgo/react"
import * as React from "react"
import { combineLatest, map } from "rxjs"
import { z } from "zod"

/** Declare a zod schema for value validation */
const NumberSchema = z.number()

class Addition extends Node {
  inputs = {
    a: new Input({ name: "A", type: NumberSchema, defaultValue: 0 }),
    b: new Input({ name: "B", type: NumberSchema, defaultValue: 0 }),
  }

  outputs = {
    output: new Output({
      name: "Output",
      type: NumberSchema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => inputs.reduce((sum, value) => sum + value), 0)
      ),
    }),
  }
}

/** Declare 3 addition nodes */
const additionNode1 = new Addition()
const additionNode2 = new Addition()
const additionNode3 = new Addition()

/** Connect them together */
additionNode1.outputs.output.connect(additionNode3.inputs.a)
additionNode2.outputs.output.connect(additionNode3.inputs.b)

const store = new CanvasStore()

store.setNodes([
  [additionNode1, { x: -220, y: 100 }],
  [additionNode2, { x: -220, y: -100 }],
  [additionNode3, { x: 220, y: 0 }],
])

export const App = () => {
  return (
    <Canvas
      store={store}
      onConnection={(c) => console.log("NEW CONNECTION", c)}
      onConnectionRemoval={(c) => console.log("REMOVED CONNECTION", c)}
      onNodeRemoval={(n) => console.log("REMOVED NODE", n)}
      onSelectionChanged={(s) => console.log("SELECTION CHANGED", s)}
    />
  )
}
```
