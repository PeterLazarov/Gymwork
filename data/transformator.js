function query(data) {
  return _.chain(data['exercises'])
    .map(exercise => ({
      name: exercise.name,
      muscles: exercise.primaryMuscles,
      type: 'weight',
    }))
    .value()
}
