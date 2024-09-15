import React from 'react'
import { ScrollView, TextStyle, View, ViewStyle, Text } from 'react-native'

// TODO use our colors
import { colors, spacing } from '../theme'
import { Button, ButtonText } from 'designSystem'

export interface ErrorDetailsProps {
  error: Error | null
  resetError: () => void
}

/**
 * Renders the error details screen.
 * @param {ErrorDetailsProps} props - The props for the `ErrorDetails` component.
 * @returns {JSX.Element} The rendered `ErrorDetails` component.
 */
export const ErrorDetails: React.FC<ErrorDetailsProps> = ({
  error,
  resetError,
}) => {
  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <ScrollView
        style={$errorSection}
        contentContainerStyle={$errorSectionContentContainer}
      >
        <Text style={$errorContent}>{`${error}`.trim()}</Text>
        <Text style={$errorBacktrace}>{`${error?.stack ?? ''}`.trim()}</Text>
      </ScrollView>

      <Button
        variant="critical"
        onPress={resetError}
      >
        <ButtonText variant="critical">Reset</ButtonText>
      </Button>
    </View>
  )
}

const $errorSection: ViewStyle = {
  flex: 2,
  backgroundColor: colors.separator,
  marginVertical: spacing.md,
  borderRadius: 6,
}

const $errorSectionContentContainer: ViewStyle = {
  padding: spacing.md,
}

const $errorContent: TextStyle = {
  color: colors.error,
}

const $errorBacktrace: TextStyle = {
  marginTop: spacing.md,
  color: colors.textDim,
}
