import { useDatabaseConnection } from './DBProvider'

const JotaiDatabaseLayer: React.FC = () => {
  const { workoutRepository, exerciseRepository } = useDatabaseConnection()

  useEffect(() => {
    workoutRepository
      .find({
        relations: {
          exercises: {
            sets: true,
            exercise: true,
          },
        },
      })
      .then(([workout]) => setWorkout(workout))
  }, [globalDateISO])

  return (
    <DatabaseConnectionProvider>
      <Slot />
    </DatabaseConnectionProvider>
  )
}

export default JotaiDatabaseLayer
