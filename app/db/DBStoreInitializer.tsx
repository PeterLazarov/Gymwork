import { useEffect, useRef, useState } from 'react'

import { useStores } from './helpers/useStores'
import { Text, View } from 'react-native'

type Props = {
  children: React.ReactNode
}

let promise: Promise<void>

const DBStoreInitializer: React.FC<Props> = ({ children }) => {
  const { exerciseStore, workoutStore, stateStore } = useStores()

  promise = promise || exerciseStore.fetch().then(() => workoutStore.fetch())

  const [render, setRender] = useState(false)

  useEffect(() => {
    promise.then(() => {
      setRender(true)
      console.log(JSON.stringify({ exerciseStore, workoutStore }, null, 2))
    })
  }, [])

  if (!render) return null

  return children
}

export default DBStoreInitializer
