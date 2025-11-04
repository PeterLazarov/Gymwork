import { useState } from "react"
import { View, Modal, StyleSheet } from "react-native"

import { discomfortOptions } from "@/constants/enums"
import { Backdrop, Button, FeedbackPicker, spacing, useColors } from "@/designSystem"
import Datepicker from "@/designSystem/components/Datepicker"
import { translate } from "@/utils"

export type FilterForm = {
  discomfortLevel?: string
  dateFrom?: string
  dateTo?: string
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
  const [discomfortLevel, setDiscomfortLevel] = useState<string | undefined>()
  const [dateFrom, setDateFrom] = useState<string | undefined>()
  const [dateTo, setDateTo] = useState<string | undefined>()

  return (
    <Modal
      transparent
      visible={open}
      onRequestClose={closeModal}
      animationType="fade"
    >
      <Backdrop onPress={closeModal} />
      <View
        pointerEvents="box-none"
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            marginHorizontal: spacing.md,
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
                applyFilter({ discomfortLevel, dateFrom, dateTo })
                closeModal()
              }}
              text={translate("confirm")}
            />
          </View>
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
