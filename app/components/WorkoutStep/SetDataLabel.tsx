import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { Text, fontSize as fontSizeToken, spacing } from 'designSystem'

export type SetDataLabelProps = {
  value?: string | number
  unit?: string
  isFocused?: boolean
  fontSize?: keyof typeof fontSizeToken
  fixDecimals?: boolean
}

const SetDataLabel: React.FC<SetDataLabelProps> = ({
  value,
  unit,
  isFocused,
  fontSize,
  fixDecimals,
}) => {
  const {
    theme: { colors },
  } = useAppTheme()
  const styles = useMemo(
    () => makeStyles(colors, isFocused, fontSize),
    [colors, isFocused, fontSize]
  )

  return (
    <View style={styles.container}>
      <Text style={styles.value}>
        {typeof value === 'number' && fixDecimals ? value.toFixed(2) : value}
      </Text>
      {unit && <Text style={styles.unit}>{unit}</Text>}
    </View>
  )
}

const makeStyles = (
  colors: any,
  isFocused?: boolean,
  fontSize?: keyof typeof fontSizeToken
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing.xxs,
      justifyContent: 'center',
    },
    unit: {
      color: isFocused ? colors.tertiary : colors.onSurface,
      fontSize: fontSize ? fontSizeToken[fontSize] : fontSizeToken.xs,
    },
    value: {
      color: isFocused ? colors.tertiary : colors.onSurface,
      fontSize: fontSize ? fontSizeToken[fontSize] : fontSizeToken.xs,
      fontWeight: 'bold',
    },
  })

export default observer(SetDataLabel)
