import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import { Appearance, ColorSchemeName } from 'react-native'
import { getColors } from 'designSystem'
import * as SystemUI from 'expo-system-ui'

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
  })
  //   .actions(withSetPropAction)
  .actions(self => ({
    initialize() {
      if (self.colorSchemePreference) {
        Appearance.setColorScheme(self.colorSchemePreference)
      }

      const colorScheme = Appearance.getColorScheme()
      const colors = getColors(colorScheme)

      SystemUI.setBackgroundColorAsync(
        colors.neutralLighter
      )
    },

    //   null or undefined sets it to 'light'
    setColorSchemePreference(scheme: 'dark' | 'light' | null) {
      self.colorSchemePreference = scheme
      Appearance.setColorScheme(scheme ?? deviceColorScheme)

      const colorScheme = Appearance.getColorScheme()
      const colors = getColors(colorScheme)

      SystemUI.setBackgroundColorAsync(colors.neutralLighter)
    },
  }))

export interface SettingsStoreModelStore
  extends Instance<typeof SettingsStoreModel> {}
export interface SettingsStoreModelStoreSnapshot
  extends SnapshotOut<typeof SettingsStoreModel> {}
