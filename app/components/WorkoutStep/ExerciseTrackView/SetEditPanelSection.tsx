import React, { ReactNode } from 'react'
import { View, Text } from 'react-native'

import { Divider, fontSize } from 'designSystem'

type Props = {
  text: string
  children: ReactNode
}

const SetEditPanelSection: React.FC<Props> = ({ text, children }) => {
  return (
    <View style={{ gap: 12 }}>
      <View>
        <Text
          style={{
            fontSize: fontSize.xs,
            textTransform: 'uppercase',
            marginVertical: 4,
          }}
        >
          {text}
        </Text>
        <Divider
          orientation="horizontal"
          variant="neutral"
        />
      </View>
      {children}
    </View>
  )
}

export default SetEditPanelSection
