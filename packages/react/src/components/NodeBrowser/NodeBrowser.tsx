import { observer } from "mobx-react-lite"
import * as React from "react"
import { ArrowBackUp, ArrowNarrowRight } from "tabler-icons-react"

import { StoreContext } from "../../stores/EditorStore"
import { NodeRegistration, Catalog, nodesInSubCategories } from "../../types/NodeCatalog"
import { useOnClickOutside, useKeyPress } from "../../utils/customHooks"
import { stopEvent } from "../../utils/misc"
import { classNames } from "../../utils/styleUtils"
import {
  BrowserWrapper,
  CatalogEntry,
  Divider,
  EntryLabel,
  NodeSearchField,
} from "./styles"

export const NodeBrowser = observer(() => {
  const { store } = React.useContext(StoreContext)

  const ref = React.useRef<HTMLDivElement | null>(null)

  const hideBrowser = React.useCallback(() => store.setBrowserVisibility(false), [store])

  useOnClickOutside(ref, hideBrowser)

  useKeyPress(hideBrowser, ["Escape"], [hideBrowser])

  const [pos, setPos] = React.useState({ x: -1, y: -1 })
  const [isPosLatest, setIsPosLatest] = React.useState(false)

  const [searchValue, setSearchValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const [history, setHistory] = React.useState<string[]>([])

  // Before opened
  React.useEffect(() => {
    if (!store.isBrowserVisible) {
      setIsPosLatest(false)
      setSearchValue("")
    }
    if (store.isBrowserVisible && !isPosLatest) {
      setHistory([])
      setPos(store.mousePosition)
      setIsPosLatest(true)
    }
  }, [store.isBrowserVisible, isPosLatest, store.mousePosition, store.rootCatalog])

  // After opened
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [isPosLatest])

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value)
  }

  const selectNode = React.useCallback(
    (n: NodeRegistration) => (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      const newNode = n.create()
      newNode.registrationId = n.id
      store.addNode(newNode, pos)
      hideBrowser()
    },
    [hideBrowser, pos, store]
  )

  const currSubCatalog = React.useMemo(() => {
    let curr: Catalog = store.rootCatalog
    for (let i = history.length - 1; i >= 0; i--) {
      curr = curr.subcategories[history[i]]
    }
    return curr
  }, [history, store.rootCatalog])

  const renderedEntries = React.useMemo(() => {
    const availableNodes = nodesInSubCategories(store.rootCatalog)
    if (searchValue) {
      return availableNodes
        .filter((n) => n.name.toLowerCase().includes(searchValue.toLowerCase()))
        .sort((a, b) => {
          const metricA = a.name.startsWith(searchValue) ? 2 : 0
          const metricB = b.name.startsWith(searchValue) ? 2 : 0
          if (metricA != metricB) {
            return (metricB - metricA) / 2
          }
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        })
        .map((n, ind) => {
          return (
            <CatalogEntry
              className={classNames.browserEntry}
              key={`node-entry-${ind}`}
              onClick={selectNode(n)}
            >
              <EntryLabel className={classNames.browserEntryLabel}>{n.name}</EntryLabel>
            </CatalogEntry>
          )
        })
    }

    let out = Object.entries(currSubCatalog.subcategories).map(
      ([catName, { label }], ind) => {
        const forward = () => {
          setHistory([catName, ...history])
        }
        return (
          <CatalogEntry
            className={classNames.browserEntry}
            key={`group-entry-${ind}`}
            onClick={forward}
          >
            <EntryLabel className={classNames.browserEntryLabel}>
              {label || catName}
            </EntryLabel>
            <ArrowNarrowRight size={"1rem"} />
          </CatalogEntry>
        )
      }
    )
    if (history.length > 0) {
      const back = () => {
        const newHistory = [...history]
        newHistory.shift()
        setHistory(newHistory)
      }
      out.unshift(
        <CatalogEntry className={classNames.browserEntry} key={`back`} onClick={back}>
          <ArrowBackUp size={"1rem"} />
        </CatalogEntry>
      )
    }
    out = out.concat(
      currSubCatalog.nodes.map((n, ind) => (
        <CatalogEntry
          className={classNames.browserEntry}
          key={`node-entry-${ind}`}
          onClick={selectNode(n)}
        >
          <EntryLabel className={classNames.browserEntryLabel}>{n.name}</EntryLabel>
        </CatalogEntry>
      ))
    )
    return out
  }, [currSubCatalog, searchValue, history, selectNode, store.rootCatalog])

  const out = React.useMemo(() => {
    if (!store.isBrowserVisible || !isPosLatest) {
      return <></>
    }
    return (
      <BrowserWrapper
        ref={ref}
        className={classNames.nodeBrowser}
        {...pos}
        onMouseDown={stopEvent}
      >
        <NodeSearchField
          ref={inputRef as React.RefObject<HTMLInputElement>}
          className={classNames.browserSearch}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key == "Escape") {
              hideBrowser()
            }
            e.stopPropagation()
          }}
          value={searchValue}
          onChange={onSearchChange}
          placeholder={"Search..."}
        />
        {renderedEntries.length > 0 && <Divider className={classNames.browserDivider} />}
        {renderedEntries}
      </BrowserWrapper>
    )
  }, [
    store.isBrowserVisible,
    isPosLatest,
    hideBrowser,
    searchValue,
    renderedEntries,
    pos,
  ])

  return out
})
