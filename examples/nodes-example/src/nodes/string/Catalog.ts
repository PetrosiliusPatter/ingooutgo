import { Catalog } from "../../deps/ingooutgo.ts"

import { concatNodeRegistraion } from "./ConcatNode.ts"
import { repeatNodeRegistraion } from "./RepeatNode.ts"

export const stringCatalog: Catalog = {
  label: "String",
  nodes: [concatNodeRegistraion, repeatNodeRegistraion],
  subcategories: {},
}
