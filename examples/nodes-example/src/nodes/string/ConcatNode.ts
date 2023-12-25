import { combineLatest, map } from "../../deps/rxjs.ts"
import { NodeRegistration } from "../../deps/ingooutgo.ts"
import { Input, Node, Output } from "../../deps/nodl.ts"

import { TextField } from "../../components/TextField/TextField.tsx"
import { stringSchema } from "../../schemas.ts"

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
        map((inputs) => inputs.reduce((sum, value) => sum + value)),
      ),
    }),
  }
}

export const concatNodeRegistraion = new NodeRegistration({
  id: "ingooutgo/nodes-example/string/concat",
  name: "Concat",
  node: ConcatNodeClass,
  components: {
    a: TextField,
    b: TextField,
    output: TextField,
  },
  accentColor: "#c02626",
  icon: "Quote",
})
