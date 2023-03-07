/* eslint-disable lines-between-class-members */
import {IConfig, TDynamicValuesConfig} from '../../config';

export class DynamicManager {
  currDuration: number = 0;

  config: IConfig;
  diffValues: Record<keyof TDynamicValuesConfig, number>;
  diffPerSec: Record<keyof TDynamicValuesConfig, number>;

  constructor(config: IConfig) {
    this.config = config;

    this.diffValues = {
      islandScale:
        config.dynamic.end.islandScale - config.dynamic.start.islandScale,
      islandSpeed:
        config.dynamic.end.islandSpeed - config.dynamic.start.islandSpeed,
    };

    this.diffPerSec = {
      islandScale:
        this.diffValues.islandScale / config.dynamic.durationToMax,
      islandSpeed:
        this.diffValues.islandSpeed / config.dynamic.durationToMax,
    };
  }

  update(dt: number) {
    this.currDuration += dt;

    if (
      !this.config.islandIsMoving &&
      this.currDuration > this.config.dynamic.durationForMovingIsland
    ) {
      this.config.islandIsMoving = true;
      this.currDuration = 0;
    }

    if (
      this.config.islandIsMoving &&
      this.currDuration < this.config.dynamic.durationToMax
    ) {
      this.config.islandScale += dt * this.diffPerSec.islandScale;
      this.config.islandSpeed += dt * this.diffPerSec.islandSpeed;
    }
  }

  restart() {
    this.currDuration = 0;

    this.config.islandIsMoving = false;
    this.config.islandScale = this.config.dynamic.start.islandScale;
    this.config.islandSpeed = this.config.dynamic.start.islandSpeed;
  }
}
