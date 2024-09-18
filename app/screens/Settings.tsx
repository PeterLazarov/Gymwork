import React, { useMemo } from 'react'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { type StackScreenProps } from 'app/navigators'
import {
  Divider,
  Header,
  Icon,
  IconButton,
  PressableHighlight,
  Select,
  Text,
  ToggleSwitch,
  useColors,
} from 'designSystem'
import { observer } from 'mobx-react-lite'
import { StyleSheet, View } from 'react-native'
import { translate } from 'app/i18n'
import { useStores } from 'app/db/helpers/useStores'
import { useExport } from 'app/utils/useExport'
import { useDialogContext } from 'app/contexts/DialogContext'
export type SettingsScreenProps = StackScreenProps<'Settings'>

const appearanceOptions = [
  { label: translate('on'), value: 'dark' as const },
  { label: translate('off'), value: 'light' as const },
  { label: translate('auto'), value: null },
]

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { settingsStore, navStore } = useStores()

  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { exportData, restoreData } = useExport()
  const { showSnackbar } = useDialogContext()

  const onExportData = () => {
    exportData().then(() => {
      showSnackbar!({
        text: translate('dataExportSuccess'),
      })
    })
  }

  const onRestoreData = async () => {
    restoreData().then(() => {
      showSnackbar!({
        text: translate('dataImportSuccess'),
      })
    })
  }

  return (
    <EmptyLayout>
      <Header>
        <IconButton
          onPress={navStore.goBack}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
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

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <View style={styles.item}>
          <Text style={styles.itemLabel}>{translate('measureRest')}</Text>
          <ToggleSwitch
            variant="primary"
            value={settingsStore.measureRest}
            onValueChange={measureRest => {
              settingsStore.setProp('measureRest', measureRest)
            }}
          />
        </View>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />
        <PressableHighlight
          style={styles.item}
          onPress={onExportData}
        >
          <Text style={styles.itemLabel}>{translate('exportData')}</Text>
        </PressableHighlight>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />
        <PressableHighlight
          style={styles.item}
          onPress={onRestoreData}
        >
          <Text style={styles.itemLabel}>{translate('restoreData')}</Text>
        </PressableHighlight>
      </View>
    </EmptyLayout>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 5,
      gap: 10,
    },
    itemLabel: {
      color: colors.onSurface,
    },
  })
export default observer(SettingsScreen)
