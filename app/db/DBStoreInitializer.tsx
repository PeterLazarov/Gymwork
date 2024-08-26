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
