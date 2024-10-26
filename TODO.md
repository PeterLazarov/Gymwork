- Before Android store closed test
  - reporting - log only production errors

* Timer
  - workout timer for today's workout
  - configurable duration based on exercise
* Exercise Edit
  - muscle areas plus icon is not implemented
  - edit exercise measureBy and groupBy
* Exercise Select
  - how to delete exercises
* dev experience
  - ban conflicting/unused imports (ignite's colors)/i18n lib as opposed to app/i18n
* review
  - show/hide and rearrange review tabs
  - On jump to record set, scroll to set
  - Workout historical stats screen with muscle areas and comments analysis
* Template edit
  - steps list editting rearranging and or adding exercises
* WorkoutDay
  - Make UI more clear if user is editting on a different day from today
* optimisation
  - optimize useColors
  - Review - Optimise render of history tab
  - Review - Optimise render of chart
  - ExerciseSelect - Optimise initial render
  - Flashlist -> data={workout.steps.slice()}. Figure out a better solution to fix rerendering after adding exercise
* default Band Assisted exercises to moreIsBetter = false
* Split screen over half is makes UI a mess
* grouping / measurement by rest
* Review button styles. Especially primary + disabled
* Standardize background usage (different screens currently use different background colors for some reason)
* Look into https://reactnative.dev/docs/timers#interactionmanager for optimizing render time
* Timer duration not being visible as a countdown, just as a loader is not enough
* Handle 2-a-day workouts
* Fix workout timer issue where adding a set to a workout on another day leads to super long workout duration
* Look into Android 15 edge-to-edge handling https://github.com/zoontek/react-native-edge-to-edge
* Make modals look more consistent
* copy Workout should not copy workout duration
* Feedback screen should also send the screen it was clicked from
* Colors/Dots per muscle group (in Calendar?) https://youtu.be/VkHWqq715Qc?si=MrAj21LW3CylHDBf&t=98
* Seed templates like Strong app https://youtu.be/VkHWqq715Qc?si=k3VepIvmuQXj-cBC&t=164
* Workout summary card like Strong app https://youtu.be/VkHWqq715Qc?si=4vyHtvnlXpxzMSSl&t=169
* Integrated 1RM calc
* Exercise instructions / visualisations
* Bodyweight exercises?
* Muscle icons (like Hevy?) https://youtu.be/VkHWqq715Qc?si=z59DycSLqc7AcWMe&t=214

Save workout (with or without sets)
Workout duration + see in chart/history
Better comment UI
Workout programs

LOW PRIORITY

- perf: move styles to stylesheet objects

Experiments:

1. Inline editing -> do try
   Compact entry (clicking on a value in a set opens only the control to edit that value)

Ways to make the app crash:

- Add a new translation string to en.ts
- Make ANY change in the store (could just be an added comment)
