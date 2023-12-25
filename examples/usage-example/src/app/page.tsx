'use client'

import {Catalog, EditorStore, NodeEditor, Position} from 'ingooutgo'
import {mathCatalog, stringCatalog} from 'ingooutgo-example-nodes'
import {useState} from 'react'
import {InfoPanel} from './components/InfoPanel'
import {DemoWrapper} from './styles'
import {MantineProvider} from '@mantine/core'

// core styles are required for all packages
import '@mantine/core/styles.css'

const nodeCatalog: Catalog = {
  nodes: [],
  subcategories: {
    mathNodes: mathCatalog,
    stringNodes: stringCatalog,
  },
}

const customPathFunc = (start: Position, end: Position) => `
M${start.x},${start.y} 
L${end.x},${end.y}
`

const App = () => {
  const [store] = useState(new EditorStore(nodeCatalog))

  const [customConnection, setCustomConnection] = useState(false)
  const [customTheme, setCustomTheme] = useState(false)

  // ------- Render -------
  return (
    <MantineProvider defaultColorScheme='dark'>
      <DemoWrapper customTheme={customTheme}>
        <InfoPanel
          customConnection={customConnection}
          setCustomConnection={setCustomConnection}
          customTheme={customTheme}
          setCustomTheme={setCustomTheme}
        />
        <NodeEditor
          store={store}
          reactions={{
            onConnection: (connection) =>
              console.log('NEW CONNECTION', connection),
            onConnectionRemoval: (connection) =>
              console.log('REMOVED CONNECTION', connection),
            onNodeRemoval: (node) => console.log('REMOVED NODE', node),
            onSelectionChanged: (nodes, connections) =>
              console.log('SELECTION CHANGED', {nodes, connections}),
          }}
          customPathFunc={customConnection ? customPathFunc : undefined}
        />
      </DemoWrapper>
    </MantineProvider>
  )
}

export default App
