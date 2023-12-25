<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Stargazers][stars-shield]][stars-url]\
[![Issues][issues-shield]][issues-url]\
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/PetrosiliusPatter/ingooutgo">
    <img src="assets/icon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">IngoOutgo</h3>

<p align="center">
    Graph Node Editor in React!
    <br />
    <a href="https://petrosiliuspatter.github.io/use-worker-timer/"><strong>View Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/PetrosiliusPatter/ingooutgo/issues">Report Bug</a>
    ·
    <a href="https://github.com/PetrosiliusPatter/ingooutgo/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a>
      <ul>
        <li><a href="#basic-usage">Basic Usage</a></li>
        <li><a href="#editor-store">Editor Store</a></li>
        <li><a href="#serialization">Serialization</a></li>
        <li><a href="#styling">Styling</a></li>
      </ul></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

A Node Graph Editor written in React.

Each Node has Inputs and Outputs (called Sockets), which can be connected to each other. A
Socket can have an interface component, used for displaying and editing the current
value.\
Users can then select Nodes from a catalogue, combining them into a graph, constructing
more complex logic in the process.

At its core, it uses Emil Widlund's [Nodl](https://github.com/emilwidlund/nodl) for the
Node logic, but with a completely new UI and some other new features.

- Nodes can be defined with accent color and a neat icon, and Sockets can have their own
  UI components
- Node can be copied and pasted, even across different instances of the editor
- The UI is themable, using classnames and css variables, and even customized rendering of
  connections (see [Styling](#styling))
- Better UX:
  - Nodes can be dragged not just by their title bar
  - When connecting Nodes, the connection snaps to compatible Sockets
  - Built-in Node Browser
  - (De-)Serialization of the node graph
  - And more improvements

#### Built With

[![Deno][Deno]][Deno-url] [![React][React.js]][React-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- React
- npm or deno

### Installation

#### Deno

```ts
import { Catalog, EditorStore, NodeEditor } from "https://deno.land/x/ingooutgo/index.ts"
```

#### NPM

```
npm install ingooutgo
```

```ts
import { Catalog, EditorStore, NodeEditor } from "ingooutgo"
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### Basic Usage

See the [Nodes Readme](examples\nodes-example\README.md) for info on how to create Nodes.

```ts
// See example/src/app/page.tsx for full example
import { useState } from "react"
import { DemoWrapper } from "./styles"
import { Catalog, EditorStore, NodeEditor } from "ingooutgo"
import { mathCatalog, stringCatalog } from "ingooutgo-example-nodes"

const nodeCatalog: Catalog = {
  nodes: [],
  subcategories: {
    mathNodes: mathCatalog,
    stringNodes: stringCatalog,
  },
}

const App = () => {
  const [store] = useState(new EditorStore(nodeCatalog))

  // ------- Render -------
  return (
    <DemoWrapper>
      <NodeEditor
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
    </DemoWrapper>
  )
}
```

### Editor Store

The manager which is responsible for the editor state. It has the following structure:

#### Properties

| Property name         | Type                | Description                                      |
| --------------------- | ------------------- | ------------------------------------------------ |
| `nodes`               | `IngoNode[]`        | The associated `Nodes`                           |
| `connections`         | `Connection<any>[]` | The associated `Connections`                     |
| `selectedNodes`       | `IngoNode[]`        | The currently selected `Nodes`                   |
| `selectedConnections` | `Connection<any>[]` | The currently selected `Connections`             |
| `nodeCatalog`         | `Catalog`           | The `Catalog` containing `NodeRegistrations`     |
| `mousePosition`       | `MousePosition`     | Current mouse position within the Canvas surface |

#### Methods

| Method signature                                                                                                             | Description                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `addNode(node: IngoNode, position: {x: number, y: number})`                                                                  | Used to add a `Node` at the given position                                                                   |
| `removeNode(nodeId: IngoNode['id'])`                                                                                         | Removes a `Node` from the store                                                                              |
| `setNodePosition(nodeId: IngoNode["id"], position: { x: number; y: number }`                                                 | Sets the position of a `Node`                                                                                |
| `connectSockets(a: ConnectionIds \| undefined, b: ConnectionIds \| undefined)`                                               | Connects two sockets (each defined as `[nodeId, socketId]`)                                                  |
| `removeConnection(connectionId: Connection<any>["id"])`                                                                      | Removes a `Connection` from the store                                                                        |
| `checkConnectionCompatibility(connectIdsA?: ConnectionIds, connectIdsB?: ConnectionIds): [Output<any>, Input<any>] \| false` | Checks for compatibility between nodes, and if compatible, returns them ordered as [Output<any>, Input<any>] |
| `setSelectedNodes(nodes: IngoNode[])`                                                                                        | Selects the given `Nodes`                                                                                    |
| `setSelectedConnections(connections: Connection<any>[])`                                                                     | Selects the given `Connections`                                                                              |
| `deleteSelection()`                                                                                                          | Deletes the currently selected `Nodes` & `Connections`                                                       |
| `clear()`                                                                                                                    | Deletes all `Nodes` and `Connections`                                                                        |

### Serialization

I expose two utility functions for (de-)serializing the editor.

| Utility                                                                                                                     | Description                             |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `serializeNodes: (nodes: IngoNode[], positionsForNodes: Record<IngoNode["id"], Position \| undefined>) => SerializedNode[]` | Serializes nodes into a storable format |
| `serializeAllNodes(store: EditorStore): SerializedNode[]`                                                                   | Serializes all nodes in a given store   |
| `loadSerializedNodes: (store: EditorStore, serializedNodes: SerializedNode[]) => void`                                      | Loads serialized nodes into a Store     |

- Note that when serializing a `Node` without its position, it will be set to
  `{x: 0, y: 0}`.
- When loading a serialized a `Node` into an `EditorStore`, the `EditorStore` needs to
  have a matching `NodeRegistration`. Otherwise, it will be ignored.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Styling

#### Custom Path Function

If you want, you can customize the path function used to render connections. It should
return a string that can be used as the `d`-attribute of an SVG-Path.

```typescript
// To render the path as a straight line between the sockets.
const customPathFunction = (from: Position, to: Position) => {
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
}
```

#### Custom Styles

You can customize the theme using css variables, or by using exposed classnames. This was
not tested extensively, please report any issues you encounter.

#### CSS variables

These are the available css variables and their default values:

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
}
```

#### CSS classes

And these are the classnames for the components:

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

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

PetrosiliusPatter - PetrosiliusPatter@proton.me

Project Link:
[https://github.com/PetrosiliusPatter/ingooutgo](https://github.com/PetrosiliusPatter/ingooutgo)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/PetrosiliusPatter/ingooutgo.svg?style=for-the-badge
[stars-url]: https://github.com/PetrosiliusPatter/ingooutgo/stargazers
[issues-shield]: https://img.shields.io/github/issues/PetrosiliusPatter/ingooutgo.svg?style=for-the-badge
[issues-url]: https://github.com/PetrosiliusPatter/ingooutgo/issues
[license-shield]: https://img.shields.io/github/license/PetrosiliusPatter/ingooutgo.svg?style=for-the-badge
[license-url]: https://github.com/PetrosiliusPatter/ingooutgo/blob/main/LICENSE.txt
[React.js]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://reactjs.org/
[Deno]: https://img.shields.io/badge/deno%20js-000000?style=for-the-badge&logo=deno&logoColor=white
[Deno-url]: https://deno.com/
