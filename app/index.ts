// DATAGEN

import { getSnapshot } from 'mobx-state-tree'
import { RootStoreModel } from './db/stores/RootStore.ts'
import { writeFileSync } from 'node:fs'

async function main() {
  const root = RootStoreModel.create({
    exerciseStore: {},
    workoutStore: {},
    stateStore: {},
    recordStore: {},
    settingsStore: {},
    timerStore: {},
  })

  await root.initializeStores()

  return root
}

main()
  .then(root => {
    const snapshot = getSnapshot(root)
    writeFileSync('snapshot.json', JSON.stringify(snapshot, null, 2))
    console.log('Snapshot saved to snapshot.json')
  })
  .catch(error => {
    console.error('Error initializing stores:', error)
  })
