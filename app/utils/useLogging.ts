import * as Sentry from '@sentry/react-native'
import { autorun } from 'mobx'
import { onAction } from 'mobx-state-tree'
import { useEffect, useRef } from 'react'

import { useStores } from 'app/db/helpers/useStores'

export const useLogging = () => {
  const rootStore = useStores()
  const { stateStore, settingsStore } = rootStore

  const stateStoreRef = useRef(stateStore)
  const settingsStoreRef = useRef(settingsStore)
  const lastActionRef = useRef<string>()

  useEffect(() => {
    const disposeLastActionListener = onAction(rootStore, action => {
      lastActionRef.current = JSON.stringify(action, undefined, 2)
    })

    // Use autorun to observe changes in stateStore reactively
    const dispose = autorun(() => {
      // Update the ref with the latest stateStore snapshot
      stateStoreRef.current = stateStore
      settingsStoreRef.current = settingsStore
    })

    // Clean up autorun when the component unmounts
    return () => {
      dispose()
      disposeLastActionListener()
    }
  }, [stateStore])

  Sentry.init({
    dsn: 'https://47527b4456a64f3092182f3bed5cb2f9@app.glitchtip.com/8105',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    environment: 'production',
    _experiments: {
      // profilesSampleRate is relative to tracesSampleRate.
      // Here, we'll capture profiles for 100% of transactions.
      profilesSampleRate: 1.0,
    },
  })

  Sentry.addEventProcessor(function (event, hint) {
    event.extra = {
      state: stateStoreRef.current,
      settings: settingsStoreRef.current,
      lastAction: lastActionRef.current,
    }
    // returning `null` will drop the event
    return event
  })
}
