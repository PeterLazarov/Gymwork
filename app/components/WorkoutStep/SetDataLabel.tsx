import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'

import { Text, useColors, fontSize as fontSizeToken } from 'designSystem'

type Props = {
  value?: string | number
  unit?: string
  isFocused?: boolean
  fontSize?: keyof typeof fontSizeToken
  fixDecimals?: boolean
}

const SetDataLabel: React.FC<Props> = ({
  value,
  unit,
  isFocused,
  fontSize,
  fixDecimals,
}) => {
  const colors = useColors()
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
      gap: 4,
      justifyContent: 'center',
    },
    value: {
      fontWeight: 'bold',
      color: isFocused ? colors.tertiary : colors.onSurface,
      fontSize: fontSize ? fontSizeToken[fontSize] : fontSizeToken.xs,
    },
    unit: {
      color: isFocused ? colors.tertiary : colors.onSurface,
      fontSize: fontSize ? fontSizeToken[fontSize] : fontSizeToken.xs,
    },
  })

export default observer(SetDataLabel)
