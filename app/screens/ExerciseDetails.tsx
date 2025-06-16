import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Image, useWindowDimensions, View, StyleSheet } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { translate } from 'app/i18n'
import { exerciseImages } from 'app/utils/exerciseImages'
import {
  fontSize,
  Header,
  Icon,
  IconButton,
  spacing,
  Text,
  useColors,
} from 'designSystem'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { useRouteParams } from 'app/navigators'
import { ScrollView } from 'react-native-gesture-handler'

export type ExerciseDetailsScreenParams = {
  exerciseId: Exercise['guid']
}

const ExerciseDetailsScreen: FC = () => {
  const { exerciseId } = useRouteParams('ExerciseDetails')
  const {
    exerciseStore,
    navStore: { navigate, goBack },
  } = useStores()
  const exercise = exerciseStore.exercisesMap[exerciseId]
  // TODO make these general?
  // Make route params stringifyable, but computed, and then verified?
  if (!exercise) {
    navigate('Workout')
    return null
  }

  const colors = useColors()
  const { width } = useWindowDimensions()
  const imgHeight = (width / 16) * 9

  const imageUri = exercise.images?.[0]

  function onBackPress() {
    goBack()
  }
  return (
    <EmptyLayout>
      <Header style={{ paddingTop: spacing.sm }}>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title title={translate('exerciseDetails')} />
      </Header>
      <Image
        style={{ width, height: imgHeight }}
        source={imageUri ? exerciseImages[imageUri] : undefined}
      />

      <ScrollView style={styles.container}>
        {!!exercise.instructions?.length && (
          <View
            style={{
              gap: spacing.md,
              padding: spacing.xs,
            }}
          >
            <Text style={styles.label}>{translate('instructions')}</Text>

            <View style={styles.panel}>
              {exercise.instructions.map(p => (
                <Text
                  style={styles.text}
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
            }}
          >
            <Text style={styles.label}>{translate('tips')}</Text>

            <View style={styles.panel}>
              {exercise.tips.map(p => (
                <Text
                  style={styles.text}
                  key={p}
                >
                  {p}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </EmptyLayout>
  )
}
const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  label: { fontSize: fontSize.lg },
  panel: { gap: spacing.xs },
  text: { fontSize: fontSize.sm },
})

export default observer(ExerciseDetailsScreen)
