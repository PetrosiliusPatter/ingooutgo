import { styled } from "../../deps/emotion-styled.ts"
import { Direction } from "../../types/Misc.ts"

interface LabelStyleProps {
  textAlign?: "left" | "right" | "middle"
}

export const FieldWrapper = styled.div`
  min-height: 1rem;
  width: 100%;
  margin: 0rem 0.4rem 0.3rem 0.4rem;
  position: relative;

  padding: 0 0.6rem;
  font-size: 1rem;
  line-height: 1rem;
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
  width: 0.5rem;
  height: 0.5rem;
  top: 0.45rem;
  ${({ direction }: SocketProps) =>
  (direction == "incoming" ? "left: " : "right: ") + `-0.25rem`};
`

interface SocketDotProps {
  color?: string
}

const activationSize = 2

export const SocketDot = styled.div<SocketDotProps>`
  width: 0.5rem;
  height: 0.5rem;
  margin-top: calc((0.5rem * ${activationSize} - 0.5rem) * 0.5);
  margin-left: calc(
    ((0.5rem * ${activationSize}) - 0.5rem) * 0.5
  );
  border-radius: 50%;
  background-color: ${({ color }: SocketDotProps) => color || "var(--color-node-socket)"};
  flex-shrink: 0;
`

export const HoverZone = styled.div<SocketProps>`
  position: absolute;
  width: calc(0.5rem * ${activationSize});
  height: calc(0.5rem * ${activationSize});
  top: calc(((0.5rem * ${activationSize}) - 0.5rem) * -0.5);
  ${({ direction }: SocketProps) =>
  (direction == "incoming" ? "left: " : "right: ") +
  `calc((0.5rem - 0.5rem * ${activationSize}) *0.5)`};
  user-select: none;
`

export const FieldComponentWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0.3rem 0;
`
