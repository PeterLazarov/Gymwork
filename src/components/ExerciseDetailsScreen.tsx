import { FC, useEffect, useState } from "react"
import { Image, useWindowDimensions, View, StyleSheet } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { fontSize, Header, Icon, IconButton, spacing, Text, useColors } from "@/designSystem"
import { Exercise } from "@/db/schema"
import { useExerciseQuery } from "@/db/queries/useExerciseQuery"
import { AppStackScreenProps, useRouteParams } from "@/navigators/navigationTypes"
import { BaseLayout } from "@/layouts/BaseLayout"
import { translate } from "@/utils"
import { exerciseImages } from "@/utils/exerciseImages"

export type ExerciseDetailsScreenParams = {
  exerciseId: Exercise["id"]
}
interface ExerciseDetailsScreenProps extends AppStackScreenProps<"ExerciseDetails"> {}

export const ExerciseDetailsScreen: FC<ExerciseDetailsScreenProps> = ({ navigation }) => {
  const { exerciseId } = useRouteParams("ExerciseDetails")
  const [exercise, setExercise] = useState<Exercise>()
  const exerciseQuery = useExerciseQuery()

  useEffect(() => {
    exerciseQuery(exerciseId).then((result) => {
      if (result) {
        setExercise(result)
      }
    })
  }, [])

  const colors = useColors()
  const { width } = useWindowDimensions()
  const imgHeight = (width / 16) * 9

  const imageUri = exercise?.images?.[0]

  function onBackPress() {
    navigation.goBack()
  }
  return (
    <BaseLayout>
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
        <Header.Title title={translate("exerciseDetails")} />
      </Header>
      <Image
        style={{ width, height: imgHeight }}
        source={imageUri ? exerciseImages[imageUri] : undefined}
      />

      <ScrollView style={styles.container}>
        {!!exercise?.instructions?.length && (
          <View
            style={{
              gap: spacing.md,
              padding: spacing.xs,
            }}
          >
            <Text style={styles.label}>{translate("instructions")}</Text>

            <View style={styles.panel}>
              {exercise.instructions.map((p) => (
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

        {!!exercise?.tips?.length && (
          <View
            style={{
              gap: spacing.md,
              padding: spacing.xs,
            }}
          >
            <Text style={styles.label}>{translate("tips")}</Text>

            <View style={styles.panel}>
              {exercise.tips.map((p) => (
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
    </BaseLayout>
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
