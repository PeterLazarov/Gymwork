import { Alert } from 'react-native'
import { StorageAccessFramework, writeAsStringAsync, readAsStringAsync } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

import { WorkoutStoreSnapshot } from 'app/db/stores/WorkoutStore'

export function useExport() {
  async function exportWorkouts(workoutStore: WorkoutStoreSnapshot) {
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
        return;
    }

    try {
      const jsonString = JSON.stringify(workoutStore);

      await StorageAccessFramework.createFileAsync(permissions.directoryUri, 'exportedData.json', 'application/json')
        .then(async(uri) => {
          await writeAsStringAsync(uri, jsonString);
        })
    } catch (error: any) {
      Alert.alert(error.message)
    }
  }

  async function restoreWorkouts(): Promise<WorkoutStoreSnapshot | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;

        // Read the file's content
        const fileContent = await readAsStringAsync(fileUri);

        // Parse the JSON data
        return JSON.parse(fileContent);
      }
    } catch (error: any) {
      Alert.alert(error.message)
    }

    return null
  }

  return {
    exportWorkouts,
    restoreWorkouts
  }
}
