import { Node } from "../deps/nodl.ts"

import { Direction, Position, SocketId } from "../types/Misc.ts"
import { isDefined } from "./typeUtils.ts"

export const socketToArcherKey = (
  nodeId: Node["id"],
  socketId: SocketId,
  direction: Direction,
) => {
  return `node-${nodeId}-socket-${socketId}-dir-${direction}`
}

type StoppableEvent = { stopPropagation: () => void }
export const stopEvent = (e: StoppableEvent) => {
  e.stopPropagation()
  return false as const
}

export const connectionsForNode = (n: Node) => {
  const inConnections = Object.values(n.inputs).map(({ connection }) => connection)
  const outConnections = Object.values(n.outputs).flatMap(({ connections }) =>
    connections
  )
  return [...inConnections, ...outConnections].filter(isDefined)
}

export const relativePos = (innerRect: DOMRect, outerRect: DOMRect): Position => ({
  x: (innerRect.left + innerRect.width / 2) - outerRect.left,
  y: (innerRect.top + innerRect.height / 2) - outerRect.top,
})
