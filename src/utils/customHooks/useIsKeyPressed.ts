import { useCallback, useEffect, useState } from "../../deps/react.ts"

export const useIsKeyPressed = (targetKey: string): boolean => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)

  // If pressed key is our target key then set to true
  const downHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key !== targetKey) return
    setKeyPressed(true)
  }, [targetKey])

  // If released key is our target key then set to false
  const upHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key !== targetKey) return
    setKeyPressed(false)
  }, [targetKey])

  // Add event listeners
  useEffect(() => {
    addEventListener("keydown", downHandler)
    addEventListener("keyup", upHandler)
    // Remove event listeners on cleanup
    return () => {
      removeEventListener("keydown", downHandler)
      removeEventListener("keyup", upHandler)
    }
  }, [downHandler, upHandler])

  return keyPressed
}
