/**
 * Script to generate exercises.json with pre-computed measurements
 * Run with: npx tsx src/db/expo/generateExercisesJson.ts
 */
import * as fs from "fs"
import * as path from "path"

type NormalizedEntry = {
  name: string
  images: string[]
  equipment?: string
  grip?: string
  position?: string
  stance?: string
  instructions: string[]
  tips?: string[]
  muscleAreas: string[]
  category: string
  muscles: string[]
}

type ExerciseSeedEntry = {
  name: string
  images: string[]
  equipment: string[]
  instructions: string[]
  tips: string[] | null
  muscles: string[]
  muscle_areas: string[]
  position: string | null
  stance: string | null
  is_favorite: boolean
  measurements: {
    weight: boolean
    reps: boolean
    duration: boolean
    speed: boolean
    distance: boolean
  }
}

const inputPath = path.join(__dirname, "exercisesAnimatic.json")
const outputPath = path.join(__dirname, "exercises.json")

const rawData = JSON.parse(fs.readFileSync(inputPath, "utf-8")) as Record<string, NormalizedEntry>

const exercises: ExerciseSeedEntry[] = Object.values(rawData).map(
  ({ name, muscles, category, images, instructions, muscleAreas, equipment, position, stance, tips }) => {
    const isCardio = muscleAreas.includes("Cardio")
    const hasWeightMeasurement = ["Resistance", "Free Weights"].includes(category) && !name.includes("Bodyweight")
    const hasDurationMeasurement = isCardio || name.includes("Hold")
    const hasSpeedMeasurement = false // TODO: toggle based on setting

    return {
      name,
      images,
      equipment: [equipment].filter(Boolean) as string[],
      instructions,
      tips: tips ?? null,
      muscles,
      muscle_areas: muscleAreas,
      position: position ?? null,
      stance: stance ?? null,
      is_favorite: false,
      measurements: {
        weight: hasWeightMeasurement,
        reps: !isCardio,
        duration: hasDurationMeasurement,
        speed: hasSpeedMeasurement,
        distance: isCardio,
      },
    }
  },
)

fs.writeFileSync(outputPath, JSON.stringify(exercises, null, 2))
console.log(`✅ Generated ${exercises.length} exercises to ${outputPath}`)
