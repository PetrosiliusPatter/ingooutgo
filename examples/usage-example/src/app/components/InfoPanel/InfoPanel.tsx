import {Checkbox, Collapse, Kbd} from '@mantine/core'
import {IconBrandGithub, IconCaretDown, IconCaretUp} from '@tabler/icons-react'
import {FC, PropsWithChildren, useState} from 'react'
import {
  CollapseContainer,
  HelpPanelWrapper,
  CollapseTitle,
  CollapseTitleWrapper,
  StyledLink,
} from './styles'

type InfoProps = PropsWithChildren<{
  title?: string
  initialOpen?: boolean
  alwaysOpen?: boolean
}>

const InfoSection: FC<InfoProps> = ({
  title,
  children,
  initialOpen,
  alwaysOpen,
}) => {
  const [isOpen, setIsOpen] = useState(alwaysOpen ?? initialOpen ?? false)

  return (
    <>
      <CollapseTitleWrapper>
        <CollapseTitle>{title}</CollapseTitle>
        {!alwaysOpen &&
          (isOpen ? (
            <IconCaretUp onClick={() => setIsOpen(false)} />
          ) : (
            <IconCaretDown onClick={() => setIsOpen(true)} />
          ))}
      </CollapseTitleWrapper>
      <Collapse in={isOpen}>
        <CollapseContainer>{children}</CollapseContainer>
      </Collapse>
    </>
  )
}

type SettingsCallbacks = {
  customConnection: boolean
  setCustomConnection: (value: boolean) => void
  customTheme: boolean
  setCustomTheme: (value: boolean) => void
}

export const InfoPanel: FC<SettingsCallbacks> = ({
  customConnection,
  setCustomConnection,
  customTheme,
  setCustomTheme,
}) => {
  return (
    <HelpPanelWrapper>
      <InfoSection title='Info' alwaysOpen>
        <span>
          <StyledLink
            href='https://github.com/PetrosiliusPatter/ingooutgo'
            target='_blank'
          >
            <IconBrandGithub />
            Github
          </StyledLink>
        </span>
      </InfoSection>
      <InfoSection title='Help' initialOpen>
        <div>
          <Kbd>A</Kbd> to open the Node Browser
        </div>
        <div>
          <Kbd>Strg</Kbd> + <Kbd>C</Kbd> to copy Nodes
        </div>
        <div>
          <Kbd>Strg</Kbd> + <Kbd>V</Kbd> to paste Nodes
        </div>
        <div>Drag to connect Sockets</div>
      </InfoSection>
      <InfoSection title='Settings' initialOpen>
        <div>
          <Checkbox
            checked={customConnection}
            onChange={(e) => setCustomConnection(e.target.checked)}
            label='Use custom Connection rendering'
          />
        </div>
        <div>
          <Checkbox
            checked={customTheme}
            onChange={(e) => {
              console.log(e.target.checked)
              setCustomTheme(e.target.checked)
            }}
            label='Use custom theme (looks bad lol)'
          />
        </div>
      </InfoSection>
    </HelpPanelWrapper>
  )
}
