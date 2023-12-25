import { useEffect, useRef } from "../../deps/react.ts"

// See: https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect.ts"

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) return

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}
