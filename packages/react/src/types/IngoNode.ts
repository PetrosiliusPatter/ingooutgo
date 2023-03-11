import { Node } from "@nodl/core"
import { z } from "zod"

import { Direction, Position } from "./Misc"

export type IngoData = {
  registrationId?: string
}

export abstract class IngoNode<TData extends IngoData = IngoData> extends Node<TData> {}
type IngoNodeFromNodlNode<N extends Node> = IngoNode<
  (N extends Node<infer C> ? C : Record<string, any>) & IngoData
>

export type SerializedConnection = {
  from: string
  to: string
}

export type SerializedNode = {
  inputNames: Record<string, string>
  outputNames: Record<string, string>
  data: IngoData
  position: Position
}

export type FieldComponentProps<Z extends z.Schema> = {
  schema: Z
  updateFunc?: (value: z.infer<Z>) => void
  value: z.infer<Z>
  direction: Direction
  disabled: boolean
}

export type FieldComponent<Z extends z.Schema> = (props: FieldComponentProps<Z>) => any

type RegistrationParams<N extends Node = Node> = {
  id: string
  name: string
  node: new () => N
  components?: Record<string, FieldComponent<any>>
  accentColor?: string
  icon?: string
}
export class NodeRegistration<N extends Node = Node> {
  public registrationId: string
  public name: string
  public components: Record<string, FieldComponent<any>>

  public accentColor?: string
  public icon?: string

  node: new () => N

  constructor({ id, name, node, components, accentColor, icon }: RegistrationParams<N>) {
    this.registrationId = id
    this.name = name

    this.node = node
    this.components = components || {}

    this.accentColor = accentColor
    this.icon = icon
  }

  createNode(): IngoNodeFromNodlNode<N> {
    const newNode = new this.node() as unknown as IngoNodeFromNodlNode<N>

    newNode.name = this.name
    newNode.data.registrationId = this.registrationId

    return newNode
  }
}

export type Catalog = {
  label?: string
  nodes: NodeRegistration[]
  subcategories: {
    [name: string]: Catalog
  }
}
