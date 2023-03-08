import { Connection, Output } from "@ingooutgo/core"

export type ConnectionTargetPoint = {
  x: number
  y: number
}

export type ConnectionProps<T> = {
  output?: Output<T>
  point?: ConnectionTargetPoint
  connection?: Connection<T>
}
