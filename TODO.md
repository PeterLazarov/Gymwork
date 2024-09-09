- Update exercice screen -> muscle areas plus icon is not implemented
- keyboard avoiding view pushes the content over the header if th einput is on the bottom of screen
- Timer
  - workout timer for today's workout
  - configurable duration based on exercise
- edit exercise measureBy and groupBy
- step stack view -> click on empty space OR back to remove focus on set
- reasonable seed data rest periods & createdAt
- superset
  - improve track rerendering
  - fix records for second exercise
  - rerender chart on exercise change
  - have draft set for all exercises not jsut the first one
- On exercise screen scroll to bottom
- On jump to record set, scroll to set
- improve and rearrange feedback UI
- add some kind of historical comments view (swipe left from comments screen?)
- Duration unit 
  - fix duration unit change (for Set list we use hh:mm:ss format not a unit)
  - remove duration unit change
- Flashlist -> data={workout.steps.slice()}. Figure out a better solution to fix rerendering after adding exercise
- optimise calendar rendering
- grouping / measurement by rest
- fix Speed chart miscalculation
- template steps list editting
- how to delete exercises
- IncrementNumericEditor remove unselected border bottom
- revert swipe screens
- swipe tab are messy ion header press 
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
