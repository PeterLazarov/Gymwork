function query(data) {
  return _.chain(data['exercises'])
    .map(exercise => ({
      name: exercise.name,
      category: exercise.primaryMuscles[0],
      type: 'weight',
    }))
    .value()
}
