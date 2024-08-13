import { useEffect, useRef, useState } from 'react'

import { useStores } from './helpers/useStores'

type Props = {
  children: React.ReactNode
}

let promise: Promise<void>

const DBStoreInitializer: React.FC<Props> = props => {
  const { exerciseStore, workoutStore, stateStore } = useStores()

  promise = promise || exerciseStore.fetch().then(async () => {
    await new Promise(res => {
      setTimeout(() => {
        res(null)
      }, 1000);
    })
    
    await workoutStore.fetch()
  })

  const [render, setRender] = useState(false)

  useEffect(() => {
    promise.then(() => {
      setTimeout(() => {
        setRender(true)
        debugger
        console.log(JSON.stringify({ exerciseStore, workoutStore }, null, 2))
      }, 1000)
    })
  }, [])

  return render && props.children
}

export default DBStoreInitializer
