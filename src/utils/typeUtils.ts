import { Input, Output } from "../deps/nodl.ts"

export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null
}

export const isOutput = (socket: Input | Output): socket is Output => {
  return "subscription" in socket
}

export const isInput = (socket: Input | Output): socket is Input => {
  return !("subscription" in socket)
}
