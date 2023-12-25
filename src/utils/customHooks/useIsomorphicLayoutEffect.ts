import { useEffect, useLayoutEffect } from "../../deps/react.ts"

export const useIsomorphicLayoutEffect = typeof window !== "undefined"
  ? useLayoutEffect
  : useEffect
