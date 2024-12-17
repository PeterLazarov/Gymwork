import React from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { EmptyLayout } from 'app/layouts/EmptyLayout'
import {
  Button,
  ButtonText,
  Header,
  Text,
  fontSize,
  spacing,
} from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'

export const WelcomeScreen: React.FC = observer(() => {
  const {
    stateStore,
    navStore: { navigate },
  } = useStores()

  function onStart() {
    stateStore.setProp('visitedWelcomeScreen', true)
    navigate('HomeStack')
  }

  return (
    <EmptyLayout>
      <Header>
        <Header.Title title={translate('welcome')} />
      </Header>

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
    </EmptyLayout>
  )
})

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
    justifyContent: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: fontSize.lg,
  },
})
