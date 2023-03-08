import { Input, Node, Output } from "@ingooutgo/core"
import { NodeRegistration } from "@ingooutgo/react"
import { combineLatest, map } from "rxjs"

import { createTextField } from "../../components/TextField"
import { stringSchema } from "../../schemas"

class ConcatNodeClass extends Node {
  name: string = "Concat"

  inputs = {
    a: new Input({
      name: "A",
      type: stringSchema,
      defaultValue: "",
      component: createTextField(),
    }),
    b: new Input({
      name: "B",
      type: stringSchema,
      defaultValue: "",
      component: createTextField(),
    }),
  }

  outputs = {
    output: new Output({
      name: "Output",
      type: stringSchema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => inputs.reduce((sum, value) => sum + value))
      ),
      component: createTextField(),
    }),
  }

  accentColor = "#c02626"
  icon = "Quote"
}

export const concatNode: NodeRegistration = {
  id: "strings/concat",
  name: "Concat",
  create: () => new ConcatNodeClass(),
}
