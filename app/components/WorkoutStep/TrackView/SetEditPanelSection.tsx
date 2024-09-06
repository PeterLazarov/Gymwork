import React, { ReactNode } from 'react'
import { View, Text } from 'react-native'

import { Divider, fontSize } from 'designSystem'

type Props = {
  text: string
  children: ReactNode
}

const SetEditPanelSection: React.FC<Props> = ({ text, children }) => {
  return (
    <View style={{ gap: 16 }}>
      <View>
        <Text
          style={{
            fontSize: fontSize.xs,
            textTransform: 'uppercase',
          }}
        >
          {text}
        </Text>
        <Divider
          orientation="horizontal"
          variant="primary"
        />
      </View>
      {children}
    </View>
  )
}

export default SetEditPanelSection
