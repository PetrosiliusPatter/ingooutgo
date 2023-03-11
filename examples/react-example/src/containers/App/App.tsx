import { mathCatalog, stringCatalog } from "@ingooutgo/nodes-example"
import {
  Catalog,
  EditorStore,
  loadSerializedStore,
  NodeEditor,
  Position,
  SerializedStore,
  serializeStore,
} from "@ingooutgo/react"
import * as React from "react"

import { InfoBox } from "../../components/Infobox/Infobox"
import "./App.styles"
import { useLocalStorage } from "./useLocalStorage"

const nodeCatalog: Catalog = {
  nodes: [],
  subcategories: {
    math: mathCatalog,
    string: stringCatalog,
  },
}

const customPathFunc = (start: Position, end: Position) => {
  return `
        M${start.x},${start.y} 
        L${end.x},${end.y}
    `
}

export const App = () => {
  const [store, setStore] = React.useState(new EditorStore(nodeCatalog))

  // Serialization
  const [loadedSerialized, setLoadedSerialized] = React.useState(false)
  const [serializedStore, setSerializedStore] = useLocalStorage<
    SerializedStore | undefined
  >("serializedStore", undefined)

  React.useEffect(() => {
    if (loadedSerialized) {
      return
    }
    setLoadedSerialized(true)
    if (!serializedStore) {
      return
    }
    setStore(loadSerializedStore(nodeCatalog, serializedStore))
  }, [serializedStore])

  const recalcSerialization = React.useCallback(() => {
    setSerializedStore(serializeStore(store))
  }, [store])
  const loadFromSerialization = React.useCallback(() => {
    if (!serializedStore) {
      return
    }
    setStore(loadSerializedStore(nodeCatalog, serializedStore))
  }, [serializedStore])

  // InfoBox
  const [infoDismissedBefore, setInfoDismissedBefore] = useLocalStorage<boolean>(
    "infoboxDismissed",
    false
  )

  // Debug
  //  -> Custom Path Toggle
  const [useCustomPathFunc, setUseCustomPathFunc] = React.useState(false)
  const toggleCustomPathFunc = React.useCallback(() => {
    setUseCustomPathFunc(!useCustomPathFunc)
  }, [useCustomPathFunc])

  //  -> Theme Toggle
  const [useUglyTheme, setUseUglyTheme] = React.useState(false)
  const toggleUglyTheme = React.useCallback(() => {
    setUseUglyTheme(!useUglyTheme)
  }, [useUglyTheme])

  // Render
  return (
    <>
      <div className="debug-panel">
        <button onClick={recalcSerialization}>Save Editor</button>
        <button onClick={loadFromSerialization}>Load Saved Editor</button>
        <button onClick={toggleCustomPathFunc}>Toggle Custom Path Rendering</button>
        <button onClick={toggleUglyTheme}>Toggle Custom Theme (Ugly lol)</button>
      </div>
      <div
        className={useUglyTheme ? "playground-wrapper ugly-theme" : "playground-wrapper"}
      >
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
          customPathFunc={useCustomPathFunc ? customPathFunc : undefined}
        />
      </div>
      <div>
        <InfoBox
          startHidden={infoDismissedBefore}
          onDismiss={() => setInfoDismissedBefore(true)}
        ></InfoBox>
      </div>
    </>
  )
}
