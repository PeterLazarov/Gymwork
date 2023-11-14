import { StyleProp, ViewStyle } from 'react-native'
import MultiSelect from 'react-native-multiple-select'

import colors from './colors'

type Props = {
  options: string[]
  selectedOptions: string[]
  onSelect: (selected: string[]) => void
  selectText?: string
  containerStyle?: StyleProp<ViewStyle>
}

const MultiselectWrapper: React.FC<Props> = ({
  options,
  selectedOptions,
  onSelect,
  selectText,
  containerStyle = {},
}) => {
  const indicesDict = options.reduce<Record<string, number>>(
    (acc, m, i) => ({
      ...acc,
      [m]: i,
    }),
    {}
  )

  function onChange(selectedIndexes: number[]) {
    const value = selectedIndexes.map(id => options[id])
    onSelect(value)
  }

  return (
    <MultiSelect
      styleMainWrapper={containerStyle}
      selectText={selectText}
      items={options.map((o, i) => ({
        id: i,
        name: o,
      }))}
      selectedItems={selectedOptions.map(m => indicesDict[m])}
      uniqueKey="id"
      selectedItemIconColor={colors.primary}
      selectedItemTextColor={colors.primary}
      tagBorderColor={colors.primary}
      tagTextColor={colors.primary}
      tagRemoveIconColor={colors.gray}
      tagContainerStyle={{ borderRadius: 8 }}
      fixedHeight
      hideSubmitButton
      onSelectedItemsChange={onChange}
    />
  )
}

export default MultiselectWrapper
