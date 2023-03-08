import { Catalog } from "@ingooutgo/react"

import { concatNode } from "./ConcatNode"
import { repeatNode } from "./RepeatNode"

export const stringCatalog: Catalog = {
  label: "String",
  nodes: [concatNode, repeatNode],
  subcategories: {},
}

export * from "./ConcatNode"
export * from "./RepeatNode"
