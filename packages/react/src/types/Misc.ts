import { Input, Node, Output } from "@nodl/core"

export type Position = {
  x: number
  y: number
}

export type Direction = "incoming" | "outgoing"

export type ConnectionIds = [Node["id"], Input<any>["id"] | Output<any>["id"]]
