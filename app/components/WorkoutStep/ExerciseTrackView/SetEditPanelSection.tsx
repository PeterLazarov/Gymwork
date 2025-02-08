import React, { ReactNode } from 'react'
import { View } from 'react-native'

import { Text, Divider, fontSize, spacing } from 'designSystem'

export type SetEditPanelSectionProps = {
  text: string
  children: ReactNode
}

const SetEditPanelSection: React.FC<SetEditPanelSectionProps> = ({
  text,
  children,
}) => {
  return (
    <View style={{ gap: spacing.xxs }}>
      <View>
        <Text
          style={{
            fontSize: fontSize.xs,
            textTransform: 'uppercase',
            marginVertical: spacing.xxs,
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
