import * as DocumentPicker from 'expo-document-picker'
import { StorageAccessFramework, readAsStringAsync, writeAsStringAsync } from 'expo-file-system'
import { DateTime } from 'luxon'
import { getSnapshot } from 'mobx-state-tree'
import { Alert } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { RootStore } from '@/db/stores/RootStore'

export function useExport() {
  const rootStore = useStores()
  const { workoutStore, exerciseStore, recordStore } = rootStore

  const now = DateTime.now()
  async function exportData() {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync()
    if (!permissions.granted) {
      return
    }

    try {
      const jsonString = JSON.stringify({
        workoutStore: getSnapshot(workoutStore),
        exerciseStore: getSnapshot(exerciseStore),
      })

      await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        `${now.monthShort}-${now.day}-Gymwork-.json`,
        'application/json'
      ).then(async uri => {
        await writeAsStringAsync(uri, jsonString)
      })
    } catch (error: any) {
      Alert.alert(error.message)
    }
  }

  async function restoreData(): Promise<void> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      })

      if (!result.canceled) {
        const fileUri = result.assets[0]!.uri

        // Read the file's content
        const fileContent = await readAsStringAsync(fileUri)

        // Parse the JSON data 
        const data = JSON.parse(fileContent) as Partial<RootStore>

        rootStore.setProp('exerciseStore', data?.exerciseStore)
        rootStore.setProp('workoutStore', data?.workoutStore)
        recordStore.determineRecords()
      }
    } catch (error: any) {
      Alert.alert(error.message)
    }
  }

  return {
    exportData,
    restoreData,
  }
}
