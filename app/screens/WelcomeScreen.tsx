import { useNavigation, type StaticScreenProps } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import {
  Button,
  ButtonText,
  HeaderRight,
  HeaderTitle,
  Text,
  fontSize,
  spacing,
} from 'designSystem'
import { Screen } from '@/components/ignite'

export type WelcomeScreenProps = StaticScreenProps<{}>

export const WelcomeScreen: React.FC<WelcomeScreenProps> = observer(() => {
  const { stateStore } = useStores()

  const { navigate } = useNavigation()

  function onStart() {
    stateStore.setProp('visitedWelcomeScreen', true)
    navigate('Home')
  }

  return (
    <Screen
      safeAreaEdges={['bottom']}
      contentContainerStyle={{ flex: 1 }}
    >
      <HeaderTitle title={translate('welcome')} />

      <View style={styles.content}>
        <Text style={[styles.text, styles.bold]}>
          Thank you for trying our product!
        </Text>
        <Text style={styles.text}>
          We're still in the testing phase and your feedback is very important
          to us.
        </Text>
        <Text style={styles.text}>
          If you encounter any areas for improvement or issues we may have
          missed, please share them with us through the “
          <Text style={styles.bold}>Give Feedback</Text>” option in the header
          menu.
        </Text>
        <Text style={[styles.text, styles.bold]}>
          We hope you have an awesome time Gymworking!
        </Text>
      </View>

      <Button
        variant="primary"
        onPress={onStart}
      >
        <ButtonText variant="primary">
          {translate('startGymworking')}
        </ButtonText>
      </Button>
    </Screen>
  )
})

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  text: {
    fontSize: fontSize.lg,
  },
})
