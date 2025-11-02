import { FC, useMemo } from "react"
import { Pressable, StyleSheet, View } from "react-native"

import { BaseLayout } from "@/layouts/BaseLayout"
import {
  Text,
  Header,
  spacing,
  IconButton,
  Icon,
  Divider,
  Select,
  ToggleSwitch,
  useColors,
} from "@/designSystem"
import { translate, useExport } from "@/utils"
import { useDialogContext } from "@/context/DialogContext"
import { goBack } from "@/navigators/navigationUtilities"
import { useSetting } from "@/context/SettingContext"

const appearanceOptions = [
  { label: translate("dark"), value: "dark" as const },
  { label: translate("light"), value: "light" as const },
  { label: translate("auto"), value: undefined },
]

export const SettingsScreen: FC = () => {
  const {
    colorSchemePreference,
    setColorSchemePreference,
    measureRest,
    setMeasureRest,
    showCommentsCard,
    setShowCommentsCard,
    previewNextSet,
    setPreviewNextSet,
    scientificMuscleNames,
    setScientificMuscleNames,
    showWorkoutTimer,
    setShowWorkoutTimer,
    showSetCompletion,
    setShowSetCompletion,
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
        <Select
          options={appearanceOptions}
          value={colorSchemePreference}
          onChange={setColorSchemePreference}
          headerText={translate("theme")}
          label={translate("theme")}
        />

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={measureRest}
          onToggle={() => setMeasureRest(!measureRest)}
        >
          {translate("measureRest")}
        </SettingsToggleItem>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={showCommentsCard}
          onToggle={() => setShowCommentsCard(!showCommentsCard)}
        >
          {translate("showCommentsCard")}
        </SettingsToggleItem>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={previewNextSet}
          onToggle={() => setPreviewNextSet(!previewNextSet)}
        >
          {translate("previewNextSet")}
        </SettingsToggleItem>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={scientificMuscleNames}
          onToggle={() => setScientificMuscleNames(!scientificMuscleNames)}
        >
          {translate("scientificMuscleNames")}
        </SettingsToggleItem>
        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={showWorkoutTimer}
          onToggle={() => setShowWorkoutTimer(!showWorkoutTimer)}
        >
          {translate("showWorkoutTimer")}
        </SettingsToggleItem>

        <Divider
          variant="neutral"
          orientation="horizontal"
        />

        <SettingsToggleItem
          enabled={showSetCompletion}
          onToggle={() => setShowSetCompletion(!showSetCompletion)}
        >
          {translate("showSetCompletion")}
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
    </BaseLayout>
  )
}

const makeStyles = (colors: any) =>
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
}

function SettingsToggleItem({ enabled, onToggle, children }: SettingsToggledItemProps) {
  const colors = useColors()
  const styles = useMemo(() => makeToggleItemStyles(colors), [colors])

  return (
    <Pressable
      style={styles.item}
      onPress={onToggle}
    >
      <>
        <Text style={styles.itemLabel}>{children}</Text>
        <ToggleSwitch
          variant="primary"
          value={enabled}
          onValueChange={onToggle}
        />
      </>
    </Pressable>
  )
}

const makeToggleItemStyles = (colors: any) =>
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
