import { useEffect, useState } from 'react'

import { useStores } from './helpers/useStores'

type Props = {
  children: React.ReactNode
}

let promise: Promise<void>

const DBStoreInitializer: React.FC<Props> = ({ children }) => {
  const rootStore = useStores()

  promise = promise || rootStore.initializeStores()

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
