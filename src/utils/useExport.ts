import * as DocumentPicker from "expo-document-picker"
import { File, Paths } from "expo-file-system"
import * as Sharing from "expo-sharing"
import { DateTime } from "luxon"
import { Alert } from "react-native"

import {
  exercise_metrics,
  exercises,
  exercises_tags,
  sets,
  sets_tags,
  settings,
  tags,
  workout_step_exercises,
  workout_steps,
  workout_steps_tags,
  workouts,
  workouts_tags,
} from "@/db/schema"
import { useDatabaseService } from "@/db/useDB"
import { sanitizeMsDate } from "./date"
import { withOperation } from "./observability"

// SQLite accepts 999 variables by default; leave room for statement overhead.
const MAX_RESTORE_SQL_VARIABLES = 900

export function insertInBatches<T>(
  rows: readonly T[],
  variablesPerRow: number,
  insert: (batch: T[]) => unknown,
): void {
  const batchSize = Math.floor(MAX_RESTORE_SQL_VARIABLES / variablesPerRow)

  for (let start = 0; start < rows.length; start += batchSize) {
    insert(rows.slice(start, start + batchSize))
  }
}

export function useExport() {
  const db = useDatabaseService()
  const drizzle = db.getDrizzle()

  async function exportData() {
    return withOperation("export.exportData", async () => {
      try {
        const now = DateTime.now()
        const fileName = `${now.toFormat("MMM-dd")}-BodyBuilder-${now.toFormat("HHmmss")}.json`

        const [
          settingsData,
          exercisesData,
          exerciseMetricsData,
          workoutsData,
          workoutStepsData,
          workoutStepExercisesData,
          setsData,
          tagsData,
          workoutsTagsData,
          workoutStepsTagsData,
          setsTagsData,
          exercisesTagsData,
        ] = await Promise.all([
          drizzle.query.settings.findMany(),
          drizzle.query.exercises.findMany(),
          drizzle.query.exercise_metrics.findMany(),
          drizzle.query.workouts.findMany(),
          drizzle.query.workout_steps.findMany(),
          drizzle.query.workout_step_exercises.findMany(),
          drizzle.query.sets.findMany(),
          drizzle.query.tags.findMany(),
          drizzle.query.workouts_tags.findMany(),
          drizzle.query.workout_steps_tags.findMany(),
          drizzle.query.sets_tags.findMany(),
          drizzle.query.exercises_tags.findMany(),
        ])

        const exportedData = {
          version: "1.0",
          exportedAt: now.toISO(),
          data: {
            settings: settingsData,
            exercises: exercisesData,
            exercise_metrics: exerciseMetricsData,
            workouts: workoutsData,
            workout_steps: workoutStepsData,
            workout_step_exercises: workoutStepExercisesData,
            sets: setsData,
            tags: tagsData,
            workouts_tags: workoutsTagsData,
            workout_steps_tags: workoutStepsTagsData,
            sets_tags: setsTagsData,
            exercises_tags: exercisesTagsData,
          },
        }

        const jsonString = JSON.stringify(exportedData, null, 2)

        const file = new File(Paths.cache, fileName)
        await file.write(jsonString)

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(file.uri, {
            mimeType: "application/json",
            dialogTitle: "Export Data",
            UTI: "public.json",
          })
        } else {
          Alert.alert("Error", "Sharing is not available on this device")
        }

        setTimeout(async () => {
          try {
            if (file.exists) {
              await file.delete()
            }
          } catch (error) {
            console.error("Error cleaning up temp file:", error)
          }
        }, 5000)
      } catch (error: any) {
        console.error("Export error:", error)
        Alert.alert("Export Failed", error.message || "An unknown error occurred")
        throw error // Re-throw for withOperation to log it as error
      }
    })
  }

  async function restoreData(): Promise<void> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      })

      if (result.canceled) {
        return
      }

      const fileUri = result.assets[0]!.uri

      const file = new File(fileUri)
      const fileContent = await file.text()

      const importedData = JSON.parse(fileContent)

      if (!importedData.data) {
        Alert.alert("Invalid File", "The selected file does not contain valid BodyBuilder data")
        return
      }

      Alert.alert(
        "Restore Data",
        "This will replace all your current data. Are you sure you want to continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Restore",
            style: "destructive",
            onPress: async () => {
              try {
                await performRestore(importedData.data)
                Alert.alert("Success", "Data has been restored successfully")
              } catch (error: any) {
                console.error("Restore error:", error)
                Alert.alert("Restore Failed", error.message || "An unknown error occurred")
              }
            },
          },
        ],
      )
    } catch (error: any) {
      console.error("Import error:", error)
      Alert.alert("Import Failed", error.message || "An unknown error occurred")
    }
  }

  function performRestore(data: any) {
    return withOperation("export.performRestore", async () => {
      drizzle.transaction((tx) => {
        tx.delete(workouts_tags).run()
        tx.delete(workout_steps_tags).run()
        tx.delete(sets_tags).run()
        tx.delete(exercises_tags).run()
        tx.delete(sets).run()
        tx.delete(workout_step_exercises).run()
        tx.delete(workout_steps).run()
        tx.delete(workouts).run()
        tx.delete(exercise_metrics).run()
        tx.delete(exercises).run()
        tx.delete(tags).run()
        tx.delete(settings).run()

        if (data.settings?.length) {
          insertInBatches(data.settings, 13, (batch) => tx.insert(settings).values(batch).run())
        }

        if (data.exercises?.length) {
          insertInBatches(data.exercises, 13, (batch) => tx.insert(exercises).values(batch).run())
        }

        if (data.exercise_metrics?.length) {
          insertInBatches(data.exercise_metrics, 11, (batch) =>
            tx.insert(exercise_metrics).values(batch).run(),
          )
        }

        if (data.workouts?.length) {
          insertInBatches(data.workouts, 12, (batch) =>
            tx
              .insert(workouts)
              .values(
                batch.map((workout: any) => ({
                  ...workout,
                  date: sanitizeMsDate(workout.date),
                })),
              )
              .run(),
          )
        }

        if (data.workout_steps?.length) {
          insertInBatches(data.workout_steps, 8, (batch) =>
            tx.insert(workout_steps).values(batch).run(),
          )
        }

        if (data.workout_step_exercises?.length) {
          insertInBatches(data.workout_step_exercises, 5, (batch) =>
            tx.insert(workout_step_exercises).values(batch).run(),
          )
        }

        if (data.sets?.length) {
          insertInBatches(data.sets, 15, (batch) =>
            tx
              .insert(sets)
              .values(
                batch.map((set: any) => ({
                  ...set,
                  date: sanitizeMsDate(set.date),
                })),
              )
              .run(),
          )
        }

        if (data.tags?.length) {
          insertInBatches(data.tags, 6, (batch) => tx.insert(tags).values(batch).run())
        }

        if (data.workouts_tags?.length) {
          insertInBatches(data.workouts_tags, 4, (batch) =>
            tx.insert(workouts_tags).values(batch).run(),
          )
        }

        if (data.workout_steps_tags?.length) {
          insertInBatches(data.workout_steps_tags, 4, (batch) =>
            tx.insert(workout_steps_tags).values(batch).run(),
          )
        }

        if (data.sets_tags?.length) {
          insertInBatches(data.sets_tags, 4, (batch) => tx.insert(sets_tags).values(batch).run())
        }

        if (data.exercises_tags?.length) {
          insertInBatches(data.exercises_tags, 4, (batch) =>
            tx.insert(exercises_tags).values(batch).run(),
          )
        }
      })
    })
  }

  return {
    exportData,
    restoreData,
  }
}
