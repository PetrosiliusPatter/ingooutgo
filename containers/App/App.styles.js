import { injectGlobal } from "@emotion/css";
injectGlobal `
    html,
    body,
    input,
    div,
    button {
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
        Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif !important;
    }

    body {
        margin: 0;
        background-color: #1c1e2a;
    }

    #theme-select {
      height: 2rem;
    }

    .playground-wrapper {
      width: 100vw;
      height: calc(100vh - 2rem);
    }

    .debug-panel {
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .simple-theme {
      .ingo {
        --color-text: rgba(255, 255, 255, 0.9);
        --color-editor-background: #4d455d;
        --color-browser-divider: #4d455d;
        --color-browser-background: rgba(0, 0, 0, 0.5);
        --color-browser-entry-highlight: rgba(0, 0, 0, 0.2);
        --color-node-background: #7db9b6;
        --color-node-divider: #4c64a0;
        --color-node-background-lighter: #6291b8;
        --color-node-icon-background: #343d8f;
        --color-node-socket: #ffffff;
        --color-connection: #ffff;
        --color-selection: rgb(233, 100, 121);
        --color-connection-selection: rgb(233, 100, 121);
        --color-selection-shadow: rgb(233, 100, 121, 0.2);
        --color-input-border: #000000;
        --color-input-background: #6291b8;
        --color-input-background-lighter: #6291b8;
        --node-border-radius: 0.5rem;
        --font-size: 1rem;
        --icon-size: 1rem;
        --socket-size: 0.5rem;
      }  
    }
`;
