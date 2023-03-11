import { NodeRegistration } from "@ingooutgo/react"
import { Input, Output, Node } from "@nodl/core"
import { combineLatest, map } from "rxjs"

import { createNumberField } from "../../components/NumberField"
import { createTextField } from "../../components/TextField"
import { numberSchema, stringSchema } from "../../schemas"
class RepeatNode extends Node {
  inputs = {
    repeatCount: new Input({
      name: "Repeat",
      type: numberSchema,
      defaultValue: 1,
    }),
    text: new Input({
      name: "Text",
      type: stringSchema,
      defaultValue: "",
    }),
  }

  outputs = {
    output: new Output({
      name: "Output",
      type: stringSchema,
      observable: combineLatest([this.inputs.repeatCount, this.inputs.text]).pipe(
        map((inputs) => inputs[1].repeat(Math.floor(Math.max(0, inputs[0]))))
      ),
    }),
  }
}

export const repeatNodeRegistraion = new NodeRegistration({
  id: "string/repeat",
  name: "Repeat",
  node: RepeatNode,
  components: {
    repeatCount: createNumberField({ schema: numberSchema.int().min(0) }),
    text: createTextField(),
    output: createTextField(),
  },
  accentColor: "#c02626",
  icon: "Quote",
})
