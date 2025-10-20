import { muscleAreaToMusclesMapping, muscleToMuscleAreasMapping } from "@/constants/muscleMappings"

export const syncMuscleAreasFromMuscles = (
  selectedMuscles: string[],
  currentMuscleAreas: string[],
): string[] => {
  const muscleAreasFromMuscles = new Set<string>()
  selectedMuscles.forEach((muscle) => {
    const relatedMuscleAreas = muscleToMuscleAreasMapping[muscle] || []
    relatedMuscleAreas.forEach((area) => muscleAreasFromMuscles.add(area))
  })

  const updatedMuscleAreas = currentMuscleAreas.filter((area) => {
    const musclesInArea = muscleAreaToMusclesMapping[area] || []
    return musclesInArea.some((muscle) => selectedMuscles.includes(muscle))
  })

  muscleAreasFromMuscles.forEach((area) => {
    const musclesInArea = muscleAreaToMusclesMapping[area] || []
    const allMusclesSelected = musclesInArea.every((muscle) => selectedMuscles.includes(muscle))
    if (allMusclesSelected && !updatedMuscleAreas.includes(area)) {
      updatedMuscleAreas.push(area)
    }
  })

  return updatedMuscleAreas
}

export const syncMusclesFromMuscleAreas = (
  selectedMuscleAreas: string[],
  currentMuscles: string[],
): string[] => {
  let updatedMuscles = [...currentMuscles]

  selectedMuscleAreas.forEach((area) => {
    const musclesInArea = muscleAreaToMusclesMapping[area] || []
    musclesInArea.forEach((muscle) => {
      if (!updatedMuscles.includes(muscle)) {
        updatedMuscles.push(muscle)
      }
    })
  })

  updatedMuscles = updatedMuscles.filter((muscle) => {
    const relatedMuscleAreas = muscleToMuscleAreasMapping[muscle] || []
    return relatedMuscleAreas.some((area) => selectedMuscleAreas.includes(area))
  })

  return updatedMuscles
}
