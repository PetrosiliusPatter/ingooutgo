import { action, computed, makeObservable, observable } from "mobx"
import { BehaviorSubject } from "rxjs"
import { v4 as uuid } from "uuid"
import { z } from "zod"

import { Connection } from "../Connection/Connection"
import { FieldComponent } from "../FieldComponent"
import { IInputProps } from "./types"

export class Input<ZS extends z.Schema> extends BehaviorSubject<z.infer<ZS>> {
  /** Identifier */
  public id: string = uuid()
  /** Name */
  public name: string
  /** Type */
  public type: ZS
  /** Default Value */
  public defaultValue: z.infer<ZS>
  /** Associated Connection */
  public connection: Connection<ZS> | null

  public component?: FieldComponent<ZS>

  constructor(props: IInputProps<ZS>) {
    super(props.defaultValue)

    this.name = props.name || "Untitled"
    this.type = props.type
    this.defaultValue = props.defaultValue
    this.connection = null
    this.component = props.component

    makeObservable(this, {
      id: observable,
      name: observable,
      type: observable,
      defaultValue: observable,
      connection: observable,
      component: observable,
      connected: computed,
      dispose: action,
    })
  }

  /** Determines if input is connected */
  public get connected(): boolean {
    return !!this.connection
  }

  /** Disposes the Input */
  public dispose(): void {
    this.connection?.dispose()
    this.connection = null

    this.unsubscribe()
  }
}
