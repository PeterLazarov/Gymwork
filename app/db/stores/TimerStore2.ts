import { Duration } from "luxon";
import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const TimerStore2Model = types
  .model("TimeStore")
  .props({
    isRunning: false,
    restDuration: 0, // ms ! 0 is not a great default

    startedAt: 0, // timestamp
    stoppedAt: 0,
    timeElapsed: 0,
  })
  .views((self) => ({
    get timeElapsedFormatted() {
      console.log(self.timeElapsed);
      return Duration.fromMillis(self.timeElapsed);
    },
  }))
  .actions((self) => {
    let intervalHandle: NodeJS.Timeout | undefined;

    return {
      /** Timer Duration in milliseconds */
      start(restDuration: Duration) {
        self.restDuration = restDuration.as("seconds");
        self.startedAt = Date.now();
        intervalHandle = setInterval(this._updateTime, 1000);

        self.isRunning = true; // TODO should be a getter
      },
      //   ! not pause
      stop() {
        this._updateTime();
        if (intervalHandle) {
          clearInterval(intervalHandle);
          intervalHandle = undefined;
        }

        self.isRunning = false;
      },
      clear() {
        self.startedAt = 0;
      },
      _updateTime() {
        self.timeElapsed = Date.now() - self.startedAt;
        console.log(self.timeElapsed);
      },
    };
  });

export interface TimeStore extends Instance<typeof TimerStore2Model> {}
export interface TimeStoreSnapshot
  extends SnapshotOut<typeof TimerStore2Model> {}
