import { observer } from "../../deps/mobx-react-lite.ts"
import {
  FC,
  MouseEventHandler,
  React,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../deps/react.ts"
import { z } from "../../deps/zod.ts"

import { StoreContext } from "../../stores/EditorStore.ts"
import { Direction } from "../../types/Misc.ts"
import { socketToArcherKey, stopEvent } from "../../utils/misc.ts"
import { classNames } from "../../utils/styleUtils.ts"
import { isOutput } from "../../utils/typeUtils.ts"
import {
  FieldComponentWrapper,
  FieldLabel,
  FieldType,
  FieldWrapper,
  HoverZone,
  Socket,
  SocketDot,
} from "./styles.ts"

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
    const { store } = useContext(StoreContext)

    const socketRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!socketRef.current) return
      if (!store) return

      store.setSocketElement(fieldId, socketRef.current)
      return () => {
        store.setSocketElement(fieldId, null)
      }
    }, [fieldId, store])

    const registerConnectStart = useCallback<
      MouseEventHandler<HTMLElement> & MouseEventHandler<HTMLElement>
    >(
      (e) => {
        e.stopPropagation()
        if (!store) return
        if (direction === "incoming") {
          const socket = store.getSocketFromIds([nodeId, fieldId])
          if (!socket) return
          if (isOutput(socket)) return
          if (socket.connection) return
        }
        store.setConnectionStartIds([nodeId, fieldId])
      },
      [direction, nodeId, fieldId, store],
    )

    const hoverConnecting = useCallback(
      (isIn: boolean) =>
        store?.proposeConnectionEndIds(isIn ? [nodeId, fieldId] : undefined),
      [nodeId, fieldId, store],
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
  },
)

export const NodeField: FC<NodeFieldProps> = observer(
  ({ nodeId, fieldId }) => {
    const { store } = useContext(StoreContext)

    const nodeData = store?.getNodeById(nodeId)
    const nodeReg = store?.getRegistrationById(nodeData?.data.registrationId ?? "")

    const { direction, fieldData, fieldKey, noSocket } = useMemo(() => {
      const inputField = Object.entries(nodeData?.inputs ?? {}).find(([, input]) =>
        input.id === fieldId
      )

      if (inputField) {
        return {
          direction: "incoming" as const,
          fieldKey: inputField[0],
          fieldData: inputField[1],
          noSocket: !!nodeReg?.fieldExtras[inputField[0]]?.noSocket,
        }
      }

      const outputField = Object.entries(nodeData?.outputs ?? {}).find(([, output]) =>
        output.id === fieldId
      )
      return {
        direction: "outgoing" as const,
        fieldKey: outputField?.[0],
        fieldData: outputField?.[1],
        noSocket: !!nodeReg?.fieldExtras[outputField?.[0] ?? ""]?.noSocket,
      }
    }, [nodeData, fieldId])

    const [fieldVal, setFieldVal] = useState<unknown>()

    useEffect(() => {
      if (!fieldData) return

      const newFieldSubscription = fieldData.subscribe(setFieldVal)
      return () => {
        newFieldSubscription?.unsubscribe()
      }
    }, [fieldData])

    const [isCompFocused, setIsCompFocused] = useState(false)

    const renderedFieldComp = useMemo(() => {
      if (!nodeReg || !fieldData || !fieldKey) return

      const fieldExtras = nodeReg.fieldExtras[fieldKey]
      const FieldComp = fieldExtras?.component
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
            updateFunc={disabled ? undefined : (v) => {
              const newVal = fieldData.type.validator.safeParse(v)
              if (!newVal.success) return
              fieldData.next(newVal.data)
            }}
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
        {!noSocket && (
          <FieldType
            className={classNames.nodeFieldType}
            textAlign={direction === "incoming" ? "left" : "right"}
          >
            {fieldData.type.name}
          </FieldType>
        )}
        {renderedFieldComp}
        {!noSocket && (
          <ConnectionSocket direction={direction} nodeId={nodeId} fieldId={fieldId} />
        )}
      </FieldWrapper>
    )
  },
)
