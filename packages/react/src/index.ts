import { enableStaticRendering } from "mobx-react-lite"

if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  const preconnectLink = document.createElement("link")
  preconnectLink.rel = "preconnect"
  preconnectLink.href = "https://rsms.me/"
  document.head.appendChild(preconnectLink)

  const stylesheetLink = document.createElement("link")
  stylesheetLink.rel = "stylesheet"
  stylesheetLink.href = "https://rsms.me/inter/inter.css"
  document.head.appendChild(stylesheetLink)
}

enableStaticRendering(typeof window === "undefined")

export * from "./components/Connection"
export * from "./components/NodeField"
export * from "./components/NodeEditor"
export * from "./components/NodeCard"
export * from "./stores/EditorStore"
export * from "./types"
export * from "./utils/styleUtils"
export * from "./utils/storeUtils"
