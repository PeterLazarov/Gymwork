import React, { useState } from "react"
import { ScrollView, View } from "react-native"

import { Text, Button, fontSize, useColors, spacing } from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"

export interface ErrorDetailsProps {
  error: Error | null
  resetError: () => void
}

export const ErrorDetails: React.FC<ErrorDetailsProps> = ({ error, resetError }) => {
  const colors = useColors()
  const [detailsVisible, setDetailsVisible] = useState(false)

  return (
    <BaseLayout>
      <Text
        style={{
          color: colors.onError,
          fontSize: fontSize.xl,
          textAlign: "center",
        }}
      >
        Error found
      </Text>
      <Text
        style={{
          textAlign: "center",
        }}
      >
        We are already notified and will try to fix it soon.
      </Text>
      <Button
        variant="neutral"
        onPress={() => setDetailsVisible((oldVisible) => !oldVisible)}
        text="Show / Hide error details"
      />

      <View style={{ flex: 1, gap: spacing.md }}>
        {detailsVisible && (
          <>
            <Text
              style={{
                textAlign: "center",
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
                {`${error?.stack ?? ""}`.trim()}
              </Text>
            </ScrollView>
          </>
        )}
      </View>
      <Button
        variant="critical"
        onPress={resetError}
        text="Reset"
      />
    </BaseLayout>
  )
}
