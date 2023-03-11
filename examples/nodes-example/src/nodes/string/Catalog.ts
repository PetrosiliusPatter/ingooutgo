import { Catalog } from "@ingooutgo/react"

import { concatNodeRegistraion } from "./ConcatNode"
import { repeatNodeRegistraion } from "./RepeatNode"

export const stringCatalog: Catalog = {
  label: "String",
  nodes: [concatNodeRegistraion, repeatNodeRegistraion],
  subcategories: {},
}

export * from "./ConcatNode"
export * from "./RepeatNode"
