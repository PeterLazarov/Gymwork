import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { Appearance, ColorSchemeName } from 'react-native'
import * as SystemUI from 'expo-system-ui'

import { getColors } from 'designSystem'
import { withSetPropAction } from '../helpers/withSetPropAction'

let deviceColorScheme = Appearance.getColorScheme()
Appearance.addChangeListener(({ colorScheme }) => {
  deviceColorScheme = colorScheme
})

const colorSchemes = ['dark', 'light'] satisfies ColorSchemeName[]

export const SettingsStoreModel = types
  .model('SettingsStore')
  .props({
    colorSchemePreference: types.optional(
      types.maybeNull(types.maybe(types.enumeration(colorSchemes))),
      'light' // TODO rethink once we have dark mode set up
    ),
    measureRest: false,
    showCommentsCard: true,
    previewNextSet: false,
    showWorkoutTimer: true,

    // ! TODO Currenlty makes sense only for copyWorkout + includeSets!
    showSetCompletion: false,
  })
  .actions(withSetPropAction)
  .actions(self => ({
    initialize() {
      if (self.colorSchemePreference) {
        Appearance.setColorScheme(self.colorSchemePreference)
      }

      const colorScheme = Appearance.getColorScheme()
      const colors = getColors(colorScheme)

      SystemUI.setBackgroundColorAsync(colors.surfaceContainerLow)
    },

    //   null or undefined sets it to 'light'
    setColorSchemePreference(scheme: 'dark' | 'light' | null) {
      self.colorSchemePreference = scheme
      Appearance.setColorScheme(scheme ?? deviceColorScheme)

      const colorScheme = Appearance.getColorScheme()
      const colors = getColors(colorScheme)

      SystemUI.setBackgroundColorAsync(colors.surfaceContainerLow)
    },
    setMeasureRest(measureRest: boolean) {
      self.measureRest = measureRest
    },
  }))

export interface SettingsStore extends Instance<typeof SettingsStoreModel> {}
export interface SettingsStoreSnapshot
  extends SnapshotOut<typeof SettingsStoreModel> {}
