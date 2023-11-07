import { useEffect } from 'react'

import { useStores } from './helpers/useStores'

type Props = {
  children: React.ReactNode
}
const DBStoreInitializer: React.FC<Props> = props => {
  const { exerciseStore, workoutStore } = useStores()

  useEffect(() => {
    exerciseStore.fetch()
    workoutStore.fetch()
  }, [])

  return props.children
}

export default DBStoreInitializer
