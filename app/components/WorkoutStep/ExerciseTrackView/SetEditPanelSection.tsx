import React, { ReactNode } from 'react'
import { View, Text } from 'react-native'

import { Divider, fontSize, useColors } from 'designSystem'

type Props = {
  text: string
  children: ReactNode
}

const SetEditPanelSection: React.FC<Props> = ({ text, children }) => {
  const colors = useColors()

  return (
    <View style={{ gap: 10 }}>
      <View>
        <Text
          style={{
            fontSize: fontSize.xs,
            textTransform: 'uppercase',
            marginVertical: 4,
            color: colors.neutralText,
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
