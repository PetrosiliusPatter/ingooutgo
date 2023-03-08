import styled from "styled-components"

export const EditorWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: overlay;

  scrollbar-width: 0px;
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
    background-color: transparent;
  }
  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 2px solid transparent;
    background: hsla(0, 0%, 100%, 0.25);
  }
  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  * {
    box-sizing: border-box;
  }

  --color-text: rgba(255, 255, 255, 0.9);
  --color-editor-background: #343a40;
  --color-browser-divider: #343a40;
  --color-browser-background: rgba(0, 0, 0, 0.5);
  --color-browser-entry-highlight: rgba(0, 0, 0, 0.2);
  --color-node-background: #212529;
  --color-node-divider: #343a40;
  --color-node-background-lighter: #464c51;
  --color-node-icon-background: #464c51;
  --color-node-socket: #ffffff;
  --color-connection: #ffff;
  --color-selection: rgba(253, 126, 20, 1);
  --color-connection-selection: rgba(253, 126, 20, 1);
  --color-selection-shadow: rgba(253, 126, 20, 0.2);
  --color-input-border: #343a40;
  --color-input-background: #464c51;
  --color-input-background-lighter: #464c51;
  --node-border-radius: 0.5rem;
  --font-size: 1rem;
  --icon-size: 1rem;
  --socket-size: 0.5rem;
`

export const NodesContainer = styled.div`
  position: relative;
  width: 8000px;
  height: 8000px;
  padding: 0;
  background-color: var(--color-editor-background);
  svg {
    pointer-events: auto !important;
  }
`

export const EditorContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: visible;
`
