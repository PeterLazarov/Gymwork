import { useEffect, useRef, useState } from 'react'

import { useStores } from './helpers/useStores'

type Props = {
  children: React.ReactNode
}

let promise: Promise

const DBStoreInitializer: React.FC<Props> = props => {
  const { exerciseStore, workoutStore, stateStore, timeStore } = useStores()

  promise =
    promise || Promise.all([exerciseStore.fetch(), workoutStore.fetch()])

  const [render, setRender] = useState(false)

  useEffect(() => {
    promise.then(() => {
      setTimeout(() => {
        setRender(true)
      })
    })
  }, [])

  return render && props.children
}

export default DBStoreInitializer
