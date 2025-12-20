import React, { useCallback, useMemo, useState } from "react"
import { Dimensions, Image, Pressable, View } from "react-native"

import { useSetting } from "@/context/SettingContext"
import { useExercises, useMostUsedExercises, useSettings, useUpdateExercise } from "@/db/hooks"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import {
  EmptyState,
  fontSize,
  Icon,
  IconButton,
  palettes,
  Select,
  spacing,
  TabConfig,
  Text,
  TopNavigation,
  useColors,
} from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { translate } from "@/utils"
import { exerciseImages } from "@/utils/exerciseImages"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"
import { Searchbar } from "react-native-paper"
import { muscleAreas, muscles } from "@/constants/muscles"

const noop = () => {}

type ExerciseSelectListsProps = {
  multiselect: boolean
  selected: ExerciseModel[]
  onChange(exercises: ExerciseModel[]): void
}

const tabHeight = 48
const searchBarHeight = 48

export const ExerciseSelectLists: React.FC<ExerciseSelectListsProps> = ({
  multiselect,
  onChange,
  selected,
}) => {
  const [selectedExercises, setSelectedExercises] = useState<ExerciseModel[]>(selected)

  const { exerciseSelectLastTab, setExerciseSelectLastTab } = useSetting()

  const [filterString, setFilterString] = useState("")

  function toggleSelectedExercise(exercise: ExerciseModel) {
    if (!selectedExercises.includes(exercise)) {
      setSelectedExercises((oldVal) => {
        const newSelected = [...oldVal, exercise]
        onChange(newSelected) // TODO refactor

        return newSelected
      })
    } else {
      setSelectedExercises((oldVal) => {
        const newSelected = oldVal.filter((e) => e.id !== exercise.id)
        onChange(newSelected) // TODO refactor

        return newSelected
      })
    }
  }

  const props = useMemo(() => {
    return {
      onSelect: (exercise: ExerciseModel) => {
        multiselect ? toggleSelectedExercise(exercise) : setSelectedExercises([exercise])

        // TODO refactor
        !multiselect && onChange([exercise])
      },
      selectedExercises,
      filterString,
    }
  }, [filterString, selectedExercises])

  const tabsConfig: TabConfig[] = [
    {
      name: translate("favorite"),
      Component: () => <FavoriteExercisesList {...props} />,
    },
    {
      name: translate("mostUsed"),
      Component: () => <MostUsedExercisesList {...props} />,
    },
    {
      name: translate("allExercises"),
      Component: () => <AllExercisesList {...props} />,
    },
  ]

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          zIndex: 1,
          width: "100%",
        }}
      >
        <Searchbar
          placeholder={translate("search")}
          value={filterString}
          onChangeText={setFilterString}
          mode="view"
          defaultValue={filterString}
          style={{ height: searchBarHeight }}
          inputStyle={{ minHeight: searchBarHeight }}
        />
      </View>

      <TopNavigation
        initialRouteName={exerciseSelectLastTab || "All Exercises"}
        tabsConfig={tabsConfig}
        tabWidth={Dimensions.get("screen").width / tabsConfig.length}
        tabHeight={tabHeight}
        onTabChange={(tab) => setExerciseSelectLastTab(tab)}
      />
    </View>
  )
}

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
      keyExtractor={(exercise) => exercise.id!.toString()}
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
  const { mutate: updateExercise } = useUpdateExercise()

  function handleLongPress() {
    navigate("ExerciseDetails", { exerciseId: exercise.id! })
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

        <View style={{ flex: 1 }}>
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
          onPress={() =>
            updateExercise({ id: exercise.id!, updates: { isFavorite: !exercise.isFavorite } })
          }
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
const AllExercisesList: React.FC<AllExercisesListProps> = ({
  onSelect,
  selectedExercises,
  filterString,
}) => {
  const [muscleArea, setMuscleArea] = useState<string | undefined>()
  const [muscle, setMuscle] = useState<string | undefined>()
  const filters = useMemo(() => 
    ({ muscleArea, muscle, search: filterString }), 
    [muscleArea, muscle, filterString]
  )
  const { data: rawExercises } = useExercises(filters)
  const { data: settings } = useSettings()

  const exercises = useMemo(
    () => (rawExercises ? rawExercises.map((item) => new ExerciseModel(item)) : []),
    [rawExercises],
  )

  const muscleItems = settings?.scientific_muscle_names_enabled ? muscles : muscleAreas
  return (
    <>
      <View style={{ flexDirection: "row", gap: spacing.xxs, padding: spacing.xs }}>
        <Select
          label={translate("muscle")}
          value={settings?.scientific_muscle_names_enabled ? muscle : muscleArea}
          onChange={settings?.scientific_muscle_names_enabled ? setMuscle : setMuscleArea}
          options={muscleItems.map((muscleArea) => ({ label: muscleArea, value: muscleArea }))}
          containerStyle={{ flex: 1 }}
          clearable
        />
      </View>
      <ExerciseList
        exercises={exercises}
        onSelect={onSelect ?? noop}
        selectedExercises={selectedExercises}
      />
    </>
  )
}

type FavoriteExercisesListProps = {
  onSelect: (exercise: ExerciseModel) => void
  selectedExercises: ExerciseModel[]
  filterString: string
}
const FavoriteExercisesList: React.FC<FavoriteExercisesListProps> = ({
  onSelect,
  selectedExercises,
  filterString,
}) => {
  const [muscleArea, setMuscleArea] = useState<string | undefined>()
  const [muscle, setMuscle] = useState<string | undefined>()
  const filters = useMemo(() => 
    ({ isFavorite: true, muscleArea, muscle, search: filterString }), 
    [muscleArea, muscle, filterString]
  )
  const { data: rawExercises } = useExercises(filters)
  const { data: settings } = useSettings()

  const exercises = useMemo(
    () => (rawExercises ? rawExercises.map((item) => new ExerciseModel(item)) : []),
    [rawExercises],
  )

  if (exercises.length === 0) {
    return <EmptyState text={translate("noFavoriteExercises")} />
  }
  
  const muscleItems = settings?.scientific_muscle_names_enabled ? muscles : muscleAreas
  return (
    <>
      <View style={{ flexDirection: "row", gap: spacing.xxs }}>
        <Select
          label={translate("muscle")}
          value={settings?.scientific_muscle_names_enabled ? muscle : muscleArea}
          onChange={settings?.scientific_muscle_names_enabled ? setMuscle : setMuscleArea}
          options={muscleItems.map((muscleArea) => ({ label: muscleArea, value: muscleArea }))}
          containerStyle={{ flex: 1 }}
          clearable
        />
      </View>
      <ExerciseList
        exercises={exercises}
        onSelect={onSelect}
        selectedExercises={selectedExercises}
      />  
    </>
  )
}
type MostUsedExercisesListProps = {
  onSelect: (exercise: ExerciseModel) => void
  selectedExercises: ExerciseModel[]
  filterString: string
}
const MostUsedExercisesList: React.FC<MostUsedExercisesListProps> = ({
  onSelect,
  selectedExercises,
  filterString,
}) => {
  const [count, setCount] = useState(10)
  const [muscleArea, setMuscleArea] = useState<string | undefined>()
  const [muscle, setMuscle] = useState<string | undefined>()
  const { data: settings } = useSettings()
  const filter = useMemo(() => 
    ({ muscleArea, muscle, search: filterString }), 
    [muscleArea, muscle, filterString]
  )
  const { data: rawExercises } = useMostUsedExercises(count, filter)

  const exercises = useMemo(
    () => (rawExercises ?? []).map((item) => new ExerciseModel(item)),
    [rawExercises],
  )

  if (exercises.length === 0) {
    return <EmptyState text={translate("noWorkoutsEntered")} />
  }

  const muscleItems = settings?.scientific_muscle_names_enabled ? muscles : muscleAreas
  return (
    <>
      <View style={{ flexDirection: "row", gap: spacing.xxs }}>
        <Select
          label={translate("top")}
          value={count}
          onChange={(value) => setCount(value!)}
          options={[
            { label: "10", value: 10 },
            { label: "20", value: 20 },
            { label: "30", value: 30 },
          ]}
          containerStyle={{ flex: 1 }}
        />
        <Select
          label={translate("muscle")}
          value={settings?.scientific_muscle_names_enabled ? muscle : muscleArea}
          onChange={settings?.scientific_muscle_names_enabled ? setMuscle : setMuscleArea}
          options={muscleItems.map((muscleArea) => ({ label: muscleArea, value: muscleArea }))}
          containerStyle={{ flex: 1 }}
          clearable
        />
      </View>
      <ExerciseList
        exercises={exercises}
        onSelect={onSelect}
        selectedExercises={selectedExercises}
      />
    </>
  )
}
