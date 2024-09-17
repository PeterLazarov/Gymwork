import { observer } from 'mobx-react-lite'
import React from 'react'

import {
  Text,
  Icon,
  PressableHighlight,
  useColors,
  fontSize,
} from 'designSystem'

type Props = {
  isWarmup: boolean
  number?: number
  color: string
  toggleSetWarmup: () => void
}
const SetWarmupButton: React.FC<Props> = ({
  isWarmup,
  number,
  color,
  toggleSetWarmup,
}) => {
  const colors = useColors()

  return (
    <PressableHighlight
      style={{
        height: 36,
        width: 36,
        borderColor: colors.neutralDarker,
        borderWidth: 1,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={toggleSetWarmup}
    >
      <>
        {!isWarmup && (
          <Text
            style={{
              fontSize: fontSize.sm,
              color,
              fontWeight: 'bold',
            }}
          >
            {number}
          </Text>
        )}
        {isWarmup && (
          <Icon
            icon="yoga"
            color={color}
          />
        )}
      </>
    </PressableHighlight>
  )
}
export default observer(SetWarmupButton)
