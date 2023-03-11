import { Input, Output } from "@nodl/core"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { z } from "zod"

import { StoreContext } from "../../stores/EditorStore"
import { Direction } from "../../types"
import { socketToArcherKey, stopEvent } from "../../utils/misc"
import { classNames } from "../../utils/styleUtils"
import {
  FieldComponentWrapper,
  FieldLabel,
  FieldType,
  FieldWrapper,
  HoverZone,
  Socket,
  SocketDot,
} from "./styles"

type NodeFieldProps = {
  nodeId: string
  fieldId: string
}
type SocketProps = NodeFieldProps & {
  direction: Direction
  color?: string
}
const ConnectionSocket: React.FC<SocketProps> = observer(
  ({ direction, color, nodeId, fieldId }) => {
    const { store } = React.useContext(StoreContext)

    const socketRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (!socketRef.current) return

      store.setSocketElement(fieldId, socketRef.current)
      return () => {
        store.setSocketElement(fieldId, null)
      }
    }, [fieldId, socketRef.current, store])

    const registerConnectStart = React.useCallback<
      React.MouseEventHandler<HTMLElement> & React.MouseEventHandler<HTMLElement>
    >(
      (e) => {
        e.stopPropagation()
        if (direction === "incoming") {
          const socket = store.getSocketFromIds([nodeId, fieldId]) as
            | Input<any>
            | undefined
          if (!socket) return
          if (socket.connection) return
        }
        store.setConnectionStartIds([nodeId, fieldId])
      },
      [nodeId, fieldId, store]
    )

    const hoverConnecting = React.useCallback(
      (isIn: boolean) => {
        store.proposeConnectionEndIds(isIn ? [nodeId, fieldId] : undefined)
      },
      [nodeId, fieldId, store]
    )

    return (
      <Socket
        className={classNames.nodeFieldSocket}
        direction={direction}
        key={socketToArcherKey(nodeId, fieldId, direction)}
      >
        <HoverZone
          className={classNames.nodeFieldHoverZone}
          direction={direction}
          onMouseEnter={() => hoverConnecting(true)}
          onMouseLeave={() => hoverConnecting(false)}
          onMouseDown={registerConnectStart}
        >
          <SocketDot color={color} ref={socketRef} />
        </HoverZone>
      </Socket>
    )
  }
)

export const NodeField: React.FC<NodeFieldProps> = observer(({ nodeId, fieldId }) => {
  const { store } = React.useContext(StoreContext)

  const nodeData = store.getNodeById(nodeId)
  const nodeReg = store.getRegistrationById(nodeData?.data.registrationId || "")

  const { direction, fieldData, fieldKey } = React.useMemo(() => {
    const inputField: [string, Input<any>] | undefined = Object.entries(
      nodeData?.inputs || {}
    ).find(([, input]) => input.id === fieldId)
    const outputField: [string, Output<any>] | undefined = Object.entries(
      nodeData?.outputs || {}
    ).find(([, output]) => output.id === fieldId)

    return inputField
      ? {
          direction: "incoming" as Direction,
          fieldKey: inputField[0],
          fieldData: inputField[1],
        }
      : {
          direction: "outgoing" as Direction,
          fieldKey: outputField?.[0],
          fieldData: outputField?.[1],
        }
  }, [nodeData])

  const [fieldSubscription, setFieldSubscription] = React.useState<
    ReturnType<Exclude<typeof fieldData, undefined>["subscribe"]> | undefined
  >(undefined)
  const [fieldVal, setFieldVal] = React.useState<unknown | undefined>(undefined)

  React.useEffect(() => {
    if (!fieldData) return

    setFieldSubscription(fieldData.subscribe(setFieldVal))
    return () => {
      fieldSubscription?.unsubscribe()
      setFieldSubscription(undefined)
    }
  }, [fieldData])

  const [isCompFocused, setIsCompFocused] = React.useState(false)
  const renderedFieldComp = React.useMemo(() => {
    if (!nodeReg || !fieldData || !fieldKey) return

    const FieldComp = nodeReg.components[fieldKey]
    if (!FieldComp) return

    const disabled = direction === "outgoing" || fieldData.connected

    return (
      <FieldComponentWrapper
        className={classNames.nodeFieldComponentWrapper}
        onMouseMove={isCompFocused ? stopEvent : undefined}
        onKeyDown={isCompFocused ? stopEvent : undefined}
        onMouseDown={!disabled ? stopEvent : undefined}
        onFocus={() => setIsCompFocused(true)}
        onBlur={() => setIsCompFocused(false)}
      >
        <FieldComp
          value={fieldVal}
          updateFunc={
            disabled
              ? undefined
              : (v) => {
                  const newVal = (fieldData.type as z.Schema<any>).safeParse(v)
                  if (!newVal.success) return
                  fieldData.next(newVal.data)
                }
          }
          direction={direction}
          disabled={disabled}
          schema={fieldData.type}
        />
      </FieldComponentWrapper>
    )
  }, [nodeReg, fieldData, fieldVal, fieldKey, direction, isCompFocused])

  if (!fieldData) return <></>
  return (
    <FieldWrapper className={classNames.nodeField}>
      <FieldLabel
        className={classNames.nodeFieldLabel}
        textAlign={direction === "incoming" ? "left" : "right"}
      >
        {fieldData.name}
      </FieldLabel>
      <FieldType
        className={classNames.nodeFieldType}
        textAlign={direction === "incoming" ? "left" : "right"}
      >
        {fieldData.type._def.description}
      </FieldType>
      {renderedFieldComp}
      {fieldData ? (
        <ConnectionSocket direction={direction} nodeId={nodeId} fieldId={fieldId} />
      ) : (
        <> </>
      )}
    </FieldWrapper>
  )
})
