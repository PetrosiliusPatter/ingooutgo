import { Node } from "../deps/nodl.ts"
import { FC } from "../deps/react.ts"
import { z } from "../deps/zod.ts"

import { Direction, PositionSchema } from "./Misc.ts"

export type IngoData = {
  registrationId?: string
}

export abstract class IngoNode<
  TData extends IngoData = IngoData,
  I extends Node["inputs"] = Node["inputs"],
  O extends Node["outputs"] = Node["outputs"],
> extends Node<TData> {
  abstract inputs: I
  abstract outputs: O
}

export type IngoNodeFromRegistration<R extends NodeRegistration> = R extends
  NodeRegistration<
    infer N
  > ? IngoNode<N["data"], N["inputs"], N["outputs"]>
  : never

export const SerializedNodeSchema = z.object({
  inputNames: z.record(z.string()), // From socket id to name
  outputNames: z.record(z.string()), // From socket id to name
  inputValues: z.record(z.any()), // From socket name to value
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

export type FieldExtras = {
  component?: FieldComponent<any>
  noSocket?: boolean
}

type FieldExtrasForNode<N extends Node> = {
  [K in (keyof N["inputs"]) | (keyof N["outputs"])]?: FieldExtras
}

type RegistrationParams<N extends Node = Node> = {
  id: string
  name: string
  node: new () => N
  fieldExtras?: FieldExtrasForNode<N>
  accentColor?: string
  icon?: string
}

type DataFromNodlNode<N extends Node> = N extends Node<infer C> ? C : Record<string, any>

export class NodeRegistration<N extends Node = Node> {
  public registrationId: string
  public name: string
  public fieldExtras: FieldExtrasForNode<N>

  public accentColor?: string
  public icon?: string

  node: new () => N

  constructor({ id, name, node, fieldExtras, accentColor, icon }: RegistrationParams<N>) {
    this.registrationId = id
    this.name = name

    this.node = node
    this.fieldExtras = fieldExtras || {}

    this.accentColor = accentColor
    this.icon = icon
  }

  createNode(): IngoNode<DataFromNodlNode<N> & IngoData, N["inputs"], N["outputs"]> {
    const newNode = new this.node()

    newNode.name = this.name
    newNode.data.registrationId = this.registrationId

    return newNode as unknown as IngoNode<
      DataFromNodlNode<N> & IngoData,
      N["inputs"],
      N["outputs"]
    > // TODO: this doesn't look right
  }
}

export type Catalog = {
  label?: string
  nodes: NodeRegistration[]
  subcategories: Record<string, Catalog>
}
