import { useState } from "react"
import { StyleSheet, View } from "react-native"

import { discomfortOptions } from "@/constants/enums"
import { Button, Divider, FeedbackPicker, Modal, Select, spacing, useColors } from "@/designSystem"
import Datepicker from "@/designSystem/components/Datepicker"
import { translate } from "@/utils"
import { useSettings } from "@/db/hooks"
import { muscleAreas, muscles } from "@/constants/muscles"

export type FilterForm = {
  discomfortLevel?: string
  dateFrom?: string
  dateTo?: string
  muscle?: string
  muscleArea?: string
}
type Props = {
  open: boolean
  closeModal: () => void
  applyFilter: (data: FilterForm) => void
}

export const isFilterEmpty = (filter: FilterForm) => {
  return !filter.discomfortLevel && !filter.dateFrom && !filter.dateTo
}

export const WorkoutsFilterModal: React.FC<Props> = ({ open, closeModal, applyFilter }) => {
  const colors = useColors()
  const { data: settings } = useSettings()
  const [muscle, setMuscle] = useState<string | undefined>()
  const [muscleArea, setMuscleArea] = useState<string | undefined>()
  const [discomfortLevel, setDiscomfortLevel] = useState<string | undefined>()
  const [dateFrom, setDateFrom] = useState<string | undefined>()
  const [dateTo, setDateTo] = useState<string | undefined>()

  const muscleItems = settings?.scientific_muscle_names_enabled ? muscles : muscleAreas

  return (
    <Modal
      open={open}
      onClose={closeModal}
      containerStyle={{ alignItems: "center", justifyContent: "center", marginHorizontal: spacing.md }}
    >
      <View style={{ backgroundColor: colors.surface, padding: 0 }}>
        <Modal.Header title={translate("filterWorkouts")} />
        <View
          style={{
            paddingHorizontal: spacing.sm,
            paddingBottom: spacing.sm,
            gap: spacing.xs,
          }}
        >
          <View style={styles.filterOptionList}>
            {Object.values(discomfortOptions).map((option) => (
              <FeedbackPicker.Option
                key={option.value}
                option={option}
                isSelected={discomfortLevel === option.value}
                onPress={() =>
                  setDiscomfortLevel(discomfortLevel === option.value ? undefined : option.value)
                }
                compactMode
                style={styles.filterOption}
              />
            ))}
          </View>
          <Datepicker
            label="From"
            onChange={setDateFrom}
            value={dateFrom}
          />
          <Datepicker
            label="To"
            onChange={setDateTo}
            value={dateTo}
          />

          <Select
            label={translate("muscle")}
            value={settings?.scientific_muscle_names_enabled ? muscle : muscleArea}
            onChange={settings?.scientific_muscle_names_enabled ? setMuscle : setMuscleArea}
            options={muscleItems.map((muscleArea) => ({ label: muscleArea, value: muscleArea }))}
            containerStyle={{ flexDirection: "row" }}
          />
        </View>

        <Divider
          orientation="horizontal"
          variant="primary"
        />
        <View style={{ flexDirection: "row" }}>
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={closeModal}
            text={translate("cancel")}
          />
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={() => {
              applyFilter({ discomfortLevel, dateFrom, dateTo, muscle, muscleArea })
              closeModal()
            }}
            text={translate("confirm")}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  filterOptionList: {
    flexDirection: "row",
    margin: spacing.xs,
  },
  filterOption: {
    backgroundColor: "transparent",
  },
})
