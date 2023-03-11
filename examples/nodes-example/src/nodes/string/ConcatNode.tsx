import { NodeRegistration } from "@ingooutgo/react"
import { Input, Output, Node } from "@nodl/core"
import { combineLatest, map } from "rxjs"

import { createTextField } from "../../components/TextField"
import { stringSchema } from "../../schemas"

class ConcatNodeClass extends Node {
  inputs = {
    a: new Input({
      name: "A",
      type: stringSchema,
      defaultValue: "",
    }),
    b: new Input({
      name: "B",
      type: stringSchema,
      defaultValue: "",
    }),
  }

  outputs = {
    output: new Output({
      name: "Output",
      type: stringSchema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => inputs.reduce((sum, value) => sum + value))
      ),
    }),
  }
}

export const concatNodeRegistraion = new NodeRegistration({
  id: "string/concat",
  name: "Concat",
  node: ConcatNodeClass,
  components: {
    a: createTextField(),
    b: createTextField(),
    output: createTextField(),
  },
  accentColor: "#c02626",
  icon: "Quote",
})
