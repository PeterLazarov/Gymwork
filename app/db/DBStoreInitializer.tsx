import { useEffect, useState } from 'react'

import { useStores } from './helpers/useStores'

type Props = {
  children: React.ReactNode
}

let promise: Promise<void>

const DBStoreInitializer: React.FC<Props> = ({ children }) => {
  const { exerciseStore, workoutStore } = useStores()

  promise = promise || exerciseStore.fetch().then(() => workoutStore.fetch())

  const [render, setRender] = useState(false)

  useEffect(() => {
    promise.then(() => {
      setRender(true)
    })
  }, [])

  if (!render) return null

  return children
}

export default DBStoreInitializer
