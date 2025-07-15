import { ReactNode, useCallback, useMemo } from "react"
import { View, StyleSheet } from "react-native"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import type { SortableGridRenderItem } from "react-native-sortables"
import Sortable from "react-native-sortables"

import { SelectSet } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"
import { Text } from "../Ignite/Text"
import { rounding } from "@/theme/rounding"

const DATA = Array.from({ length: 12 }, (_, index) => `Item ${index + 1}`)

export interface SetGroup2Props {
  setGroupId: string
  editModeEnabled: boolean
  moveEnabled: boolean
  deleteEnabled: boolean
  selectEnabled: boolean
}

export function SetGroup2({
  setGroupId,
  deleteEnabled,
  editModeEnabled,
  moveEnabled,
  selectEnabled,
}: SetGroup2Props) {
  const {
    theme: { rounding, spacing },
  } = useAppTheme()

  const { drizzleDB } = useDB()

  const { data } = useLiveQuery(
    drizzleDB.query.set_groups.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, setGroupId)
      },
      with: {
        sets: {
          with: {
            exercise: {
              columns: {
                name: true,

                created_at: false,
                id: false,
                images: false,
                instructions: false,
                is_favorite: false,
                record_config_id: false,
                tips: false,
              },
              with: {
                exerciseMetrics: {
                  with: {
                    metric: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  )

  const renderItem = useCallback<SortableGridRenderItem<SelectSet>>(
    ({ item }) => (
      // row
      <View style={styles.card}>
        <Text style={[styles.cell, { width: 16, backgroundColor: "red" }]}>123</Text>
        <Text style={[styles.cell, { width: 48, backgroundColor: "blue" }]}>123</Text>
        <Text style={[styles.cell, { width: 32, backgroundColor: "red" }]}>123</Text>
        <Text style={[styles.cell, { width: 64, backgroundColor: "green" }]}>123</Text>
        <Text style={[styles.cell, { width: 32, backgroundColor: "red" }]}>123</Text>
        <Text style={[styles.cell, { width: 32, backgroundColor: "brown" }]}>123</Text>
      </View>
    ),
    [],
  )

  return (
    // TODO only display if sets >0
    <View>
      {/* heading */}
      <Text preset="formLabel">{data?.sets[0]?.exercise?.name}</Text>

      {/* thead */}
      <View style={styles.card}>
        <Text style={[styles.cell, { width: 16, backgroundColor: "red" }]}>Set #</Text>
        <Text style={[styles.cell, { width: 48, backgroundColor: "blue" }]}>Previous</Text>
        <Text style={[styles.cell, { width: 32, backgroundColor: "red" }]}>Reps</Text>
        <Text style={[styles.cell, { width: 64, backgroundColor: "green" }]}>Weight</Text>
        <Text style={[styles.cell, { width: 32, backgroundColor: "red" }]}>RPE</Text>
        <Text style={[styles.cell, { width: 32, backgroundColor: "brown" }]}>Done?</Text>
      </View>

      {/* tbody */}
      <Sortable.Grid
        columns={1}
        data={data?.sets ?? []}
        renderItem={renderItem}
        rowGap={0}
        columnGap={0}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#36877F",
    borderRadius: rounding.sm,
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
  },
  cell: {
    flexGrow: 1,
    height: 40,
    textAlign: "center",
  },
})
