import { useSettings } from "@/db/hooks"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"

export type TargetProgress = {
  total: string | number
  done: string | number
  left: string | number
  unit: string
  met: boolean
  remaining: number
}

export function useTargetProgress(step: WorkoutStepModel): TargetProgress | null {
  const { data: settings } = useSettings()
  const manualSetCompletion = settings?.manual_set_completion ?? false

  if (!step.hasTarget) {
    return null
  }

  const remaining = step.getTargetRemainingBase(manualSetCompletion)

  return {
    total: step.getTargetTotalDisplay(),
    done: step.getTargetDoneDisplay(manualSetCompletion),
    left: step.getTargetLeftDisplay(manualSetCompletion),
    unit: step.getTargetUnit(),
    met: remaining <= 0,
    remaining,
  }
}
