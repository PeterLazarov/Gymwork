import { FC } from "react"
import { StyleSheet, View } from "react-native"

import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { BaseLayout } from "@/layouts/BaseLayout"
import { Button, Text, Header, fontSize, spacing } from "@/designSystem"
import { translate } from "@/utils"
import { useSetting } from "@/context/SettingContext"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = ({ navigation }) => {
  // useHeader(
  //   {
  //     rightTx: "common:logOut",
  //     onRightPress: logout,
  //   },
  //   [logout],
  // )
  // @demo remove-block-end

  const { setVisitedWelcomeScreen } = useSetting()

  function onStart() {
    setVisitedWelcomeScreen(true)
    navigation.navigate("Workout")
  }

  return (
    <BaseLayout>
      <Header>
        <Header.Title title={translate("welcome")} />
      </Header>
      <View style={styles.content}>
        <Text style={[styles.text, styles.bold]}>Thank you for trying our product!</Text>
        <Text style={styles.text}>
          We're still in the testing phase and your feedback is very important to us.
        </Text>
        <Text style={styles.text}>
          If you encounter any areas for improvement or issues we may have missed, please share them
          with us through the “<Text style={styles.bold}>Give Feedback</Text>” option in the header
          menu.
        </Text>
        <Text style={[styles.text, styles.bold]}>We hope you have an awesome time workout out!</Text>
      </View>
      <Button
        variant="primary"
        onPress={onStart}
        text={translate("startWorkingOut")}
      />
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
    justifyContent: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  text: {
    fontSize: fontSize.lg,
  },
})
