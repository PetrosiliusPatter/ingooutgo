import styled from '@emotion/styled'

type DemoProps = {
  customTheme: boolean
}

export const DemoWrapper = styled.div<DemoProps>`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  ${({customTheme}) =>
    customTheme &&
    `
        * {
          --color-text: rgba(0, 0, 0, 0.9);
          --color-editor-background: #4e79a7;
          --color-browser-divider: #4e79a7;
          --color-browser-background: rgba(255, 255, 255, 0.5);
          --color-browser-entry-highlight: rgba(255, 255, 255, 0.2);
          --color-node-background: #f28e2b;
          --color-node-divider: #4e79a7;
          --color-node-background-lighter: #e15759;
          --color-node-icon-background: #b74996;
          --color-node-socket: #000000;
          --color-connection: #1b9e77;
          --color-selection: rgba(230, 25, 75, 1);
          --color-connection-selection: rgba(60, 180, 75, 1);
          --color-selection-shadow: rgba(230, 25, 75, 0.2);
          --color-input-border: #4e79a7;
          --color-input-background: #e15759;
          --color-input-background-lighter: #f28e2b;
        }
    `}
`

export const InfoText = styled.span`
  font-size: 0.8rem;
  color: #c1c1c1;
`

export const Description = styled.span`
  font-size: 1rem;
  width: 700px;
  max-width: 80vw;
  color: #ffffff;
  a {
    color: #f5a152;
    text-decoration: underline;
  }
`
