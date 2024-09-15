- Timer
  - workout timer for today's workout
  - configurable duration based on exercise
- Exercise Edit
  - muscle areas plus icon is not implemented
  - edit exercise measureBy and groupBy
  - in UI toggle whether an exercise has rest measurement
- Exercise Select
  - how to delete exercises
- TrackView
  - fix whole form rerender for timer - KeyboardAvoiderView context is triggering. why??
  - timer doesn't start when open step and directly complete draft set without touching anything
  - every timer start is not stopping the previous ones making it impossible to stop and causing infinite rerenders
  - on step delete show an undo or a confirm button
  - improve double rerendering
- dev experience
  - ios emulator -> expo crash on code change in emulator
  - android device -> after code change rendering of StepHeader when no focusedStep error
- error logging
  - log only production errors
- WorkoutDayView
  - add overscroll for sets covered by the FAB
- review
  - remember the review tab previously selected e.g. records -> step track -> records
  - On jump to record set, scroll to set
- Workout Comments
  - what is third option picker? (condition?)
  - historical comments screen?
- HorizontalScreenList > react-native-reanimated-carousel rolled back for FlatList version. Do we return? Keep header press bug in mind.
- keyboard avoiding view pushes the content over the header if th einput is on the bottom of screen
- Workout historical stats screen with muscle areas and comments analysis
- Flashlist -> data={workout.steps.slice()}. Figure out a better solution to fix rerendering after adding exercise
- grouping / measurement by rest
- template steps list editting rearranging and or adding
- check out focusedExerciseRecords for supersets
- devEx : ban conflicting/unused imports (ignite's colors)/i18n lib as opposed to app/i18n
- darkMode: Text element default color?
- darkMode: rename colors so that they're usable across both color schemes

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
