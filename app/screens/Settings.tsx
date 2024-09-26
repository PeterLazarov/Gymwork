import React, { useMemo } from 'react'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { type StackScreenProps } from 'app/navigators'
import {
  Divider,
  Header,
  Icon,
  IconButton,
  Select,
  Text,
  ToggleSwitch,
  useColors,
} from 'designSystem'
import { observer } from 'mobx-react-lite'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
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
      showSnackbar?.({
        text: translate('dataExportSuccess'),
      })
    })
  }

  const onRestoreData = async () => {
    restoreData().then(() => {
      showSnackbar?.({
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

      <View style={{ flex: 1, padding: 8 }}>
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

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            settingsStore.setMeasureRest(!settingsStore.measureRest)
          }}
        >
          <>
            <Text style={styles.itemLabel}>{translate('measureRest')}</Text>
            <ToggleSwitch
              variant="primary"
              value={settingsStore.measureRest}
              onValueChange={settingsStore.setMeasureRest}
            />
          </>
        </TouchableOpacity>
        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            settingsStore.setProp(
              'showCommentsCard',
              !settingsStore.showCommentsCard
            )
          }}
        >
          <>
            <Text style={styles.itemLabel}>
              {translate('showCommentsCard')}
            </Text>
            <ToggleSwitch
              variant="primary"
              value={settingsStore.showCommentsCard}
              onValueChange={val =>
                settingsStore.setProp('showCommentsCard', val)
              }
            />
          </>
        </TouchableOpacity>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />
        <TouchableOpacity
          style={styles.item}
          onPress={onExportData}
        >
          <Text style={styles.itemLabel}>{translate('exportData')}</Text>
        </TouchableOpacity>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />
        <TouchableOpacity
          style={styles.item}
          onPress={onRestoreData}
        >
          <Text style={styles.itemLabel}>{translate('restoreData')}</Text>
        </TouchableOpacity>
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
      height: 64,
      padding: 12,
      gap: 10,
    },
    itemLabel: {
      color: colors.onSurface,
    },
  })
export default observer(SettingsScreen)
