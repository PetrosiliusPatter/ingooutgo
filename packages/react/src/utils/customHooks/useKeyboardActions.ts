import * as React from "react"

import { EditorStore } from "../../stores/EditorStore"
import { KeyboardKey } from "../../types/KeyboardKey"

export type KeyboardAction = {
  key: KeyboardKey | string
  modifier?: "ctrlKey" | "altKey" | "metaKey"
  callback: (e: KeyboardEvent) => void
}

export const useKeyboardActions = (store: EditorStore) => {
  const openBrowser = React.useCallback(() => {
    store.setBrowserVisibility(true)
  }, [store])

  const deleteSelection = React.useCallback(() => {
    store.deleteSelection()
  }, [store])

  const actions: KeyboardAction[] = React.useMemo(
    () => [
      /** Open Browser */
      {
        key: "a",
        callback: openBrowser,
      },
      {
        key: KeyboardKey.Delete,
        callback: deleteSelection,
      },
    ],
    [openBrowser, deleteSelection]
  )

  const downHandler = React.useCallback(
    (e: KeyboardEvent) => {
      for (const action of actions) {
        if (action.key === e.key) {
          if (action.modifier && !e[action.modifier]) continue
          action.callback(e)
        }
      }
    },
    [actions]
  )

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler)

    return () => {
      window.removeEventListener("keydown", downHandler)
    }
  }, [downHandler])
}
