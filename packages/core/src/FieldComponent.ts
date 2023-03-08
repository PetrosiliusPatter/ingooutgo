import { z } from "zod"
export type Direction = "incoming" | "outgoing"

export type FieldComponentProps<Z extends z.Schema> = {
  schema: Z
  updateFunc?: (value: z.infer<Z>) => void
  value: z.infer<Z>
  direction: Direction
  disabled: boolean
}

export type FieldComponent<Z extends z.Schema> = (props: FieldComponentProps<Z>) => any
