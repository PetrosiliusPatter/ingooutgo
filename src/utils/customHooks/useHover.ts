import { MouseEvent, useCallback, useRef, useState } from "../../deps/react.ts"

type HoverEventHandler<TElement> = (
  event: MouseEvent<TElement>,
) => ((event: MouseEvent<TElement>) => void) | void

export const useHover = <TElement>(onHover?: HoverEventHandler<TElement>) => {
  const [isHovered, setHover] = useState(false)
  const cleanup = useRef<((event: MouseEvent<TElement>) => void) | void>()

  const onMouseEnter = useCallback((e: MouseEvent<TElement>) => {
    setHover(true)
    cleanup.current = onHover?.(e)
  }, [onHover])

  const onMouseLeave = useCallback((e: MouseEvent<TElement>) => {
    setHover(false)
    cleanup.current?.(e)
  }, [])

  return {
    onMouseEnter,
    onMouseLeave,
    isHovered,
  }
}
