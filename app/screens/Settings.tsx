import React from 'react'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { type StackScreenProps } from 'app/navigators'
import { Header, Icon, IconButton, Select, useColors } from 'designSystem'
import { observer } from 'mobx-react-lite'
import { View } from 'react-native'
import { translate } from 'app/i18n'
import { useStores } from 'app/db/helpers/useStores'

export type SettingsScreenProps = StackScreenProps<'Settings'>

const appearanceOptions = [
  { label: translate('on'), value: 'dark' as const },
  { label: translate('off'), value: 'light' as const },
  { label: translate('auto'), value: null },
]

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { settingsStore, navStore } = useStores()

  const colors = useColors()

  return (
    <EmptyLayout>
      <Header>
        <IconButton
          onPress={navStore.goBack}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.mat.onPrimary}
          />
        </IconButton>
        <Header.Title title={translate('settings')} />
      </Header>

      <View style={{ flex: 1, gap: 8, padding: 8 }}>
        <Select
          options={appearanceOptions}
          value={settingsStore.colorSchemePreference}
          onChange={settingsStore.setColorSchemePreference}
          headerText={translate('darkMode')}
          label={translate('darkMode')}
        />
      </View>
    </EmptyLayout>
  )
}

export default observer(SettingsScreen)
