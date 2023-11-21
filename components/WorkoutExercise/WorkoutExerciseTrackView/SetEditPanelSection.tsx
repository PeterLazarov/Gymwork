import React, { ReactNode } from 'react'
import { View } from 'react-native'

import { Divider } from '../../../designSystem'
import { SubSectionLabel } from '../../../designSystem/Label'

type Props = {
  text: string
  children: ReactNode
}

const SetEditPanelSection: React.FC<Props> = ({ text, children }) => {
  return (
    <View style={{ gap: 16 }}>
      <View>
        <SubSectionLabel style={{ textTransform: 'uppercase' }}>
          {text}
        </SubSectionLabel>
        <Divider />
      </View>
      {children}
    </View>
  )
}

export default SetEditPanelSection
