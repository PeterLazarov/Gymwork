import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { capitalize } from '@/utils/string'
import { useAppTheme } from '@/utils/useAppTheme'
import SettingsToggleItem from 'app/components/SettingsToggleItem'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { type AppStackScreenProps } from 'app/navigators'
import { useExport } from 'app/utils/useExport'
import {
  Divider,
  Header,
  Icon,
  IconButton,
  Select,
  spacing,
  Text,
} from 'designSystem'

export type SettingsScreenProps = AppStackScreenProps<'Settings'>

const appearanceOptions = [
  { label: translate('dark'), value: 'dark' as const },
  { label: translate('light'), value: 'light' as const },
  { label: translate('auto'), value: undefined },
].map(o => ({
  ...o,
  label: capitalize(o.label),
}))

export const SettingsScreen: React.FC<SettingsScreenProps> = observer(() => {
  const { settingsStore, navStore } = useStores()

  const {
    theme: { colors },
    setThemeContextOverride,
  } = useAppTheme()

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
      <View style={{ flex: 1, padding: spacing.xs }}>
        <Select
          options={appearanceOptions}
          value={settingsStore.colorSchemePreference}
          onChange={t => setThemeContextOverride(t ?? undefined)}
          headerText={translate('colorScheme')}
          label={translate('colorScheme')}
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
