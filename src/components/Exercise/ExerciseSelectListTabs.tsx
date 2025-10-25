import React, { useMemo, useState } from "react"
import { Dimensions, View } from "react-native"

import { TopNavigation, TabConfig } from "@/designSystem"
import { useStores } from "app/db/helpers/useStores"
import { Searchbar } from "react-native-paper"
import { translate } from "@/utils"
import { AllExercisesList, FavoriteExercisesList, MostUsedExercisesList } from "./ExerciseLists"
import { ExerciseModel } from "@/db/models/ExerciseModel"

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

  const { navStore } = useStores()

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
  }, [filterString])

  const tabsConfig: TabConfig[] = [
    {
      name: translate("favorite"),
      Component: () => (
        <View style={{ marginTop: searchBarHeight, flex: 1 }}>
          <FavoriteExercisesList {...props} />
        </View>
      ),
    },
    {
      name: translate("mostUsed"),
      Component: () => (
        <View style={{ marginTop: searchBarHeight, flex: 1 }}>
          <MostUsedExercisesList {...props} />
        </View>
      ),
    },
    {
      name: translate("allExercises"),
      Component: () => (
        <View style={{ marginTop: searchBarHeight, flex: 1 }}>
          <AllExercisesList {...props} />
        </View>
      ),
    },
  ]

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          top: tabHeight,
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
        initialRouteName={navStore.exerciseSelectLastTab || "Favorite"}
        tabsConfig={tabsConfig}
        tabWidth={Dimensions.get("screen").width / tabsConfig.length}
        tabHeight={tabHeight}
        onTabChange={(tab) => {
          navStore.setProp("exerciseSelectLastTab", tab)
        }}
      />
    </View>
  )
}
