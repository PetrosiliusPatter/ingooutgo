import { Input, Output, Node } from "@ingooutgo/core"
import { NodeRegistration } from "@ingooutgo/react"
import { combineLatest, map } from "rxjs"

import { createNumberField } from "../../components/NumberField"
import { createTextField } from "../../components/TextField"
import { numberSchema, stringSchema } from "../../schemas"

class RepeatNodeClass extends Node {
  name: string = "Repeat"

  inputs = {
    a: new Input({
      name: "Repeat",
      type: numberSchema,
      defaultValue: 1,
      component: createNumberField({ schema: numberSchema.int().min(0) }),
    }),
    b: new Input({
      name: "Text",
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
        map((inputs) => inputs[1].repeat(Math.floor(Math.max(0, inputs[0]))))
      ),
      component: createTextField(),
    }),
  }

  accentColor = "#c02626"
  icon = "Quote"
}

export const repeatNode: NodeRegistration = {
  id: "strings/repeat",
  name: "Repeat",
  create: () => new RepeatNodeClass(),
}
