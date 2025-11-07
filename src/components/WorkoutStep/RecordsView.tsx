import { useMemo } from "react"
import { Pressable, ScrollView, StyleSheet, View } from "react-native"

import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { SetModel } from "@/db/models/SetModel"
import { useExerciseRecordsQuery } from "@/db/queries/useExerciseRecordsQuery"
import { EmptyState, spacing } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { msToIsoDate, translate } from "@/utils"
import { SetDataLabel } from "./components/SetDataLabel"

type RecordsViewProps = {
  exercise: ExerciseModel
}

export const RecordsView: React.FC<RecordsViewProps> = ({ exercise }) => {
  const { setOpenedDate } = useOpenedWorkout()

  const { records: rawRecords } = useExerciseRecordsQuery(exercise.id!)

  const records = useMemo(() => rawRecords.map((item) => new SetModel(item)), [rawRecords])

  function goToDate(set: SetModel) {
    setOpenedDate(msToIsoDate(set.date))

    navigate("Workout")
  }

  return (
    <View style={styles.screen}>
      {records.length > 0 ? (
        <ScrollView style={styles.list}>
          {records.map((set) => {
            return (
              <ListItem
                key={set.id}
                set={set}
                onPress={() => goToDate(set)}
              />
            )
          })}
        </ScrollView>
      ) : (
        <EmptyState text={translate("recordsLogEmpty")} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    marginTop: spacing.md,
    display: "flex",
    flexGrow: 1,
  },
  list: {
    flexBasis: 0,
  },
})

type ListItemProps = {
  set: SetModel
  onPress: () => void
}

const ListItem: React.FC<ListItemProps> = ({ set, onPress }) => {
  const styles = useMemo(() => makeListItemStyles(set.isWeakAssRecord), [set.isWeakAssRecord])

  const groupingMeasurement = set.exercise.groupingMeasurement
  const valueMeasurement = set.exercise.valueMeasurement

  return (
    <Pressable
      onPress={onPress}
      style={styles.item}
    >
      <>
        {groupingMeasurement && (
          <SetDataLabel
            value={set.groupingValue!}
            unit={groupingMeasurement.unit}
            fontSize="md"
          />
        )}

        {valueMeasurement && (
          <SetDataLabel
            value={set.measuredValue!}
            unit={valueMeasurement.unit}
            fontSize="md"
          />
        )}
      </>
    </Pressable>
  )
}

const makeListItemStyles = (isWeakAss: boolean) =>
  StyleSheet.create({
    item: {
      display: "flex",
      flexDirection: "row",
      gap: spacing.md,
      justifyContent: "space-around",
      alignItems: "center",
      height: 40,
      flex: 1,
      opacity: isWeakAss ? 0.5 : 1,
    },
  })
