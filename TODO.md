- Timer
  - workout timer for today's workout
  - configurable duration based on exercise
- Exercise Edit
  - muscle areas plus icon is not implemented
  - edit exercise measureBy and groupBy
- Exercise Select
  - how to delete exercises
  - swipe tabs are confused on header press 
- TrackView
  - click on empty space OR back to remove focus on set
  - rerender list immeadtely after set warmup change
  - scroll to bottom of sets 
- superset
  - improve track rerendering
  - fix records for second exercise
  - rerender chart on exercise change
- keyboard avoiding view pushes the content over the header if th einput is on the bottom of screen
- reasonable seed data rest periods & createdAt
- On jump to record set, scroll to set
- improve and rearrange feedback UI
- Workout historical stats screen with muscle areas and comments analysis
- Flashlist -> data={workout.steps.slice()}. Figure out a better solution to fix rerendering after adding exercise
- optimise calendar rendering
- grouping / measurement by rest
- fix Speed chart miscalculation
- template steps list editting rearranging and or adding
- Alphabetically nubmer supersets if multiple in same workout?

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
