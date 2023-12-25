import styled from '@emotion/styled'
import {Collapse} from '@mantine/core'

export const HelpPanelWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  padding: 0.5rem;
  width: 20rem;
`

export const CollapseTitle = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: white;
`

export const CollapseTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid white;

  > svg {
    cursor: pointer;
  }
`

export const CollapseContainer = styled.div`
  padding: 0.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const StyledLink = styled.a`
  display: flex;
`
