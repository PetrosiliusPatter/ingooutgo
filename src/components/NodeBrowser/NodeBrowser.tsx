import { observer } from "../../deps/mobx-react-lite.ts"
import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  React,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../deps/react.ts"
import { ArrowBackUp, ArrowNarrowRight } from "../../deps/tabler-icons-react.ts"

import { StoreContext } from "../../stores/EditorStore.ts"
import { Catalog, NodeRegistration } from "../../types/IngoNode.ts"
import { useKeyPress } from "../../utils/customHooks/useKeyPress.ts"
import { useOnClickOutside } from "../../utils/customHooks/useOnClickOutside.ts"
import { stopEvent } from "../../utils/misc.ts"
import { classNames } from "../../utils/styleUtils.ts"
import {
  BrowserWrapper,
  CatalogEntry,
  Divider,
  EntryLabel,
  NodeSearchField,
} from "./styles.ts"

export const NodeBrowser = observer(() => {
  const { store } = useContext(StoreContext)

  const ref = useRef<HTMLDivElement | null>(null)

  const hideBrowser = useCallback(() => store?.setBrowserVisibility(false), [store])

  useOnClickOutside(ref, hideBrowser)
  useKeyPress(hideBrowser, ["Escape"], [hideBrowser])

  const [pos, setPos] = useState({ x: -1, y: -1 })
  const [isPosLatest, setIsPosLatest] = useState(false)

  const [searchValue, setSearchValue] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [history, setHistory] = useState<string[]>([])

  // Before opened
  useEffect(() => {
    if (!store) return
    if (!store.isBrowserVisible) {
      setIsPosLatest(false)
      setSearchValue("")
    }
    if (store.isBrowserVisible && !isPosLatest) {
      setHistory([])
      setPos(store.mousePosition)
      setIsPosLatest(true)
    }
  }, [
    store?.isBrowserVisible,
    isPosLatest,
    store?.mousePosition,
    store?.nodeCatalog,
    store,
  ])

  // After opened
  useEffect(() => {
    inputRef.current?.focus()
  }, [isPosLatest])

  const onSearchChange = (e: FormEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value)
  }

  const selectNode = useCallback(
    (n: NodeRegistration) => (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      if (!store) return
      store.addNode(n.createNode(), pos)
      hideBrowser()
    },
    [hideBrowser, pos, store],
  )

  const currSubCatalog = useMemo(() => {
    if (!store) return
    const currCatalog: Catalog = history.reverse().reduce((acc, curr) => {
      const nextCatalog = acc.subcategories[curr]
      if (!nextCatalog) {
        throw Error("Invalid history")
      }
      return nextCatalog
    }, store.nodeCatalog)

    return currCatalog
  }, [history, store])

  const renderedEntries = useMemo(() => {
    if (!currSubCatalog) return []
    if (!store) return []

    if (searchValue) {
      return store
        .getAllNodeRegistrations()
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
      },
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
        </CatalogEntry>,
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
      )),
    )
    return out
  }, [currSubCatalog, store, searchValue, history, selectNode])

  if (!store?.isBrowserVisible || !isPosLatest) return <></>
  return (
    <BrowserWrapper
      ref={ref}
      className={classNames.nodeBrowser}
      style={{
        left: pos.x,
        top: pos.y,
      }}
      onMouseDown={stopEvent}
    >
      <NodeSearchField
        ref={inputRef as RefObject<HTMLInputElement>}
        className={classNames.browserSearch}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
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
})
