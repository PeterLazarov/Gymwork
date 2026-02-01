import { FC, useMemo, useState } from "react"
import { ColorSchemeName, Pressable, StyleSheet, View } from "react-native"
import Constants from "expo-constants"
import { compare } from "semver"

import { useDialogContext } from "@/context/DialogContext"
import { useSetting } from "@/context/SettingContext"
import { useSettings } from "@/db/hooks"
import type { AppColors, SelectOption } from "@/designSystem"
import {
  Button,
  Divider,
  Header,
  Icon,
  IconButton,
  Select,
  spacing,
  Text,
  ToggleSwitch,
  useColors,
} from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { goBack } from "@/navigators/navigationUtilities"
import { translate, useExport } from "@/utils"
import { AppUpdateModal } from "./AppUpdateModal"

const appearanceOptions: SelectOption<ColorSchemeName>[] = [
  { label: translate("dark"), value: "dark" },
  { label: translate("light"), value: "light" },
  { label: translate("auto"), value: undefined },
]

export const SettingsScreen: FC = () => {
  const { data: settings } = useSettings()
  const colors = useColors()
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
 
  const currentVersion = Constants.expoConfig!.version!
  const canUpgradeVersion = !!settings?.skipped_version && compare(settings.skipped_version, currentVersion) > 0

  const openUpgradeModal = () => {
    setUpdateModalOpen(true)
  }

  return (
    <BaseLayout>
      <Header>
        <IconButton
          onPress={goBack}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title title={translate("settings")} />
      </Header>

      <View style={{ flex: 1, padding: spacing.xs }}>
        <SettingsEditForm />

        <Button
          variant="tertiary"
          text={translate(canUpgradeVersion ? "version_update_available" : "version", {version: currentVersion})}
          textStyle={{color: colors.outline}}
          onPress={canUpgradeVersion ? openUpgradeModal : undefined}
        />
      </View>

      <AppUpdateModal 
        open={updateModalOpen} 
        onClose={() => setUpdateModalOpen(false)} 
      />
    </BaseLayout>
  )
}

export const SettingsEditForm = () => {
  const { data: settings } = useSettings()
  const {
    colorSchemePreference,
    setColorSchemePreference,
    setMeasureRest,
    setShowCommentsCard,
    setPreviewNextSet,
    setScientificMuscleNames,
    setShowWorkoutTimer,
    setManualSetCompletion,
  } = useSetting()
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { exportData, restoreData } = useExport()
  const { showSnackbar } = useDialogContext()

  const onExportData = () => {
    exportData().then(() => {
      showSnackbar?.({
        text: translate("dataExportSuccess"),
      })
    })
  }

  const onRestoreData = async () => {
    restoreData().then(() => {
      showSnackbar?.({
        text: translate("dataImportSuccess"),
      })
    })
  }

  return (
    <View style={{ flex: 1, paddingBottom: spacing.xs }}>
      <View style={styles.item}>
        <Text style={[styles.itemLabel, {flex: 1}]}>{translate("theme")}</Text>
        <Select
          options={appearanceOptions}
          value={colorSchemePreference}
          onChange={(value) => setColorSchemePreference(value!)}
          headerText={translate("theme")}
          label={translate("theme")}
          containerStyle={{flex: 1}}
        />
      </View>

      <Divider
        variant="neutral"
        orientation="horizontal"
      />

      <SettingsToggleItem
        enabled={settings!.measure_rest}
        onToggle={() => setMeasureRest(!settings!.measure_rest)}
      >
        {translate("measureRest")}
      </SettingsToggleItem>

      <Divider
        variant="neutral"
        orientation="horizontal"
      />

      <SettingsToggleItem
        enabled={settings!.show_comments_card}
        onToggle={() => setShowCommentsCard(!settings!.show_comments_card)}
      >
        {translate("showCommentsCard")}
      </SettingsToggleItem>

      <Divider
        variant="neutral"
        orientation="horizontal"
      />

      <SettingsToggleItem
        enabled={settings!.preview_next_set}
        onToggle={() => setPreviewNextSet(!settings!.preview_next_set)}
      >
        {translate("previewNextSet")}
      </SettingsToggleItem>

      <Divider
        variant="neutral"
        orientation="horizontal"
      />

      <SettingsToggleItem
        enabled={settings!.scientific_muscle_names_enabled}
        onToggle={() => setScientificMuscleNames(!settings!.scientific_muscle_names_enabled)}
      >
        {translate("scientificMuscleNames")}
      </SettingsToggleItem>
      <Divider
        variant="neutral"
        orientation="horizontal"
      />

      <SettingsToggleItem
        enabled={settings!.show_workout_timer}
        onToggle={() => setShowWorkoutTimer(!settings!.show_workout_timer)}
        editable={false}
      >
        {translate("showWorkoutTimer")}
      </SettingsToggleItem>

      <Divider
        variant="neutral"
        orientation="horizontal"
      />

      <SettingsToggleItem
        enabled={settings!.manual_set_completion}
        onToggle={() => setManualSetCompletion(!settings!.manual_set_completion)}
      >
        {translate("manualSetCompletion")}
      </SettingsToggleItem>

      <Divider
        variant="neutral"
        orientation="horizontal"
      />

      <Pressable
        style={styles.item}
        onPress={onExportData}
      >
        <Text style={styles.itemLabel}>{translate("exportData")}</Text>
      </Pressable>

      <Divider
        variant="neutral"
        orientation="horizontal"
      />
      <Pressable
        style={styles.item}
        onPress={onRestoreData}
      >
        <Text style={styles.itemLabel}>{translate("restoreData")}</Text>
      </Pressable>
    </View>
  )
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 64,
      padding: spacing.sm,
      gap: spacing.xs,
    },
    itemLabel: {
      color: colors.onSurface,
    },
  })

type SettingsToggledItemProps = {
  enabled: boolean
  onToggle: () => void
  children?: React.ReactNode
  editable?: boolean
}

function SettingsToggleItem({
  enabled,
  onToggle,
  children,
  editable = true,
}: SettingsToggledItemProps) {
  const colors = useColors()
  const styles = useMemo(() => makeToggleItemStyles(colors), [colors])

  return (
    <Pressable
      style={styles.item}
      onPress={onToggle}
      disabled={!editable}
    >
      <>
        <Text style={styles.itemLabel}>{children}</Text>
        <ToggleSwitch
          variant="primary"
          value={enabled}
          disabled={!editable}
          onValueChange={onToggle}
        />
      </>
    </Pressable>
  )
}

const makeToggleItemStyles = (colors: AppColors) =>
  StyleSheet.create({
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 64,
      padding: spacing.sm,
      gap: spacing.xs,
    },
    itemLabel: {
      color: colors.onSurface,
    },
  })
