import { Dispatch, SetStateAction, useCallback, useState } from "../../deps/react.ts"

interface ReturnType {
  value: boolean
  setValue: Dispatch<SetStateAction<boolean>>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

export const useBoolean = (defaultValue?: boolean): ReturnType => {
  const [value, setValue] = useState(!!defaultValue)

  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  const toggle = useCallback(() => setValue((x) => !x), [])

  return { value, setValue, setTrue, setFalse, toggle }
}
