import { mathCatalog, stringCatalog } from "@ingooutgo/nodes-example";
import { EditorStore, loadSerializedStore, NodeEditor, serializeStore, } from "@ingooutgo/react";
import * as React from "react";
import "./App.styles";
import { useLocalStorage } from "./useLocalStorage";
const nodeCatalog = {
    nodes: [],
    subcategories: {
        math: mathCatalog,
        string: stringCatalog,
    },
};
export const App = () => {
    const [store, setStore] = React.useState(new EditorStore(nodeCatalog));
    const [loadedSerialized, setLoadedSerialized] = React.useState(false);
    const [serializedStore, setSerializedStore] = useLocalStorage("serializedStore", undefined);
    React.useEffect(() => {
        if (loadedSerialized) {
            return;
        }
        setLoadedSerialized(true);
        if (!serializedStore) {
            return;
        }
        setStore(loadSerializedStore(nodeCatalog, serializedStore));
    }, [serializedStore]);
    const recalcSerialization = React.useCallback(() => {
        setSerializedStore(serializeStore(store));
    }, [store]);
    const loadFromSerialization = React.useCallback(() => {
        if (!serializedStore) {
            return;
        }
        setStore(loadSerializedStore(nodeCatalog, serializedStore));
    }, [serializedStore]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "debug-panel" },
            React.createElement("button", { onClick: recalcSerialization }, "Save Editor"),
            React.createElement("button", { onClick: loadFromSerialization }, "Load Saved Editor")),
        React.createElement("div", { className: `playground-wrapper rpg-theme` },
            React.createElement(NodeEditor, { store: store }))));
};
