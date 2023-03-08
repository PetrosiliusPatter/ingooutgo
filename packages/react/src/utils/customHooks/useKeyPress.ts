import { DependencyList, useEffect } from "react"

export const useKeyPress = (
  callback: () => void,
  keyCodes: string[],
  deps: DependencyList = []
): void => {
  const handler = ({ code }: KeyboardEvent) => {
    if (keyCodes.includes(code)) {
      callback()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
    }
  }, [callback, ...deps])
}
