import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Image, useWindowDimensions, View, ViewStyle } from 'react-native'

import { Screen, Text } from '@/components/ignite'
import { useStores } from '@/db/helpers/useStores'
import { Exercise } from '@/db/models'
import { translate } from '@/i18n'
import { AppStackScreenProps, useRouteParams } from '@/navigators'
import { exerciseImages } from '@/utils/exerciseImages'
import { fontSize, spacing } from 'designSystem'

export interface ExerciseDetailsScreenProps
  extends AppStackScreenProps<'ExerciseDetails'> {
  exercise: Exercise
}

export const ExerciseDetailsScreen: FC<ExerciseDetailsScreenProps> = observer(
  function ExerciseDetailsScreen(props) {
    const { exercise } = useRouteParams('ExerciseDetails')

    const { navStore } = useStores()
    if (!exercise) {
      navStore.goBack()
      return null
    }

    const { width } = useWindowDimensions()
    const imgHeight = (width / 16) * 9

    return (
      <Screen
        style={$root}
        preset="scroll"
        // safeAreaEdges={['top', 'bottom', 'left', 'right']}
      >
        <Image
          style={{ width, height: imgHeight }}
          source={exerciseImages[exercise.images[0]]}
        />

        {!!exercise.instructions?.length && (
          <View
            style={{
              gap: spacing.md,
              padding: spacing.xs,
            }}
          >
            <Text style={{ fontSize: fontSize.lg }}>
              {translate('instructions')}
            </Text>

            <View style={{ gap: spacing.xs }}>
              {exercise.instructions.map(p => (
                <Text
                  style={{ fontSize: fontSize.sm }}
                  key={p}
                >
                  {p}
                </Text>
              ))}
            </View>
          </View>
        )}

        {!!exercise.tips?.length && (
          <View
            style={{
              gap: spacing.md,
              padding: spacing.xs,
              marginTop: spacing.lg,
            }}
          >
            <Text style={{ fontSize: fontSize.lg }}>{translate('tips')}</Text>

            <View style={{ gap: spacing.xs }}>
              {exercise.tips.map(p => (
                <Text
                  style={{ fontSize: fontSize.sm }}
                  key={p}
                >
                  {p}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Screen>
    )
  }
)

const $root: ViewStyle = {
  flex: 1,
}
