import { useCallback, useEffect, useState } from "react"
import { Image, Pressable, View } from "react-native"

import { ExerciseModel } from "@/db/models/ExerciseModel"
import { useExercisesQuery, useMostUsedExercisesQuery } from "@/db/queries/useExercisesQuery"
import { useUpdateExerciseQuery } from "@/db/queries/useUpdateExerciseQuery"
import {
  EmptyState,
  fontSize,
  Icon,
  IconButton,
  palettes,
  spacing,
  Text,
  useColors,
} from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { translate } from "@/utils"
import { exerciseImages } from "@/utils/exerciseImages"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"

const noop = () => {}

type ExerciseListProps = {
  exercises: ExerciseModel[]
  onSelect: (exercise: ExerciseModel) => void
  selectedExercises: ExerciseModel[]
}

const itemHeight = 64

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onSelect, selectedExercises }) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ExerciseModel>) => {
      return (
        <ExerciseListItem
          exercise={item}
          onSelect={onSelect}
          isSelected={selectedExercises.includes(item)}
          height={itemHeight}
        />
      )
    },
    [selectedExercises],
  )

  return (
    <FlashList
      data={exercises}
      renderItem={renderItem}
      keyExtractor={(exercise) => exercise.id.toString()}
    />
  )
}

type ExerciseListItemProps = {
  exercise: ExerciseModel
  onSelect: (exercise: ExerciseModel) => void
  isSelected: boolean
  height: number
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exercise,
  onSelect,
  isSelected,
  height,
}) => {
  const heartIcon = exercise.isFavorite ? "heart" : "heart-outlined"
  const colors = useColors()
  const updateExercise = useUpdateExerciseQuery()

  function handleLongPress() {
    navigate("ExerciseDetails", { exerciseId: exercise.id })
  }

  const imageUri = exercise.images?.[0]

  return (
    <Pressable
      onPress={() => onSelect(exercise)}
      onLongPress={handleLongPress}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing.xxs,
          gap: spacing.xxs,
          height,
          backgroundColor: isSelected ? colors.secondary : "transparent",
        }}
      >
        <Image
          width={height}
          height={height}
          style={{ height, width: height }}
          source={imageUri ? exerciseImages[imageUri] : undefined}
        />

        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              flexWrap: "wrap",
              color: isSelected ? colors.onSecondary : colors.onSurface,
            }}
            numberOfLines={1}
          >
            {exercise.name}
          </Text>
          <Text
            style={{
              // flex: 1,
              flexWrap: "wrap",
              fontSize: fontSize.xs,
              color: colors.onSurfaceVariant,
            }}
            numberOfLines={1}
          >
            {exercise.muscleAreas.join(", ")}
          </Text>
        </View>

        <IconButton
          onPress={() => {
            updateExercise(exercise.id, { is_favorite: !exercise.isFavorite })
          }}
        >
          <Icon
            icon={heartIcon}
            color={palettes.error["60"]}
          />
        </IconButton>
      </View>
    </Pressable>
  )
}

type AllExercisesListProps = {
  onSelect: (exercise: ExerciseModel) => void
  selectedExercises: ExerciseModel[]
  filterString: string
}
export const AllExercisesList: React.FC<AllExercisesListProps> = ({
  onSelect,
  selectedExercises,
  filterString,
}) => {
  const exercisesQuery = useExercisesQuery()

  const [exercises, setExercises] = useState<ExerciseModel[]>([])

  useEffect(() => {
    exercisesQuery({ filterString }).then((result) => {
      const items = result.map((item) => new ExerciseModel(item))
      setExercises(items)
    })
  }, [filterString])

  return (
    <>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <ExerciseList
          exercises={exercises}
          onSelect={onSelect ?? noop}
          selectedExercises={selectedExercises}
        />
      </View>
    </>
  )
}

type FavoriteExercisesListProps = {
  onSelect: (exercise: ExerciseModel) => void
  selectedExercises: ExerciseModel[]
  filterString: string
}
export const FavoriteExercisesList: React.FC<FavoriteExercisesListProps> = ({
  onSelect,
  selectedExercises,
  filterString,
}) => {
  const exercisesQuery = useExercisesQuery()

  const [exercises, setExercises] = useState<ExerciseModel[]>([])

  useEffect(() => {
    exercisesQuery({ isFavorite: true, filterString }).then((result) => {
      const items = result.map((item) => new ExerciseModel(item))
      setExercises(items)
    })
  }, [filterString])

  return (
    <>
      {exercises.length > 0 ? (
        <ExerciseList
          exercises={exercises}
          onSelect={onSelect}
          selectedExercises={selectedExercises}
        />
      ) : (
        <EmptyState text={translate("noFavoriteExercises")} />
      )}
    </>
  )
}
type MostUsedExercisesListProps = {
  onSelect: (exercise: ExerciseModel) => void
  selectedExercises: ExerciseModel[]
  filterString: string
}
export const MostUsedExercisesList: React.FC<MostUsedExercisesListProps> = ({
  onSelect,
  selectedExercises,
  filterString,
}) => {
  const mostUsedExercises = useMostUsedExercisesQuery()

  const [exercises, setExercises] = useState<ExerciseModel[]>([])

  useEffect(() => {
    mostUsedExercises({ limit: 10, filterString }).then((result) => {
      const items = result.map((item) => new ExerciseModel(item))
      setExercises(items)
    })
  }, [filterString])

  return (
    <>
      {exercises.length > 0 ? (
        <ExerciseList
          exercises={exercises}
          onSelect={onSelect}
          selectedExercises={selectedExercises}
        />
      ) : (
        <EmptyState text={translate("noWorkoutsEntered")} />
      )}
    </>
  )
}
