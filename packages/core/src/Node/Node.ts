import { action, computed, makeObservable, observable } from "mobx"
import { v4 as uuid } from "uuid"
import { z } from "zod"

import { Connection } from "../Connection/Connection"
import { Input } from "../Input/Input"
import { Output } from "../Output/Output"
import { NodeData } from "./types"

export abstract class Node<TData extends NodeData = NodeData> {
  /** Identifier */
  public id: string = uuid()
  /** Node Name */
  public name: string = this.constructor.name
  /** Node Inputs */
  public abstract inputs: Record<string, Input<any>>
  /** Node Outputs */
  public abstract outputs: Record<string, Output<any>>
  /** Arbitrary Data Store */
  public data: TData = {} as TData
  /** Name of the Node Registration (for serialization) */
  public registrationId: string = ""

  /** Icon to show (TablerIcons) */
  public icon?: string
  /** Accent color to use */
  public accentColor?: string

  constructor() {
    makeObservable(this, {
      id: observable,
      name: observable,
      data: observable,
      icon: observable,
      accentColor: observable,
      registrationId: observable,
      connections: computed,
      dispose: action,
    })
  }

  /** Associated connections */
  public get connections() {
    return [...Object.values(this.inputs), ...Object.values(this.outputs)]
      .flatMap((port) => ("connection" in port ? [port.connection] : port.connections))
      .filter((connection): connection is Connection<z.Schema> => Boolean(connection))
  }

  /** Disposes the Node */
  public dispose(): void {
    for (const input of Object.values(this.inputs)) {
      input.dispose()
    }
    for (const output of Object.values(this.outputs)) {
      output.dispose()
    }
  }
}
