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
import { useDB } from "@/db/useDB"

export function useExport() {
  const { drizzleDB } = useDB()

  async function exportData() {
    try {
      const now = DateTime.now()
      const fileName = `${now.toFormat("MMM-dd")}-Gymwork-${now.toFormat("HHmmss")}.json`

      const exportedData = {
        version: "1.0",
        exportedAt: now.toISO(),
        data: {
          settings: await drizzleDB.select().from(settings),
          exercises: await drizzleDB.select().from(exercises),
          exercise_metrics: await drizzleDB.select().from(exercise_metrics),
          workouts: await drizzleDB.select().from(workouts),
          workout_steps: await drizzleDB.select().from(workout_steps),
          workout_step_exercises: await drizzleDB.select().from(workout_step_exercises),
          sets: await drizzleDB.select().from(sets),
          tags: await drizzleDB.select().from(tags),
          workouts_tags: await drizzleDB.select().from(workouts_tags),
          workout_steps_tags: await drizzleDB.select().from(workout_steps_tags),
          sets_tags: await drizzleDB.select().from(sets_tags),
          exercises_tags: await drizzleDB.select().from(exercises_tags),
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
    await drizzleDB.delete(workouts_tags)
    await drizzleDB.delete(workout_steps_tags)
    await drizzleDB.delete(sets_tags)
    await drizzleDB.delete(exercises_tags)

    await drizzleDB.delete(sets)
    await drizzleDB.delete(workout_step_exercises)
    await drizzleDB.delete(workout_steps)
    await drizzleDB.delete(workouts)

    await drizzleDB.delete(exercise_metrics)
    await drizzleDB.delete(exercises)

    await drizzleDB.delete(tags)
    await drizzleDB.delete(settings)

    if (data.settings?.length) {
      await drizzleDB.insert(settings).values(data.settings)
    }

    if (data.exercises?.length) {
      await drizzleDB.insert(exercises).values(data.exercises)
    }

    if (data.exercise_metrics?.length) {
      await drizzleDB.insert(exercise_metrics).values(data.exercise_metrics)
    }

    if (data.workouts?.length) {
      await drizzleDB.insert(workouts).values(data.workouts)
    }

    if (data.workout_steps?.length) {
      await drizzleDB.insert(workout_steps).values(data.workout_steps)
    }

    if (data.workout_step_exercises?.length) {
      await drizzleDB.insert(workout_step_exercises).values(data.workout_step_exercises)
    }

    if (data.sets?.length) {
      await drizzleDB.insert(sets).values(data.sets)
    }

    if (data.tags?.length) {
      await drizzleDB.insert(tags).values(data.tags)
    }

    if (data.workouts_tags?.length) {
      await drizzleDB.insert(workouts_tags).values(data.workouts_tags)
    }

    if (data.workout_steps_tags?.length) {
      await drizzleDB.insert(workout_steps_tags).values(data.workout_steps_tags)
    }

    if (data.sets_tags?.length) {
      await drizzleDB.insert(sets_tags).values(data.sets_tags)
    }

    if (data.exercises_tags?.length) {
      await drizzleDB.insert(exercises_tags).values(data.exercises_tags)
    }
  }

  return {
    exportData,
    restoreData,
  }
}
