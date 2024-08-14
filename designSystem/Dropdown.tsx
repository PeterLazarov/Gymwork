import { StyleProp, ViewStyle } from 'react-native'
import MultiSelect from 'react-native-multiple-select'

import colors from './colors'

type Props = {
  options: string[]
  selectedOption: string
  onSelect: (selected: string) => void
  selectText?: string
  containerStyle?: StyleProp<ViewStyle>
}

const Dropdown: React.FC<Props> = ({
  options,
  selectedOption,
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

  function onChange([selectedIndex]: number[]) {
    const value = options[selectedIndex]
    onSelect(value)
  }

  return (
    <MultiSelect
      single
      styleMainWrapper={containerStyle}
      selectText={selectText}
      items={options.map((o, i) => ({
        id: i,
        name: o,
      }))}
      selectedItems={[selectedOption].map(m => indicesDict[m])}
      uniqueKey="id"
      selectedItemIconColor={colors.primary}
      selectedItemTextColor={colors.primary}
      fixedHeight
      hideSubmitButton
      onSelectedItemsChange={onChange}
    />
  )
}

export default Dropdown
