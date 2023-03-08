import { Input, Node, Output } from "@ingooutgo/core"

export type Position = {
  x: number
  y: number
}

export type ConnectionIds = [Node["id"], Input<any>["id"] | Output<any>["id"]]
