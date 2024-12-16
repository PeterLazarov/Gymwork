import { IStateTreeNode, SnapshotIn } from 'mobx-state-tree'

/**
 * Allows editing multiple properties at once
 */
export const withMergeUpdateAction = <T extends IStateTreeNode>(
  mstInstance: T
) => ({
    mergeUpdate(update: Partial<SnapshotIn<T>>) {
      Object.assign(mstInstance, update)
    },
  })
