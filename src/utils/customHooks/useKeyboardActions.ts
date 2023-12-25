import { useCallback, useEffect, useMemo } from "../../deps/react.ts"

import { EditorStore } from "../../stores/EditorStore.ts"
import { KeyboardKey } from "../../types/KeyboardKey.ts"

export type KeyboardAction = {
  key: KeyboardKey | string
  modifier?: "ctrlKey" | "altKey" | "metaKey"
  callback: (e: KeyboardEvent) => void
}

export const useKeyboardActions = (store: EditorStore) => {
  const actions: KeyboardAction[] = useMemo(
    () => [
      /** Open Browser */
      {
        key: "a",
        callback: () => store.setBrowserVisibility(true),
      },
      {
        key: KeyboardKey.Delete,
        callback: store.deleteSelection,
      }
    ],
    [store],
  )

  const downHandler = useCallback(
    (e: KeyboardEvent) => {
      for (const action of actions) {
        if (action.key === e.key) {
          if (action.modifier && !e[action.modifier]) continue
          action.callback(e)
        }
      }
    },
    [actions],
  )

  useEffect(() => {
    addEventListener("keydown", downHandler)
    return () => {
      removeEventListener("keydown", downHandler)
    }
  }, [downHandler])
}
