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
* TrackView
  - fix whole form rerender for timer - KeyboardAvoiderView context is triggering. why??
  - improve double rerendering
* dev experience
  - ios emulator -> expo crash on code change in emulator
  - android device -> after code change rendering of StepHeader when no focusedStep error
  - ban conflicting/unused imports (ignite's colors)/i18n lib as opposed to app/i18n
* review
  - On jump to record set, scroll to set
  - Optimise render of history tab
  - Optimise render of chart
  - Workout historical stats screen with muscle areas and comments analysis
* darkMode
  - rename colors so that they're usable across both color schemes
* Template edit
  - steps list editting rearranging and or adding
* HorizontalScreenList > react-native-reanimated-carousel rolled back for FlatList version. Do we return? Keep header press bug in mind.
* keyboard avoiding view pushes the content over the header if th einput is on the bottom of screen
* Flashlist -> data={workout.steps.slice()}. Figure out a better solution to fix rerendering after adding exercise
* grouping / measurement by rest
* check out focusedExerciseRecords for supersets
* optimize useColors
* Review button styles. Especially primary + disabled
* EditTemplateForm should allow adding exercises/sets
* Standardize background usage (different screens currently use different background colors for some reason)

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
