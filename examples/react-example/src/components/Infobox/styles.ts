import styled from "@emotion/styled"

export const AboutLink = styled.a`
  font-style: italic;
  color: rgba(253, 126, 20, 1);
`

const backgroundBlur = 1.5

export const InfoBoxWrapper = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 20;
`

export const InfoBoxContent = styled.div`
  max-width: 35vw;
  min-width: 300px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(${backgroundBlur}px);
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  justify-content: space-between;
  p {
    line-height: 1.5rem;
  }
`

export const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

interface PageButtonProps {
  placement: "left" | "right"
}

export const PageButton = styled.div<PageButtonProps>`
  cursor: pointer;
  border-radius: 50%;
  :hover {
    color: rgba(253, 126, 20, 1);
  }
`

export const InfoButton = styled.div`
  cursor: pointer;
  border-radius: 50%;
  background-color: #212529;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  :hover {
    color: rgba(253, 126, 20, 1);
  }
`
