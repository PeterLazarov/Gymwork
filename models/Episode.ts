import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'

import { withSetPropAction } from './helpers/withSetPropAction'

export const EpisodeModel = types
  .model('Episode')
  .props({
    guid: types.identifier,
    title: '',
    pubDate: '', // Ex: 2022-08-12 21:05:36
    link: '',
    author: '',
    thumbnail: '',
    description: '',
    content: '',
    categories: types.array(types.string),
  })
  .actions(withSetPropAction)
  .views(episode => ({
    get parsedTitleAndSubtitle() {
      const defaultValue = { title: episode.title?.trim(), subtitle: '' }

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Episode extends Instance<typeof EpisodeModel> {}
export interface EpisodeSnapshotOut extends SnapshotOut<typeof EpisodeModel> {}
export interface EpisodeSnapshotIn extends SnapshotIn<typeof EpisodeModel> {}
