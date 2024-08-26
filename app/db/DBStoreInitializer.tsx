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
    const now = Date.now()
    promise.then(() => {
      setRender(true)
      console.log(`Time to render: ${((Date.now() - now) / 1000).toFixed(2)}s`)
    })
  }, [])

  if (!render) return null

  return children
}

export default DBStoreInitializer
