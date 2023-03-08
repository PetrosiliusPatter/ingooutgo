import { Catalog } from "@ingooutgo/react"

import { addNode } from "./AddNode"
import { subtractNode } from "./SubtractNode"

export const mathCatalog: Catalog = {
  label: "Math",
  nodes: [addNode, subtractNode],
  subcategories: {},
}

export * from "./AddNode"
export * from "./SubtractNode"
