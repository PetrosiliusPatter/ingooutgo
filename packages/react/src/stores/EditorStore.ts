import { Connection, Input, Node, Output } from "@ingooutgo/core"
import { makeAutoObservable } from "mobx"
import { createContext } from "react"
import { z } from "zod"

import { ConnectionIds, Position } from "../types/Misc"
import { Catalog, NodeRegistration } from "../types/NodeCatalog"
import { connectionsForNode } from "../utils/misc"

export class EditorStore {
  /** Associated Nodes */
  public nodes: Node[] = []
  /** Associated Node Elements */
  public nodeElements: Map<Node["id"], HTMLElement> = new Map()
  /** Node Positions */
  public nodePositions: Map<Node["id"], { x: number; y: number }> = new Map()
  /** Socket Elements */
  public socketElements: Map<Input<any>["id"] | Output<any>["id"], HTMLElement> =
    new Map()
  /** Socket Positions */
  public socketRects: Map<Input<any>["id"] | Output<any>["id"], DOMRect> = new Map()
  /** Connection Elements */
  public connectionElements: Map<Connection<any>["id"], SVGPathElement> = new Map()
  /** Selected Nodes */
  public selectedNodes: Node[] = []
  /** Selected Connections */
  public selectedConnections: Connection<any>[] = []
  /** Root Catalog */
  public rootCatalog: Catalog
  /** Mouse Position */
  public mousePosition: Position = { x: 0, y: 0 }
  /** Browser Visibility */
  public isBrowserVisible: boolean = false
  /** Is new selection overwriting */
  public isExtendingSelection: boolean = false
  /** The temporary selection */
  public tempSelection: { nodeIds: string[]; connectionIds: string[] } = {
    nodeIds: [],
    connectionIds: [],
  }
  /** The start-socket of the current connection */
  public connectionStartIds: ConnectionIds | undefined = undefined
  /** The end-socket of the current connection */
  public connectionEndIds: ConnectionIds | undefined = undefined

  constructor(catalog?: Catalog) {
    this.rootCatalog = catalog ?? {
      nodes: [],
      subcategories: {},
    }
    makeAutoObservable(this)
  }

  /** All associated connections */
  public getAllConnections() {
    return Array.from(new Set(this.nodes.flatMap(connectionsForNode)))
  }

  /** Add a new NodeRegistration at the given category path. If the subcategory doesn't exist, it will be created. */
  public registerNode(nodeReg: NodeRegistration, categoryPath: string[]): void {
    let currentCatalog = this.rootCatalog
    for (const subcategory of categoryPath) {
      if (!currentCatalog.subcategories[subcategory]) {
        currentCatalog.subcategories[subcategory] = {
          nodes: [],
          subcategories: {},
        }
      }
      currentCatalog = currentCatalog.subcategories[subcategory]
    }
    currentCatalog.nodes.push(nodeReg)
  }

  /** Gets a Node by ID */
  public getNodeById(id: Node["id"]): Node | undefined {
    return this.nodes.find((n) => n.id == id)
  }

  /** Find a Node that has the given SocketID */
  public getNodeBySocketId(
    socketId: Input<any>["id"] | Output<any>["id"]
  ): Node | undefined {
    return this.nodes.find(
      (n) =>
        Object.values(n.inputs).find((i) => i.id === socketId) ||
        Object.values(n.outputs).find((o) => o.id === socketId)
    )
  }

  /** Add Node at position */
  public addNode(node: Node, position: { x: number; y: number }): void {
    this.nodes.push(node)
    this.nodePositions.set(node.id, position)
  }

  /** Remove a Node and all it's Connections */
  public removeNode(nodeId: Node["id"]): void {
    const node = this.getNodeById(nodeId)
    if (!node) return

    const sockets = [...Object.values(node.inputs), ...Object.values(node.outputs)]
    for (const socket of sockets) {
      this.socketRects.delete(socket.id)
      this.socketElements.delete(socket.id)
    }

    this.removeNodeElement(nodeId)

    node.dispose()
    this.nodes = this.nodes.filter((n) => n.id !== nodeId)
    this.nodeElements.delete(nodeId)
    this.selectedNodes = this.selectedNodes.filter((n) => n.id !== nodeId)
  }

  /** Set position of Node */
  public setNodePosition(nodeId: Node["id"], position: { x: number; y: number }): void {
    this.nodePositions.set(nodeId, position)

    const node = this.getNodeById(nodeId)
    if (!node) return
    const socketIds = [...Object.values(node.inputs), ...Object.values(node.outputs)].map(
      (s) => s.id
    )
    this.updateSocketRects(socketIds)
  }

  /** Associates a given Socket with an HTML Element */
  public setSocketElement(
    socketId: Input<any>["id"] | Output<any>["id"],
    element: HTMLElement | null
  ): void {
    if (!element) {
      this.socketElements.delete(socketId)
      return
    }
    this.socketElements.set(socketId, element)
    this.socketRects.set(socketId, element.getBoundingClientRect())
  }

  /** Update Socket Rects */
  public updateSocketRects(socketIds: string[]): void {
    for (const socketId of socketIds) {
      const element = this.socketElements.get(socketId)
      if (!element) continue
      this.socketRects.set(socketId, element.getBoundingClientRect())
    }
  }

  /** Offset position of the selected Nodes */
  public offsetSelectedNodesPosition(offset: { x: number; y: number }): void {
    this.selectedNodes.forEach((node) => {
      const position = this.nodePositions.get(node.id)
      this.setNodePosition(node.id, {
        x: (position?.x || 0) + offset.x,
        y: (position?.y || 0) + offset.y,
      })
    })
  }

  /** Associates a given Node instance with an HTML Element */
  public setNodeElement(nodeId: Node["id"], socketElement: HTMLElement): void {
    this.nodeElements.set(nodeId, socketElement)
  }

  /** Clears a given Node's associated HTML Element from store */
  public removeNodeElement(nodeId: Node["id"]): void {
    this.nodeElements.delete(nodeId)
  }

  /** Selects the given nodes */
  public setSelectedNodes(nodes: Node[]): void {
    if (!this.isExtendingSelection) {
      this.selectedNodes = []
    }
    const newNodes = nodes.filter((n) => !this.selectedNodes.includes(n))
    this.selectedNodes = [...this.selectedNodes, ...newNodes]
  }

  /** Remove a Connections */
  public removeConnection(connectionId: Connection<any>["id"]): void {
    const connection = this.getAllConnections().find((c) => c.id === connectionId)
    if (!connection) return
    this.removeNodeElement(connectionId)

    this.selectedConnections = this.selectedConnections.filter(
      (c) => c.id !== connectionId
    )
    connection.dispose()
  }

  /** Associates a given Connection with an HTML Element */
  public setConnectionElement(
    connectionId: Connection<any>["id"],
    element: SVGPathElement | null
  ): void {
    if (!element) {
      this.connectionElements.delete(connectionId)
      return
    }
    this.connectionElements.set(connectionId, element)
  }

  /** Clears a given Connections's associated HTML Element from store */
  public removeConnectionElement(connectionId: Connection<any>["id"]): void {
    this.connectionElements.delete(connectionId)
  }

  /** Selects the given connections */
  public setSelectedConnections(connections: Connection<any>[]): void {
    if (!this.isExtendingSelection) {
      this.selectedConnections = []
    }
    const newConnections = connections.filter(
      (c) => !this.selectedConnections.includes(c)
    )
    this.selectedConnections = [...this.selectedConnections, ...newConnections]
  }

  /** Sets the mouse position */
  public setMousePosition(mousePosition: Position): void {
    this.mousePosition = mousePosition
  }

  /** Sets the browser visibility */
  public setBrowserVisibility(isVisible: boolean): void {
    this.isBrowserVisible = isVisible
  }

  /** Sets the selection extend flag */
  public setIsExtendingSelection(isExtending: boolean): void {
    this.isExtendingSelection = isExtending
  }

  /** Sets the temporary selection */
  public setTempSelection(nodeIds: string[] = [], connectionIds: string[] = []): void {
    this.tempSelection.nodeIds = nodeIds
    this.tempSelection.connectionIds = connectionIds
  }

  /** Confirms the temporary selection */
  public confirmTempSelection(): void {
    const newSelectedNodes = this.tempSelection.nodeIds
      .filter((nid) => !this.selectedNodes.find((n) => n.id === nid))
      .map((id) => this.getNodeById(id))
      .filter((n) => n) as Node[]
    const allSelectedNodes = this.isExtendingSelection
      ? [...this.selectedNodes, ...newSelectedNodes]
      : newSelectedNodes

    const allConnections = this.getAllConnections()
    const newSelectedConnections = this.tempSelection.connectionIds
      .filter((cid) => !this.selectedConnections.find((c) => c.id === cid))
      .map((id) => allConnections.find((c) => c.id === id))
      .filter((c) => c) as Connection<any>[]
    const allSelectedConnections = this.isExtendingSelection
      ? [...this.selectedConnections, ...newSelectedConnections]
      : newSelectedConnections

    this.setTempSelection([], [])
    this.selectedNodes = allSelectedNodes
    this.selectedConnections = allSelectedConnections
  }

  /** Deletes the selection */
  public deleteSelection(): void {
    this.selectedNodes.forEach((node) => {
      this.removeNode(node.id)
    })
    this.selectedNodes = []

    this.selectedConnections.forEach((connection) => {
      this.removeConnection(connection.id)
    })
    this.selectedConnections = []
  }

  /** Get the socket from ConnectIds */
  public getSocketFromIds([nodeId, socketId]: ConnectionIds):
    | Input<any>
    | Output<any>
    | undefined {
    const startNode = this.getNodeById(nodeId)
    if (!startNode) return

    const socket = [
      ...Object.values(startNode.inputs),
      ...Object.values(startNode.outputs),
    ].find((i) => i.id === socketId)
    return socket
  }

  /** Sets the start-socket of the current connection */
  public setConnectionStartIds(connectIds?: ConnectionIds): void {
    this.connectionStartIds = connectIds
  }

  /** Check wether two given Sockets, represented by ConnectionIds, are compatible */
  public checkConnectionCompatibility(
    connectIdsA?: ConnectionIds,
    connectIdsB?: ConnectionIds
  ): [Output<any>, Input<any>] | false {
    if (!connectIdsA || !connectIdsB) return false
    const socketA = this.getSocketFromIds(connectIdsA)
    const socketB = this.getSocketFromIds(connectIdsB)
    if (!socketA || !socketB) return false

    const socketADir = "defaultValue" in socketA ? "in" : "out"
    const socketBDir = "defaultValue" in socketB ? "in" : "out"
    if (socketADir === socketBDir) return false

    /* This would be better, but as Nodl is doing a naive compatibility check itself, this won't work.
    const aSchema = zodToJsonSchema(socketA.type, "schema").$schema
    const bSchema = zodToJsonSchema(socketB.type, "schema").$schema
    if (aSchema !== bSchema) return false */
    const aSchema: z.Schema = socketA.type
    const bSchema: z.Schema = socketB.type
    if (aSchema != bSchema) return false

    const [outSocket, inSocket] = (
      socketADir === "out" ? [socketA, socketB] : [socketB, socketA]
    ) as [Output<any>, Input<any>]

    if (inSocket.connection) return false

    const inNode = this.getNodeBySocketId(inSocket.id)
    if (!inNode) return false

    const isLoop = this.findSocketIdInConnections(outSocket.id, inNode.id)
    if (isLoop) return false

    return [outSocket, inSocket]
  }

  /** Sets the end-socket of the current connection */
  public proposeConnectionEndIds(connectIds?: ConnectionIds): void {
    if (!connectIds) {
      this.connectionEndIds = undefined
      return
    }
    if (!this.checkConnectionCompatibility(this.connectionStartIds, connectIds)) return

    this.connectionEndIds = connectIds
  }

  /** Aborts the current connection */
  public endConnection(): void {
    this.setConnectionStartIds(undefined)
  }

  /** Finishes the current connection */
  public confirmConnection(): void {
    this.connectSockets(this.connectionStartIds, this.connectionEndIds)
    this.endConnection()
  }

  /** Connect two sockets */
  public connectSockets(
    a: ConnectionIds | undefined,
    b: ConnectionIds | undefined
  ): void {
    const sockets = this.checkConnectionCompatibility(a, b)
    if (!sockets) {
      this.endConnection()
      return
    }

    const [outSocket, inSocket] = sockets
    const newCon = outSocket.connect(inSocket)

    outSocket.connections.push(newCon)
    inSocket.connection = newCon
  }

  /** Find socketId in following connections */
  public findSocketIdInConnections(
    socketId: string,
    startNodeId: string,
    currentNodeId?: string
  ): boolean {
    if (currentNodeId === startNodeId) return false

    currentNodeId = currentNodeId || startNodeId
    const node = this.getNodeById(currentNodeId)
    if (!node) return false

    const socket =
      Object.values(node.inputs).find((i) => i.id === socketId) ||
      Object.values(node.outputs).find((o) => o.id === socketId)
    if (!!socket) return true

    const outgoingConnections = Object.values(node.outputs).flatMap((i) => i.connections)
    const nodesOfOutgoing = Array.from(
      new Set(outgoingConnections.map((c) => this.getNodeBySocketId(c.to.id)))
    )
    return nodesOfOutgoing.some((n) =>
      this.findSocketIdInConnections(socketId, startNodeId, n?.id)
    )
  }

  /** Remove all nodes and all connections */
  public clear(): void {
    this.selectedNodes = []
    this.selectedConnections = []
    this.tempSelection = { nodeIds: [], connectionIds: [] }
    this.getAllConnections().forEach((connection) => {
      this.removeConnection(connection.id)
    })
    this.nodes.forEach((node) => {
      this.removeNode(node.id)
    })
  }

  /** Get the DOMrect of a socket by ID relative to a wrapper component*/
  public getSocketRect(socketId: string): DOMRect | undefined {
    return this.socketRects.get(socketId)
  }
}

export type StoreProviderValue = {
  store: EditorStore
}

const defaultStoreProviderValue: StoreProviderValue = {
  store: new EditorStore(),
}

export const StoreContext = createContext(defaultStoreProviderValue)
