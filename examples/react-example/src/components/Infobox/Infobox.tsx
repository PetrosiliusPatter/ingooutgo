import { Kbd } from "@mantine/core"
import * as React from "react"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { ArrowNarrowLeft, ArrowNarrowRight, Check, InfoCircle } from "tabler-icons-react"

import {
  AboutLink,
  ButtonRow,
  InfoBoxContent,
  InfoBoxWrapper,
  InfoButton,
  PageButton,
} from "./styles"

const InfoTest = [
  [
    <span>
      <b>IngoOutgo!</b>
    </span>,
    <span>A WIP node editor by PetrosiliusPatter</span>,
  ],
  [
    <span>
      You can browse for existing nodes by pressing <Kbd>A</Kbd>.
    </span>,
    <span>
      You can create connections between nodes by dragging from one socket to another.
    </span>,
    <span>
      If the sockets are compatible, the connection will snap into place, and you can let
      go.
    </span>,
  ],
  [
    <span>You can select nodes and connections by clicking on them.</span>,
    <span>
      By pressing <Kbd>Shift</Kbd> while clicking, you can add to your connection.
    </span>,
    <span>
      You can also select multiple nodes or connections by dragging a selection box around
      them.
    </span>,
    <span>Clicking anywhere else will deselect everything.</span>,
  ],
  [<span>Dragging one of your selected nodes will drag your whole selection</span>],
  [
    <span>
      To delete the selection, simply press <Kbd>DEL</Kbd>.
    </span>,
    <span>I have not implemented an "Undo" feature yet.. Changes are permanent!</span>,
    <span>
      Instead, there's an experimental toolbar for saving and loading your node graphs.
    </span>,
  ],
  [
    <span>I hope you enjoy this demo!</span>,
    <p>
      Feel free to head over to my{" "}
      <AboutLink href="https://github.com/PetrosiliusPatter/ingooutgo">
        GitHub page
      </AboutLink>{" "}
      to read more about the project.
    </p>,
  ],
]

export type BoxStatus = "open" | "dismissed" | "hidden"
interface InfoBoxProps {
  pages?: ReactNode[][]
  startHidden?: boolean
  onDismiss?: () => void
}

export const InfoBox = ({ pages = InfoTest, startHidden, onDismiss }: InfoBoxProps) => {
  const [status, setStatus] = useState<BoxStatus>(startHidden ? "hidden" : "open")

  useEffect(() => {
    if (pages.length === 0) {
      setStatus("dismissed")
    }
  }, [pages.length])

  const [currPage, setCurrPage] = useState(0)

  const currMessages = useMemo(
    () => (pages.length === 0 ? [] : pages[currPage]),
    [currPage, pages]
  )

  const incPage = useCallback(() => {
    if (currPage === pages.length - 1) {
      setStatus("dismissed")
      onDismiss?.()
      return
    }
    setCurrPage(currPage + 1)
  }, [currPage, onDismiss, pages.length])

  const decPage = () => setCurrPage((curr) => curr - 1)

  const prevButton = useMemo(() => {
    if (currPage === 0) return <div />
    return (
      <PageButton placement="left" onClick={decPage}>
        <ArrowNarrowLeft />
      </PageButton>
    )
  }, [currPage])

  const nextButton = useMemo(() => {
    return (
      <PageButton placement="right" onClick={incPage}>
        {currPage === pages.length - 1 ? <Check /> : <ArrowNarrowRight />}
      </PageButton>
    )
  }, [currPage, incPage, pages.length])

  return (
    <InfoBoxWrapper>
      {" "}
      {status === "open" ? (
        <InfoBoxContent>
          {currMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
          {(prevButton || nextButton) && (
            <ButtonRow>
              {prevButton}
              {nextButton}
            </ButtonRow>
          )}
        </InfoBoxContent>
      ) : status === "hidden" ? (
        <InfoButton>
          <InfoCircle onClick={() => setStatus("open")} />
        </InfoButton>
      ) : (
        <></>
      )}
    </InfoBoxWrapper>
  )
}
