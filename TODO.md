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
  - TrackView - fix whole form rerender for timer - KeyboardAvoiderView context is triggering. why??
  - TrackView - improve double rerendering
  - Review - Optimise render of history tab
  - Review - Optimise render of chart
  - ExerciseSelect - Optimise initial render
  - Flashlist -> data={workout.steps.slice()}. Figure out a better solution to fix rerendering after adding exercise
* Split screen over half is makes UI a mess
* UserFeedback -> Keyboard hides feedback save button
* keyboard avoiding view pushes the content over the header if th einput is on the bottom of screen
* grouping / measurement by rest
* Review button styles. Especially primary + disabled
* Standardize background usage (different screens currently use different background colors for some reason)
* Look into replacing 'draft' with mobx-utils createViewModel
* Look into https://reactnative.dev/docs/timers#interactionmanager for optimizing render time
* Make timer vibration work
* Timer duration not being visible as a countdown, just as a loader is not enough

Performance to beat -
100 workouts

- open app
- add a single record to bench
  LOG currentRecondCounter 611 - 1 loop
  LOG exerciseRecordsCount 145 - 1 loop
  -> LOG weakassCounter 145 - 3 loop

TOTAL - 1191 loops

time to add set 4s\

Save workout (with or without sets)
Workout duration + see in chart/history
Better comment UI
Workout programs

LOW PRIORITY

- perf: move styles to stylesheet objects
