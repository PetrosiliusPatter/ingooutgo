import { injectGlobal } from "@emotion/css"

injectGlobal`
    /* http://meyerweb.com/eric/tools/css/reset/ 
      v2.0 | 20110126
      License: none (public domain)
    */

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    html,
    body,
    input,
    div,
    button {
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
        Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif !important;
    }

    .playground-wrapper {
      width: 100vw;
      height: calc(100vh - 2rem);
    }

    .debug-panel {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 2rem;
      gap: 4px;
      padding: 0 4px;
      button {
        height: calc(2rem - 8px);
      }
    }

    .ugly-theme {
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
`
