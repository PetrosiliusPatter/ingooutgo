import { Catalog } from "@ingooutgo/react"

import { addNodeRegistraion } from "./AddNode"
import { subtractNodeRegistration } from "./SubtractNode"

export const mathCatalog: Catalog = {
  label: "Math",
  nodes: [addNodeRegistraion, subtractNodeRegistration],
  subcategories: {},
}

export * from "./AddNode"
export * from "./SubtractNode"
