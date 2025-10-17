import { FC, useEffect, useState } from "react";
import { FlatList, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native";

import { Button } from "@/components/Button"; // @demo remove-current-line
import { ListItem } from "@/components/ListItem";
import { Screen } from "@/components/Screen";
import { Text } from "@/components/Text";
import { useAuth } from "@/context/AuthContext"; // @demo remove-current-line
import { SelectExercise } from "@/db/schema";
import { useDB } from "@/db/useDB";
import { isRTL } from "@/i18n";
import type { AppStackScreenProps } from "@/navigators/navigationTypes"; // @demo remove-current-line
import { useAppTheme } from "@/theme/context";
import { $styles } from "@/theme/styles";
import type { ThemedStyle } from "@/theme/types";
import { useHeader } from "@/utils/useHeader"; // @demo remove-current-line
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle";

const welcomeLogo = require("@assets/images/logo.png")
const welcomeFace = require("@assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {} // @demo remove-current-line

// @demo replace-next-line export const WelcomeScreen: FC = function WelcomeScreen(
export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(
  _props, // @demo remove-current-line
) {
  const { themed, theme } = useAppTheme()
  const { drizzleDB } = useDB()
  const [exercises, setExercises] = useState<SelectExercise[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // @demo remove-block-start
  const { navigation } = _props
  const { logout } = useAuth()

  function goNext() {
    navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
  }

  useHeader(
    {
      rightTx: "common:logOut",
      onRightPress: logout,
    },
    [logout],
  )
  // @demo remove-block-end

  useEffect(() => {
    async function fetchExercises() {
      try {
        const result = await drizzleDB.query.exercises.findMany({
          orderBy: (exercises, { asc }) => [asc(exercises.name)],
        })
        setExercises(result)
      } catch (error) {
        console.error("Error fetching exercises:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExercises()
  }, [drizzleDB])

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$styles.flex1}>
      <View style={themed($topContainer)}>
        <Image style={themed($welcomeLogo)} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={themed($welcomeHeading)}
          text="Exercises"
          preset="heading"
        />
        <Text text="Choose an exercise to get started" preset="subheading" />
      </View>

      <View style={themed([$exerciseListContainer, $bottomContainerInsets])}>
        {isLoading ? (
          <Text text="Loading exercises..." style={themed($loadingText)} />
        ) : exercises.length === 0 ? (
          <Text text="No exercises found" style={themed($loadingText)} />
        ) : (
          <FlatList
            data={exercises}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ListItem
                text={item.name}
                bottomSeparator
                rightIcon="caretRight"
                onPress={() => {
                  console.log("Selected exercise:", item.name)
                  // TODO: Navigate to exercise detail screen
                }}
              />
            )}
            contentContainerStyle={themed($listContentContainer)}
          />
        )}
        {/* @demo remove-block-start */}
        <Button
          testID="next-screen-button"
          preset="reversed"
          tx="welcomeScreen:letsGo"
          onPress={goNext}
          style={themed($demoButton)}
        />
        {/* @demo remove-block-end */}
      </View>
    </Screen>
  )
}

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 0,
  paddingTop: spacing.lg,
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.md,
})

const $exerciseListContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingTop: spacing.md,
})

const $listContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
})

const $loadingText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
  paddingVertical: spacing.xl,
})

const $demoButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginHorizontal: spacing.lg,
  marginVertical: spacing.md,
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
})

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
