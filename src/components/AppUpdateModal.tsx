import { Button, Card, Divider, Modal, Text } from "@/designSystem"
import { spacing } from "@/designSystem/tokens"
import { useAppUpdate } from "@/hooks/useAppUpdate"
import { ScrollView, View } from "react-native"

export const AppUpdateModal = () => {
  const { updateAvailable, latestVersion, newReleases, dismissUpdate, performUpdate } =
    useAppUpdate()

  if (!updateAvailable) return null

  const hasReleaseNotes = newReleases.some((r) => r.notes)

  return (
    <Modal
      open={updateAvailable}
      onClose={dismissUpdate}
      containerStyle={{ justifyContent: "center", padding: spacing.md }}
    >
      <Card
        header={<Modal.Header title="Update Available" />}
        content={
          <View style={{ gap: spacing.md }}>
            <Text>
              A new version of the app is available{latestVersion ? ` (${latestVersion})` : ""}.
              Update now to get the latest features and improvements.
            </Text>

            {hasReleaseNotes && (
              <View style={{ gap: spacing.xs }}>
                <Divider
                  orientation="horizontal"
                  variant="neutral"
                />
                <Text style={{ fontWeight: "bold" }}>What's New:</Text>
                <ScrollView style={{ maxHeight: 250 }}>
                  <View style={{ gap: spacing.sm }}>
                    {newReleases.map((release) =>
                      release.notes ? (
                        <View
                          key={release.version}
                          style={{ gap: spacing.xxs }}
                        >
                          <Text style={{ fontWeight: "600" }}>v{release.version}</Text>
                          <Text style={{ opacity: 0.8 }}>{release.notes}</Text>
                        </View>
                      ) : null
                    )}
                  </View>
                </ScrollView>
                <Divider
                  orientation="horizontal"
                  variant="neutral"
                />
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: spacing.sm,
                marginTop: spacing.xs,
              }}
            >
              <Button
                variant="neutral"
                onPress={dismissUpdate}
                text="Not now"
                style={{ flex: 1 }}
              />
              <Button
                variant="primary"
                onPress={performUpdate}
                text="Update"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        }
      />
    </Modal>
  )
}
