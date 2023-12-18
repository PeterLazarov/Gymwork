import { useEffect, useRef, useState } from 'react'

import { useStores } from './helpers/useStores'

type Props = {
  children: React.ReactNode
}

let promise: Promise<void>

const DBStoreInitializer: React.FC<Props> = props => {
  const { exerciseStore, workoutStore } = useStores()

  promise = promise || exerciseStore.fetch().then(() => workoutStore.fetch())

  const [render, setRender] = useState(false)

  useEffect(() => {
    promise.then(() => {
      setTimeout(() => {
        setRender(true)
      }, 1000)
    })
  }, [])

  return render && props.children
}

export default DBStoreInitializer
