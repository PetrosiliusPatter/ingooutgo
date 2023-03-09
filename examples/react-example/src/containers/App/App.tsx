import { mathCatalog, stringCatalog } from "@ingooutgo/nodes-example"
import {
  Catalog,
  EditorStore,
  loadSerializedStore,
  NodeEditor,
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

export const App = () => {
  const [store, setStore] = React.useState(new EditorStore(nodeCatalog))

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

  const [infoDismissedBefore, setInfoDismissedBefore] = useLocalStorage<boolean>(
    "infoboxDismissed",
    false
  )

  return (
    <>
      <div className="debug-panel">
        <button onClick={recalcSerialization}>Save Editor</button>
        <button onClick={loadFromSerialization}>Load Saved Editor</button>
      </div>
      <div className={`playground-wrapper rpg-theme`}>
        <NodeEditor store={store} />
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
