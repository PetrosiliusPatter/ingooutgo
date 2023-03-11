import { Connection, Node } from "@nodl/core"
import { z } from "zod"

import { Direction, Position } from "../types"

export const socketToArcherKey = (
  nodeId: string,
  fieldId: string,
  direction: Direction
) => {
  return `node-${nodeId}-field-${fieldId}-dir-${direction}`
}

type StoppableEvent = { stopPropagation: () => void }
export const stopEvent = (e: StoppableEvent) => {
  e.stopPropagation()
  return false as const
}

export const connectionsForNode = (n: Node) => {
  return [...Object.values(n.inputs), ...Object.values(n.outputs)]
    .flatMap((socket) =>
      "connection" in socket ? [socket.connection] : socket.connections
    )
    .filter((connection): connection is Connection<z.Schema> => Boolean(connection))
}

export const elToPos = (rect: DOMRect, container?: HTMLElement): Position | undefined => {
  const out = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  if (container) {
    const containerRect = container.getBoundingClientRect()
    out.x -= containerRect.left
    out.y -= containerRect.top
  }
  return out
}
