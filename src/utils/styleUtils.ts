export const classNames = {
  connectionG: "ingo connection-g",
  browserSearch: "ingo browser-search",
  browserDivider: "ingo browser-divider",
  browserEntry: "ingo browser-entry",
  browserEntryLabel: "ingo browser-entry-label",
  nodeBrowser: "ingo node-browser",
  nodeCard: "ingo node-card",
  nodeTitleBar: "ingo node-title-bar",
  nodeTitleIcon: "ingo node-title-icon",
  nodeTitleLabel: "ingo node-title-label",
  nodeDivider: "ingo node-divider",
  nodeField: "ingo node-field",
  nodeFieldLabel: "ingo node-field-label",
  nodeFieldType: "ingo node-field-type",
  nodeFieldSocket: "ingo node-field-socket",
  nodeFieldHoverZone: "ingo node-field-hover-zone",
  nodeFieldComponentWrapper: "ingo node-field-component-wrapper",
  editorWrapper: "ingo editor-wrapper",
  nodesContainer: "ingo nodes-container",
}

export const hexToRgb = (hex: string) => {
  const reg = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
  if (hex.length == 4) {
    hex = hex.slice(0, 2) + "0" + hex.slice(2, 3) + "0" + hex.slice(3, 4) + "0"
  }

  const res = reg.exec(hex)
  if (!res) return null

  const [_, r, g, b] = res
  if (!r || !g || !b) return null

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16),
  }
}

export const colorTransparent = (color: string, opacity = 0.2): string => {
  const passedColor = hexToRgb(color)
  if (!passedColor) throw new Error(`Invalid color: ${color}`)

  const { r, g, b } = passedColor

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
