import { Catalog } from "../../deps/ingooutgo.ts"

import { addNodeRegistraion } from "./AddNode.ts"
import { subtractNodeRegistration } from "./SubtractNode.ts"

export const mathCatalog: Catalog = {
  label: "Math",
  nodes: [addNodeRegistraion, subtractNodeRegistration],
  subcategories: {},
}
