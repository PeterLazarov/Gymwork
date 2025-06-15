import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import {
  Button,
  ButtonText,
  useColors,
  spacing,
  FeedbackPickerOption,
  Datepicker,
} from 'designSystem'
import { translate } from 'app/i18n'
import { observer } from 'mobx-react-lite'
import { Workout, discomfortOptions } from 'app/db/models'
import { isDateLessThan } from 'app/utils/date'

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

export const applyWorkoutFilter = (filter: FilterForm, workout: Workout) => {
  const discomfortFilter =
    !filter.discomfortLevel ||
    (workout.pain && filter.discomfortLevel.includes(workout.pain))

  const dateFromFilter =
    !filter.dateFrom || isDateLessThan(filter.dateFrom, workout.date)

  const dateToFilter =
    !filter.dateTo || isDateLessThan(workout.date, filter.dateTo)

  return discomfortFilter && dateFromFilter && dateToFilter
}

const WorkoutsFilterModal: React.FC<Props> = ({
  open,
  closeModal,
  applyFilter,
}) => {
  const colors = useColors()
  const [discomfortLevel, setDiscomfortLevel] = useState<string | undefined>()
  const [dateFrom, setDateFrom] = useState<string | undefined>()
  const [dateTo, setDateTo] = useState<string | undefined>()

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={closeModal}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          marginVertical: spacing.sm,
          marginHorizontal: spacing.md,
        }}
      >
        <View style={styles.filterOptionList}>
          {Object.values(discomfortOptions).map(option => (
            <FeedbackPickerOption
              key={option.value}
              option={option}
              isSelected={discomfortLevel === option.value}
              onPress={() =>
                setDiscomfortLevel(
                  discomfortLevel === option.value ? undefined : option.value
                )
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
        <View style={{ flexDirection: 'row' }}>
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={closeModal}
          >
            <ButtonText variant="tertiary">{translate('cancel')}</ButtonText>
          </Button>
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={() => {
              applyFilter({ discomfortLevel, dateFrom, dateTo })
              closeModal()
            }}
          >
            <ButtonText variant="tertiary">{translate('confirm')}</ButtonText>
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  filterOptionList: {
    flexDirection: 'row',
    margin: spacing.xs,
  },
  filterOption: {
    backgroundColor: 'transparent',
  },
})

export default observer(WorkoutsFilterModal)
