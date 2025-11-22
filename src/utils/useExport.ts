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

export function useExport() {
  const db = useDatabaseService()
  const drizzle = db.getDrizzle()

  async function exportData() {
    try {
      const now = DateTime.now()
      const fileName = `${now.toFormat("MMM-dd")}-Gymwork-${now.toFormat("HHmmss")}.json`

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
          dialogTitle: "Export Gymwork Data",
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
    }
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
        Alert.alert("Invalid File", "The selected file does not contain valid Gymwork data")
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

  async function performRestore(data: any) {
    await Promise.all([
      drizzle.delete(workouts_tags),
      drizzle.delete(workout_steps_tags),
      drizzle.delete(sets_tags),
      drizzle.delete(exercises_tags),
    ])

    await Promise.all([drizzle.delete(sets), drizzle.delete(workout_step_exercises)])

    await drizzle.delete(workout_steps)
    await drizzle.delete(workouts)
    await drizzle.delete(exercise_metrics)

    await Promise.all([drizzle.delete(exercises), drizzle.delete(tags), drizzle.delete(settings)])

    if (data.settings?.length) {
      await drizzle.insert(settings).values(data.settings)
    }

    if (data.exercises?.length) {
      await drizzle.insert(exercises).values(data.exercises)
    }

    if (data.exercise_metrics?.length) {
      await drizzle.insert(exercise_metrics).values(data.exercise_metrics)
    }

    if (data.workouts?.length) {
      const sanitizedWorkouts = data.workouts.map((workout: any) => ({
        ...workout,
        date: sanitizeMsDate(workout.date),
      }))
      await drizzle.insert(workouts).values(sanitizedWorkouts)
    }

    if (data.workout_steps?.length) {
      await drizzle.insert(workout_steps).values(data.workout_steps)
    }

    if (data.workout_step_exercises?.length) {
      await drizzle.insert(workout_step_exercises).values(data.workout_step_exercises)
    }

    if (data.sets?.length) {
      const sanitizedSets = data.sets.map((set: any) => ({
        ...set,
        date: sanitizeMsDate(set.date),
      }))
      await drizzle.insert(sets).values(sanitizedSets)
    }

    if (data.tags?.length) {
      await drizzle.insert(tags).values(data.tags)
    }

    if (data.workouts_tags?.length) {
      await drizzle.insert(workouts_tags).values(data.workouts_tags)
    }

    if (data.workout_steps_tags?.length) {
      await drizzle.insert(workout_steps_tags).values(data.workout_steps_tags)
    }

    if (data.sets_tags?.length) {
      await drizzle.insert(sets_tags).values(data.sets_tags)
    }

    if (data.exercises_tags?.length) {
      await drizzle.insert(exercises_tags).values(data.exercises_tags)
    }
  }

  return {
    exportData,
    restoreData,
  }
}
