// Basically allows for an uncontrolled menu
// A performance optimization

import { useState } from 'react'

export type MenuContainerProps = [boolean, (setVisible: boolean) => void]

const MenuContainer: React.FC<{
  children(props: MenuContainerProps): JSX.Element
}> = props => {
  const visibilityState = useState(false)

  return props.children(visibilityState)
}

export default MenuContainer
