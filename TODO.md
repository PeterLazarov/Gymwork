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
  - rest timer doesn't stop on stop button press
  - .5 reps are possible
  - on step delete show an undo or a confirm button
- superset
  - improve track rerendering
- dev experience
  - ios emulator -> expo crash on code change in emulator
  - android device -> after code change rendering of StepHeader when no focusedStep error
- error logging
  - fix android build crash
  - log only production errors
- WorkoutDayView
  - add overscroll for sets covered by the FAB
  - changing an exercise name doesn't change the cards until the cards array is changed
- review
  - remember the review tab previously selected e.g. records -> step track -> records
  - in chart an exercise with 0kg is not shown
- after successful import / export show a 'success' toast 
- HorizontalScreenList > react-native-reanimated-carousel rolled back for FlatList version. Do we return? Keep header press bug in mind.
- keyboard avoiding view pushes the content over the header if th einput is on the bottom of screen
- reasonable seed data rest periods & createdAt
- On jump to record set, scroll to set
- improve and rearrange feedback UI
- Workout historical stats screen with muscle areas and comments analysis
- Flashlist -> data={workout.steps.slice()}. Figure out a better solution to fix rerendering after adding exercise
- optimise calendar rendering
- grouping / measurement by rest
- template steps list editting rearranging and or adding
- In exercise track menu, Edit exercise and especially Remove exercise could be thought of as workout scoped. They are not.
- check out focusedExerciseRecords for supersets
- History is broken?

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
