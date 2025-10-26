import React, { useMemo, useState } from "react"
import { Dimensions, View } from "react-native"

import { useSetting } from "@/context/SettingContext"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { TabConfig, TopNavigation } from "@/designSystem"
import { translate } from "@/utils"
import { Searchbar } from "react-native-paper"
import { AllExercisesList, FavoriteExercisesList, MostUsedExercisesList } from "./ExerciseLists"

type ExerciseSelectListsProps = {
  multiselect: boolean
  selected: ExerciseModel[]
  onChange(exercises: ExerciseModel[]): void
}

const tabHeight = 48
const searchBarHeight = 72

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
