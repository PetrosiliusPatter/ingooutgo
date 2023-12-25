import { DependencyList, useCallback, useEffect } from "../../deps/react.ts"

export const useKeyPress = (
  callback: () => void,
  keyCodes: string[],
  deps: DependencyList = [],
): void => {
  const handler = useCallback(({ code }: KeyboardEvent) => {
    if (!keyCodes.includes(code)) return
    callback()
  }, [callback, keyCodes])

  useEffect(() => {
    addEventListener("keydown", handler)
    return () => {
      removeEventListener("keydown", handler)
    }
  }, [handler, ...deps])
}
