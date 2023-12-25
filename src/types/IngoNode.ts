import { Node } from "../deps/nodl.ts"
import { FC } from "../deps/react.ts"
import { z } from "../deps/zod.ts"

import { Direction, PositionSchema } from "./Misc.ts"

export type IngoData = {
  registrationId?: string
}

export abstract class IngoNode<TData extends IngoData = IngoData> extends Node<TData> {}

type IngoNodeFromNodlNode<N extends Node> = IngoNode<
  (N extends Node<infer C> ? C : Record<string, any>) & IngoData
>

export const SerializedNodeSchema = z.object({
  inputNames: z.record(z.string()), // From socket id to name
  outputNames: z.record(z.string()), // From socket id to name
  data: z.record(z.any()),
  position: PositionSchema,
  outConnections: z.record(z.array(z.string())), // From output name to list of socket ids
})

export type SerializedNode = z.infer<typeof SerializedNodeSchema>

export type FieldComponentProps<Z extends z.ZodType> = {
  schema: Z
  updateFunc?: (value: z.infer<Z>) => void
  value: z.infer<Z>
  direction: Direction
  disabled: boolean
}

export type FieldComponent<Z extends z.ZodType> = FC<FieldComponentProps<Z>>

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
    const newNode = new this.node() as unknown as IngoNodeFromNodlNode<N> // TODO: this doesn't look right

    newNode.name = this.name
    newNode.data.registrationId = this.registrationId

    return newNode
  }
}

export type Catalog = {
  label?: string
  nodes: NodeRegistration[]
  subcategories: Record<string, Catalog>
}
