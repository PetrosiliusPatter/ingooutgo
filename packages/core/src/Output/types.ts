import { Observable } from "rxjs"
import { z } from "zod"

import { FieldComponent } from "../FieldComponent"

export interface IOutputProps<ZS extends z.Schema> {
  name?: string
  type: ZS
  observable: Observable<z.infer<ZS>>
  component?: FieldComponent<ZS>
}
