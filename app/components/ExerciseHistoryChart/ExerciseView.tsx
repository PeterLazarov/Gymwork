import React, { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { translate } from 'app/i18n'

type Props = {
  children: ReactNode
  openSelect: () => void
  isExerciseSelected: boolean
}
const ExerciseView: React.FC<Props> = ({
  children,
  openSelect,
  isExerciseSelected,
}) => {
  return (
    <>
      {!isExerciseSelected && (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={openSelect}
        >
          <EmptyState text={translate('selectExerciseForData')} />
        </TouchableOpacity>
      )}
      {isExerciseSelected && children}
    </>
  )
}
export default ExerciseView
