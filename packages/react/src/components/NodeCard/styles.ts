import styled from "styled-components"

import { colorTransparent } from "../../utils/styleUtils"

interface NodeProps {
  x?: number
  y?: number
  selected?: boolean
}

export const NodeWrapper = styled.div<NodeProps>`
  position: absolute;
  border-radius: var(--node-border-radius);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background-color: var(--color-node-background);

  ${({ selected }) => {
    return selected ? "" : "-"
  }} {
    outline: 1.5px solid var(--color-selection);
    box-shadow: 0px 4px 8px 0px var(--color-selection-shadow),
      0px 6px 20px 0px var(--color-selection-shadow);
    z-index: 2;
  }
`
interface TitleProps {
  titleBarColor?: string
}

const titleBarColor = ({ titleBarColor }: TitleProps) => titleBarColor
const dividerColor = ({ titleBarColor }: TitleProps) =>
  titleBarColor ? colorTransparent(titleBarColor, 0.5) : "var(--color-node-divider)"

export const NodeTitleBar = styled.div<TitleProps>`
  padding: calc(var(--font-size) * 0.4) calc(var(--font-size) * 0.8);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-top-left-radius: var(--node-border-radius);
  border-top-right-radius: var(--node-border-radius);
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
  font-size: var(--font-size);
`

export const NodeIconWrapper = styled.div<NodeProps>`
  line-height: var(--font-size);
  margin-right: calc(var(--font-size) * 0.4);
  width: calc(var(--icon-size) * 1.25);
  height: calc(var(--icon-size) * 1.25);
  border-radius: 50%;
  padding: calc((var(--icon-size) * 0.25) * 0.5);
  color: ${({ selected }: NodeProps) =>
    selected ? "var(--color-selection)" : "var(--color-text)"};
  background-color: var(--color-node-icon-background);
`

export const DataContainer = styled.div`
  padding: 8px;
  width: 100%;
`
