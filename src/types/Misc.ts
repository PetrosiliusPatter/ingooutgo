import { Input, Node, Output } from "../deps/nodl.ts"
import { z } from "../deps/zod.ts"

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
})

export type Position = z.infer<typeof PositionSchema>

export type Direction = "incoming" | "outgoing"

export type SocketId = Input<any>["id"] | Output<any>["id"]

export type ConnectionIds = [
  Node["id"],
  SocketId,
]
