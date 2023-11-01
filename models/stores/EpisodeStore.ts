import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import * as storage from '../../utils/storage'
import { Episode, EpisodeModel, EpisodeSnapshotIn } from '../Episode'
import { withSetPropAction } from '../helpers/withSetPropAction'

export const EpisodeStoreModel = types
  .model('EpisodeStore')
  .props({
    episodes: types.array(EpisodeModel),
    favorites: types.array(types.reference(EpisodeModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetchEpisodes() {
      setTimeout(async () => {
        const episodes = await storage.load<EpisodeSnapshotIn[]>('episodes')
        store.setProp('episodes', episodes)
      }, 4000)
    },
    addFavorite(episode: Episode) {
      store.favorites.push(episode)
    },
    removeFavorite(episode: Episode) {
      store.favorites.remove(episode)
    },
  }))
  .views(store => ({
    get episodesForList() {
      return store.favoritesOnly ? store.favorites : store.episodes
    },

    hasFavorite(episode: Episode) {
      return store.favorites.includes(episode)
    },
  }))
  .actions(store => ({
    toggleFavorite(episode: Episode) {
      if (store.hasFavorite(episode)) {
        store.removeFavorite(episode)
      } else {
        store.addFavorite(episode)
      }
    },
  }))

export interface EpisodeStore extends Instance<typeof EpisodeStoreModel> {}
export interface EpisodeStoreSnapshot
  extends SnapshotOut<typeof EpisodeStoreModel> {}

// @demo remove-file
