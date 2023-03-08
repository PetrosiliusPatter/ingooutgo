import { Direction } from "@ingooutgo/core"
import styled from "styled-components"

interface LabelStyleProps {
  textAlign?: "left" | "right" | "middle"
}

export const FieldWrapper = styled.div`
  min-height: 1rem;
  width: 100%;
  margin: 0rem 0.4rem 0.3rem 0.4rem;
  position: relative;

  padding: 0 0.6rem;
  font-size: var(--font-size);
  line-height: var(--font-size);
`

export const FieldLabel = styled.div<LabelStyleProps>`
  cursor: default;
  text-align: ${({ textAlign }: LabelStyleProps) => textAlign || "right"};
  color: var(--color-text);
`

export const FieldType = styled.div<LabelStyleProps>`
  cursor: default;
  text-align: ${({ textAlign }: LabelStyleProps) => textAlign || "right"};
  color: var(--color-text);
  font-size: 0.6rem;
`

interface SocketProps extends React.HTMLAttributes<HTMLElement> {
  direction: Direction
}

export const Socket = styled.div<SocketProps>`
  position: absolute;
  width: var(--socket-size);
  height: var(--socket-size);
  top: calc((var(--font-size) + 0.4rem - var(--socket-size)) * 0.5);
  ${({ direction }: SocketProps) =>
    (direction == "incoming" ? "left: " : "right: ") + `calc(var(--socket-size) * -0.5)`};
`

interface SocketDotProps {
  color?: string
}

const activationSize = 2

export const SocketDot = styled.div<SocketDotProps>`
  width: var(--socket-size);
  height: var(--socket-size);
  margin-top: calc((var(--socket-size) * ${activationSize} - var(--socket-size)) * 0.5);
  margin-left: calc(
    ((var(--socket-size) * ${activationSize}) - var(--socket-size)) * 0.5
  );
  border-radius: 50%;
  background-color: ${({ color }: SocketDotProps) => color || "var(--color-node-socket)"};
  flex-shrink: 0;
`

export const HoverZone = styled.div<SocketProps>`
  position: absolute;
  width: calc(var(--socket-size) * ${activationSize});
  height: calc(var(--socket-size) * ${activationSize});
  top: calc(((var(--socket-size) * ${activationSize}) - var(--socket-size)) * -0.5);
  ${({ direction }: SocketProps) =>
    (direction == "incoming" ? "left: " : "right: ") +
    `calc((var(--socket-size) - var(--socket-size) * ${activationSize}) *0.5)`};
  user-select: none;
`

export const FieldComponentWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0.3rem 0;
`
