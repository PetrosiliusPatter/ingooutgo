import { action, computed, makeObservable, observable } from "mobx"
import { Observable, ReplaySubject, Subscription } from "rxjs"
import { v4 as uuid } from "uuid"
import { z } from "zod"

import { Connection } from "../Connection/Connection"
import { FieldComponent } from "../FieldComponent"
import { Input } from "../Input/Input"
import { IOutputProps } from "./types"

export class Output<ZS extends z.Schema> extends ReplaySubject<z.infer<ZS>> {
  /** Identifier */
  public id: string = uuid()
  /** Name */
  public name: string
  /** Type */
  public type: ZS
  /** Compute operation */
  public observable: Observable<z.infer<ZS>>
  /** Value Operator subscription */
  public subscription: Subscription
  /** Associated Connections */
  public connections: Connection<ZS>[]

  /** Function to render the component */
  public component?: FieldComponent<ZS>

  constructor(props: IOutputProps<ZS>) {
    super()

    this.name = props.name || "Untitled"
    this.type = props.type
    this.observable = props.observable
    this.subscription = this.observable.subscribe(this)
    this.connections = []
    this.component = props.component

    makeObservable(this, {
      id: observable,
      name: observable,
      type: observable,
      observable: observable,
      subscription: observable,
      connections: observable,
      component: observable,
      connected: computed,
      connect: action,
      dispose: action,
    })
  }

  /** Determines if output is connected */
  public get connected(): boolean {
    return this.connections.length > 0
  }

  /** Connects the output with a compatible input port */
  public connect(input: Input<ZS>): Connection<z.infer<ZS>> {
    return new Connection(this, input)
  }

  /** Disposes the Output */
  public dispose() {
    for (const connection of this.connections) {
      connection.dispose()
    }

    this.connections = []

    this.subscription.unsubscribe()
    this.unsubscribe()
  }
}
