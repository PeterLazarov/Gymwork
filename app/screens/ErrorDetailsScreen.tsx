import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { SafeLayout } from 'app/layouts/SafeLayout'
import { Button, ButtonText, fontSize, Text } from 'designSystem'

export interface ErrorDetailsProps {
  error: Error | null
  resetError: () => void
}

/**
 * Renders the error details screen.
 * @param {ErrorDetailsProps} props - The props for the `ErrorDetails` component.
 * @returns {JSX.Element} The rendered `ErrorDetails` component.
 */
export const ErrorDetailsScreen: React.FC<ErrorDetailsProps> = ({
  error,
  resetError,
}) => {
  const {
    theme: { colors, spacing },
  } = useAppTheme()
  const [detailsVisible, setDetailsVisible] = useState(false)

  return (
    <SafeLayout style={{ gap: spacing.md, paddingHorizontal: spacing.xs }}>
      <Text
        style={{
          color: colors.onError,
          fontSize: fontSize.xl,
          textAlign: 'center',
        }}
      >
        Error found
      </Text>
      <Text
        style={{
          textAlign: 'center',
        }}
      >
        We are already notified and will try to fix it soon.
      </Text>
      <Button
        variant="neutral"
        onPress={() => setDetailsVisible(oldVisible => !oldVisible)}
      >
        <ButtonText variant="neutral">Show / Hide error details</ButtonText>
      </Button>

      <View style={{ flex: 1, gap: spacing.md }}>
        {detailsVisible && (
          <>
            <Text
              style={{
                textAlign: 'center',
              }}
            >
              {`${error}`.trim()}
            </Text>
            <ScrollView
              style={{
                flex: 2,
                backgroundColor: colors.surface,
                borderRadius: 6,
              }}
              contentContainerStyle={{
                padding: spacing.sm,
              }}
            >
              <Text
                style={{
                  backgroundColor: colors.surface,
                }}
              >
                {`${error?.stack ?? ''}`.trim()}
              </Text>
            </ScrollView>
          </>
        )}
      </View>
      <Button
        variant="critical"
        onPress={resetError}
      >
        <ButtonText variant="critical">Reset</ButtonText>
      </Button>
    </SafeLayout>
  )
}
