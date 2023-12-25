import { combineLatest, map } from "../../deps/rxjs.ts"
import { NodeRegistration } from "../../deps/ingooutgo.ts"
import { Input, Node, Output } from "../../deps/nodl.ts"
import { z } from "../../deps/zod.ts"

import { createNumberField } from "../../components/NumberField/NumberField.tsx"
import { TextField } from "../../components/TextField/TextField.tsx"
import { numberSchema, stringSchema } from "../../schemas.ts"

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
      observable: combineLatest([
        this.inputs.repeatCount,
        this.inputs.text,
      ]).pipe(
        map((inputs) => {
          return inputs[1].repeat(Math.floor(Math.max(0, inputs[0])))
        }),
      ),
    }),
  }
}

export const repeatNodeRegistraion = new NodeRegistration({
  id: "ingooutgo/nodes-example/string/repeat",
  name: "Repeat",
  node: RepeatNode,
  components: {
    repeatCount: createNumberField({ zodNumber: z.number().int().min(0) }),
    text: TextField,
    output: TextField,
  },
  accentColor: "#c02626",
  icon: "Quote",
})
