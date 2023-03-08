import { Input, Output } from "@ingooutgo/core"

export type PortProps<T> = {
  port: Input<T> | Output<T>
}
