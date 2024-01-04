import { makeAutoObservable } from "../deps/mobx.ts"
import { Connection, Input, Output } from "../deps/nodl.ts"
import { createContext } from "../deps/react.ts"

import { Catalog, IngoNode, NodeRegistration } from "../types/IngoNode.ts"
import { ConnectionIds, Position, SocketId } from "../types/Misc.ts"
import { connectionsForNode, relativePos } from "../utils/misc.ts"
import { isDefined } from "../utils/typeUtils.ts"

export class EditorStore {
  /** EditorContentWrapper Element */
  public editorContentWrapperElement: HTMLElement | null = null
  /** Associated Nodes */
  public nodes: IngoNode[] = []
  /** Associated Node Elements */
  public nodeElements: Map<IngoNode["id"], HTMLElement> = new Map()
  /** Node Positions */
  public nodePositions: Map<IngoNode["id"], Position> = new Map()
  /** Socket Elements */
  public socketElements: Map<SocketId, HTMLElement> = new Map()
  /** Socket Positions */
  public socketRects: Map<SocketId, Position> = new Map()
  /** Connection Elements */
  public connectionElements: Map<Connection<any>["id"], SVGPathElement> = new Map()
  /** Selected Nodes */
  public selectedNodes: IngoNode[] = []
  /** Selected Connections */
  public selectedConnections: Connection<any>[] = []
  /** Root Catalog */
  public nodeCatalog: Catalog
  /** Mouse Position */
  public mousePosition: Position = { x: 0, y: 0 }
  /** Browser Visibility */
  public isBrowserVisible = false
  /** Is new selection overwriting */
  public isExtendingSelection = false
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
    this.nodeCatalog = catalog ?? {
      nodes: [],
      subcategories: {},
    }
    makeAutoObservable(this)
  }

  /** Set EditorContentWrapper element*/
  setEditorContentWrapperElement = (element: HTMLElement | null) => {
    this.editorContentWrapperElement = element
  }

  /** All associated connections */
  getAllConnections = () => Array.from(new Set(this.nodes.flatMap(connectionsForNode)))

  /** Gets a Node by ID */
  getNodeById = (id: IngoNode["id"]) => this.nodes.find((n) => n.id == id)

  /** Find a Node that has the given SocketID */
  getNodeBySocketId = (
    socketId: SocketId,
  ): IngoNode | undefined => {
    return this.nodes.find(
      (n) =>
        Object.values(n.inputs).find((i) => i.id === socketId) ||
        Object.values(n.outputs).find((o) => o.id === socketId),
    )
  }

  /** Add Node at position */
  addNode = (node: IngoNode, position?: Position) => {
    this.nodes.push(node)
    this.nodePositions.set(node.id, position ?? { x: 0, y: 0 })
  }

  /** Remove a Node and all it's Connections */
  removeNode = (nodeId: IngoNode["id"]) => {
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
  setNodePosition = (
    nodeId: IngoNode["id"],
    position: Position,
  ) => {
    this.nodePositions.set(nodeId, position)

    const node = this.getNodeById(nodeId)
    if (!node) return

    const allSockets = [...Object.values(node.inputs), ...Object.values(node.outputs)]
    allSockets.forEach(({ id }) => {
      const element = this.socketElements.get(id)
      if (!element) return
      if (!this.editorContentWrapperElement) return

      const rect = element.getBoundingClientRect()
      const wrapperRect = this.editorContentWrapperElement.getBoundingClientRect()

      this.socketRects.set(id, relativePos(rect, wrapperRect))
    })
  }

  /** Associates a given Socket with an HTML Element */
  setSocketElement = (
    socketId: SocketId,
    element: HTMLElement | null,
  ) => {
    if (!element) {
      this.socketElements.delete(socketId)
      return
    }
    this.socketElements.set(socketId, element)

    if (!this.editorContentWrapperElement) return
    const wrapperRect = this.editorContentWrapperElement.getBoundingClientRect()

    this.socketRects.set(
      socketId,
      relativePos(element.getBoundingClientRect(), wrapperRect),
    )
  }

  /** Offset position of the selected Nodes */
  offsetSelectedNodesPosition = (offset: Position) => {
    this.selectedNodes.forEach((node) => {
      const position = this.nodePositions.get(node.id)
      this.setNodePosition(node.id, {
        x: (position?.x || 0) + offset.x,
        y: (position?.y || 0) + offset.y,
      })
    })
  }

  /** Associates a given Node instance with an HTML Element */
  setNodeElement = (nodeId: IngoNode["id"], socketElement: HTMLElement) => {
    this.nodeElements.set(nodeId, socketElement)
  }

  /** Clears a given Node's associated HTML Element from store */
  removeNodeElement = (nodeId: IngoNode["id"]) => this.nodeElements.delete(nodeId)

  /** Clears the selection */
  clearSelection = () => {
    this.selectedNodes = []
    this.selectedConnections = []
    this.tempSelection.nodeIds = []
    this.tempSelection.connectionIds = []
  }

  /** Selects the given nodes */
  setSelectedNodes = (nodes: IngoNode[]) => {
    const newSelectedNodes = this.isExtendingSelection ? this.selectedNodes : []
    const newNodes = nodes.filter((n) => !newSelectedNodes.includes(n))
    this.selectedNodes = [...newSelectedNodes, ...newNodes]
  }

  /** Remove a Connections */
  removeConnection = (connectionId: Connection<any>["id"]) => {
    const connection = this.getAllConnections().find((c) => c.id === connectionId)
    if (!connection) return

    this.removeNodeElement(connectionId)

    this.selectedConnections = this.selectedConnections.filter(({ id }) =>
      id !== connectionId
    )
    connection.dispose()
  }

  /** Associates a given Connection with an HTML Element */
  setConnectionElement = (
    connectionId: Connection<any>["id"],
    element: SVGPathElement | null,
  ) => {
    if (!element) {
      this.connectionElements.delete(connectionId)
    } else {
      this.connectionElements.set(connectionId, element)
    }
  }

  /** Clears a given Connections's associated HTML Element from store */
  removeConnectionElement = (connectionId: Connection<any>["id"]) => {
    this.connectionElements.delete(connectionId)
  }

  /** Selects the given connections */
  setSelectedConnections = (connections: Connection<any>[]) => {
    if (!this.isExtendingSelection) {
      this.selectedConnections = []
    }
    const newConnections = connections.filter((c) =>
      !this.selectedConnections.includes(c)
    )
    this.selectedConnections = [...this.selectedConnections, ...newConnections]
  }

  /** Sets the mouse position */
  setMousePosition = (mousePosition: Position) => {
    this.mousePosition = mousePosition
  }

  /** Sets the browser visibility */
  setBrowserVisibility = (isVisible: boolean) => {
    this.isBrowserVisible = isVisible
  }

  /** Sets the selection extend flag */
  setIsExtendingSelection = (isExtending: boolean) => {
    this.isExtendingSelection = isExtending
  }

  /** Sets the temporary selection */
  setTempSelection = (
    nodeIds: IngoNode["id"][] = [],
    connectionIds: Connection<any>["id"][] = [],
  ) => {
    this.tempSelection.nodeIds = nodeIds
    this.tempSelection.connectionIds = connectionIds
  }

  /** Confirms the temporary selection */
  confirmTempSelection = () => {
    const newSelectedNodes = this.tempSelection.nodeIds
      .filter((nid) => !this.selectedNodes.find((n) => n.id === nid))
      .map(this.getNodeById)
      .filter(isDefined)

    const allSelectedNodes = this.isExtendingSelection
      ? [...this.selectedNodes, ...newSelectedNodes]
      : newSelectedNodes

    const allConnections = this.getAllConnections()
    const newSelectedConnections = this.tempSelection.connectionIds
      .filter((cid) => !this.selectedConnections.find((c) => c.id === cid))
      .map((id) => allConnections.find((c) => c.id === id))
      .filter(isDefined)

    const allSelectedConnections = this.isExtendingSelection
      ? [...this.selectedConnections, ...newSelectedConnections]
      : newSelectedConnections

    this.setTempSelection([], [])
    this.selectedNodes = allSelectedNodes
    this.selectedConnections = allSelectedConnections
  }

  /** Deletes the selection */
  deleteSelection = () => {
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
  getSocketFromIds = ([nodeId, socketId]: ConnectionIds) => {
    const startNode = this.getNodeById(nodeId)
    if (!startNode) return

    const socket = [
      ...Object.values(startNode.inputs),
      ...Object.values(startNode.outputs),
    ].find((i) => i.id === socketId)
    return socket
  }

  /** Sets the start-socket of the current connection */
  setConnectionStartIds = (connectIds?: ConnectionIds) => {
    this.connectionStartIds = connectIds
  }

  /** Check wether two given Sockets, represented by ConnectionIds, are compatible */
  checkConnectionCompatibility = (
    connectIdsA?: ConnectionIds,
    connectIdsB?: ConnectionIds,
  ): [Output<any>, Input<any>] | false => {
    if (!connectIdsA || !connectIdsB) return false

    const socketA = this.getSocketFromIds(connectIdsA)
    const socketB = this.getSocketFromIds(connectIdsB)
    if (!socketA || !socketB) return false

    const socketADir = "defaultValue" in socketA ? "in" : "out"
    const socketBDir = "defaultValue" in socketB ? "in" : "out"
    if (socketADir === socketBDir) return false

    const [outSocket, inSocket] = (
      socketADir === "out" ? [socketA, socketB] : [socketB, socketA]
    ) as [Output<any>, Input<any>]
    if (inSocket.connection) return false

    if (!Connection.isTypeCompatible(outSocket, inSocket)) return false

    const inNode = this.getNodeBySocketId(inSocket.id)
    if (!inNode) return false

    const isLoop = this.findSocketIdInConnections(outSocket.id, inNode.id)
    if (isLoop) return false

    return [outSocket, inSocket]
  }

  /** Sets the end-socket of the current connection */
  proposeConnectionEndIds = (connectIds?: ConnectionIds) => {
    if (!connectIds) {
      this.connectionEndIds = undefined
      return
    }

    if (!this.checkConnectionCompatibility(this.connectionStartIds, connectIds)) {
      return
    }

    this.connectionEndIds = connectIds
  }

  /** Aborts the current connection */
  endConnection = () => {
    this.setConnectionStartIds(undefined)
  }

  /** Finishes the current connection */
  /* public confirmConnection(): void {
    this.connectSockets(this.connectionStartIds, this.connectionEndIds)
    this.endConnection()
  } */

  confirmConnection = () => {
    this.connectSockets(this.connectionStartIds, this.connectionEndIds)
  }

  /** Connect two sockets */
  connectSockets = (
    a: ConnectionIds | undefined,
    b: ConnectionIds | undefined,
  ) => {
    const sockets = this.checkConnectionCompatibility(a, b)
    if (sockets) {
      const [outSocket, inSocket] = sockets
      outSocket.connect(inSocket)
    }
    this.endConnection()
  }

  /** Find socketId in following connections */
  findSocketIdInConnections = (
    socketId: string,
    startNodeId: string,
    currentNodeId?: string,
  ): boolean => {
    if (currentNodeId === startNodeId) return false

    currentNodeId = currentNodeId || startNodeId
    const node = this.getNodeById(currentNodeId)
    if (!node) return false

    if (Object.values(node.inputs).find(({ id }) => id === socketId)) return true
    if (Object.values(node.outputs).find(({ id }) => id === socketId)) return true

    const outgoingConnections = Object.values(node.outputs).flatMap((i) => i.connections)
    const nodesOfOutgoing = Array.from(
      new Set(outgoingConnections.map((c) => this.getNodeBySocketId(c.to.id))),
    )

    return nodesOfOutgoing.some((n) =>
      this.findSocketIdInConnections(socketId, startNodeId, n?.id)
    )
  }

  /** Remove all nodes and all connections */
  clear = () => {
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
  getSocketRect = (socketId: (Input | Output)["id"]) => this.socketRects.get(socketId)

  /** Get all node registrations in the catalog */
  getAllNodeRegistrations = (
    catalog: Catalog = this.nodeCatalog,
  ): NodeRegistration[] =>
    Array.from(
      new Set([
        ...Object.values(catalog.subcategories).flatMap(this.getAllNodeRegistrations),
        ...catalog.nodes,
      ]),
    )

  /** Get the node registration by a registration ID */
  getRegistrationById = (
    registrationId: NodeRegistration["registrationId"],
    catalog: Catalog = this.nodeCatalog,
  ): NodeRegistration | undefined => {
    let found = catalog.nodes.find((n) => n.registrationId === registrationId)
    if (found) return found

    for (const category of Object.values(catalog.subcategories)) {
      found = this.getRegistrationById(registrationId, category)
      if (found) return found
    }
  }
}

export type StoreProviderValue = {
  store?: EditorStore
}

const defaultStoreProviderValue: StoreProviderValue = {}
export const StoreContext = createContext(defaultStoreProviderValue)
