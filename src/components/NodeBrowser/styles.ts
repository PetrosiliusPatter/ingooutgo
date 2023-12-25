import { styled } from "../../deps/emotion-styled.ts"

export const NodeSearchField = styled.input<React.HTMLAttributes<HTMLInputElement>>`
  width: 100%;
  height: 2rem;
  background-color: transparent;
  border-radius: 0;
  border: 0px solid transparent;
  outline: none;
  color: var(--color-text);
  font-size: 1rem;
  padding: 0px 8px;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--color-browser-divider);
`

export const CatalogEntry = styled.div<React.HTMLAttributes<HTMLElement>>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  color: var(--color-text);
  line-height: 1rem;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  :last-child {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    padding-bottom: 12px;
  }
  :hover {
    background-color: var(--color-browser-entry-highlight);
  }
`

export const EntryLabel = styled.span`
  flex-grow: 1;
`

const backgroundBlur = 1.5

export const BrowserWrapper = styled.div`
  position: relative;
  width: fit-content;
  background-color: var(--color-browser-background);
  border-radius: 16px;
  z-index: 20;
  backdrop-filter: blur(${backgroundBlur}px);
`
