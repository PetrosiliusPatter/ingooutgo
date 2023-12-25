import { styled } from "../../deps/emotion-styled.ts"
import { colorTransparent } from "../../utils/styleUtils.ts"

interface NodeProps {
  x?: number
  y?: number
  selected?: boolean
}

export const NodeWrapper = styled.div<NodeProps>`
  position: absolute;
  border-radius: 0.5rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background-color: var(--color-node-background);

${({ selected }: NodeProps) =>
  selected && "\
  outline: 1.5px solid var(--color-selection);\
  box-shadow: 0px 4px 8px 0px var(--color-selection-shadow), 0px 6px 20px 0px var(--color-selection-shadow);\
  z-index: 2;\
  "};
`
interface TitleProps {
  titleBarColor?: string
}

const titleBarColor = ({ titleBarColor }: TitleProps) => titleBarColor
const dividerColor = ({ titleBarColor }: TitleProps) =>
  titleBarColor ? colorTransparent(titleBarColor, 0.5) : "var(--color-node-divider)"

export const NodeTitleBar = styled.div<TitleProps>`
  padding: 0.4rem 0.8rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: ${titleBarColor};
`

export const Divider = styled.div<TitleProps>`
  width: 100%;
  height: 1px;
  background-color: ${dividerColor};
  margin-bottom: 0.3rem;
`

export const NodeLabel = styled.div<NodeProps>`
  text-align: center;
  color: var(--color-text);
  cursor: default;
  font-size: 1rem;
`

export const NodeIconWrapper = styled.div<NodeProps>`
  line-height: 1rem;
  margin-right: 0.4rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  padding: 0.125rem;
  color: ${({ selected }: NodeProps) =>
  selected ? "var(--color-selection)" : "var(--color-text)"};
  background-color: var(--color-node-icon-background);
`

export const DataContainer = styled.div`
  padding: 8px;
  width: 100%;
`
