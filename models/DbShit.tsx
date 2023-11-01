import { useEffect } from 'react'

import { useStores } from './helpers/useStores'

type Props = {
  children: React.ReactNode
}
const DbShit: React.FC<Props> = props => {
  const { exerciseStore, workoutStore } = useStores()

  useEffect(() => {
    exerciseStore.fetch()
    // workoutStore.fetch()
  }, [])

  useEffect(console.log, exerciseStore.exercises)

  return props.children
}

export default DbShit
