import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { ColorSchemeName } from 'react-native'

import { withSetPropAction } from '../helpers/withSetPropAction'

const colorSchemes = ['dark', 'light'] satisfies ColorSchemeName[]

export const SettingsStoreModel = types
  .model('SettingsStore')
  .props({
    colorSchemePreference: types.optional(
      types.maybe(types.maybe(types.enumeration(colorSchemes))),
      undefined
    ),
    measureRest: false,
    showCommentsCard: true,
    previewNextSet: false,
    showWorkoutTimer: true,

    // ! TODO Currenlty makes sense only for copyWorkout + includeSets!
    showSetCompletion: false,
    enableDetailedWorkoutSummary: false,
  })
  .actions(withSetPropAction)
  .actions(self => ({
    initialize() {},
    setMeasureRest(measureRest: boolean) {
      self.measureRest = measureRest
    },
  }))

export interface SettingsStore extends Instance<typeof SettingsStoreModel> {}
export interface SettingsStoreSnapshot
  extends SnapshotOut<typeof SettingsStoreModel> {}
