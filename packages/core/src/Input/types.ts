import { z } from "zod"

import { FieldComponent } from "../FieldComponent"

export interface IInputProps<ZS extends z.Schema> {
  name?: string
  type: ZS
  defaultValue: z.infer<ZS>
  component?: FieldComponent<ZS>
}
