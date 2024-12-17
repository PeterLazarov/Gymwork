import React, { useMemo } from 'react'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { type AppStackScreenProps } from 'app/navigators'
import {
  Divider,
  Header,
  Icon,
  IconButton,
  Select,
  Text,
  useColors,
  spacing,
} from 'designSystem'
import { observer } from 'mobx-react-lite'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { translate } from 'app/i18n'
import { useStores } from 'app/db/helpers/useStores'
import { useExport } from 'app/utils/useExport'
import { useDialogContext } from 'app/contexts/DialogContext'
import SettingsToggleItem from 'app/components/SettingsToggleItem'

export type SettingsScreenProps = AppStackScreenProps<'Settings'>

const appearanceOptions = [
  { label: translate('on'), value: 'dark' as const },
  { label: translate('off'), value: 'light' as const },
  { label: translate('auto'), value: null },
]

export const SettingsScreen: React.FC<SettingsScreenProps> = observer(() => {
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

      <View style={{ flex: 1, padding: spacing.xs }}>
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

        <SettingsToggleItem
          enabled={settingsStore.measureRest}
          onToggle={() =>
            settingsStore.setMeasureRest(!settingsStore.measureRest)
          }
        >
          {translate('measureRest')}
        </SettingsToggleItem>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={settingsStore.showCommentsCard}
          onToggle={() =>
            settingsStore.setProp(
              'showCommentsCard',
              !settingsStore.showCommentsCard
            )
          }
        >
          {translate('showCommentsCard')}
        </SettingsToggleItem>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={settingsStore.previewNextSet}
          onToggle={() =>
            settingsStore.setProp(
              'previewNextSet',
              !settingsStore.previewNextSet
            )
          }
        >
          {translate('previewNextSet')}
        </SettingsToggleItem>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={settingsStore.showWorkoutTimer}
          onToggle={() =>
            settingsStore.setProp(
              'showWorkoutTimer',
              !settingsStore.showWorkoutTimer
            )
          }
        >
          {translate('showWorkoutTimer')}
        </SettingsToggleItem>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={settingsStore.showSetCompletion}
          onToggle={() =>
            settingsStore.setProp(
              'showSetCompletion',
              !settingsStore.showSetCompletion
            )
          }
        >
          {translate('showSetCompletion')}
        </SettingsToggleItem>

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
})

const makeStyles = (colors: any) =>
  StyleSheet.create({
    item: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
      height: 64,
      justifyContent: 'space-between',
      padding: spacing.sm,
    },
    itemLabel: {
      color: colors.onSurface,
    },
  })
