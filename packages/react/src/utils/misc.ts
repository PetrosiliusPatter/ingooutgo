import { Connection, Node, Direction } from "@ingooutgo/core"
import { z } from "zod"

import { Position } from "../types"

export const socketToArcherKey = (
  nodeId: string,
  fieldId: string,
  direction: Direction
) => {
  return `node-${nodeId}-field-${fieldId}-dir-${direction}`
}

/* export const archerKeyToSocket = (key: string): SocketInfo | null => {
  const splits = key.split(/node-|-field-|-field-|-dir-/)
  if (splits.length != 4) {
    console.warn("Invalid Archer key: ", key)
    console.warn("Splits: ", splits)
    return null
  }
  if (splits[3] != "incoming" && splits[3] != "outgoing") {
    console.warn("Invalid Archer key: ", key)
    console.warn("Direction resolved to: ", splits[3])
    return null
  }
  return { nodeId: splits[1], fieldName: splits[2], direction: splits[3] }
} */

export const noDuplicates = (arr: any[]) => {
  return [...new Set(arr)]
}

export const getRelativeCoordinates = (
  x: number,
  y: number,
  el: Element
): { x: number; y: number } => {
  const rect = el.getBoundingClientRect()
  return { x: x - rect.left, y: y - rect.top }
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
