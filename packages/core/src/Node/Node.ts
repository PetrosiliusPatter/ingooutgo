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
  /** Name of the Node Registration (for serialization) */
  public registrationId: string = ""
  /** Node Inputs */
  public inputs: Record<string, Input<any>> = {}
  /** Node Outputs */
  public outputs: Record<string, Output<any>> = {}
  /** Arbitrary Data Store */
  public data: TData = {} as TData

  /** Icon to show (TablerIcons) */
  public icon?: string = undefined
  /** Accent color to use */
  public accentColor?: string = undefined

  constructor() {
    makeObservable(this, {
      id: observable,
      name: observable,
      registrationId: observable,
      inputs: observable,
      outputs: observable,
      data: observable,
      icon: observable,
      accentColor: observable,
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
