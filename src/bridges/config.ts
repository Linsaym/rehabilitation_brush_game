import * as configs from './difficulty';

type TSound = {
  src: string;
  volume: number;
  loop: boolean;
}

export type TDynamicValuesConfig = {
  islandSpeed: number;
  islandScale: number;
}

type TDynamicConfig = {
  durationToMax: number; // is sec
  durationForMovingIsland: number;

  start: TDynamicValuesConfig; // start values
  end: TDynamicValuesConfig; // end values
};

export interface IConfig {
  width: number;
  height: number;


  isTraining: boolean;
  isDynamic: boolean;

  birdSpeed: number;
  islandSpeed: number;
  carSpeed: number;
  bgSpeed: number;

  bridgeRotateSpeed: number;
  birdSpawnInterval: number;
  numFramesWithoutBirdAnim: number;

  islandScale: number;
  islandIsMoving: boolean;

  hitPoints: number;

  dynamic: TDynamicConfig;

  resourcesBase: string;
  sound: Record<string, TSound>;
}

export const getConfig = (isTraining: boolean): IConfig => {
  const config: IConfig = {...configs.base};

  configs.setDynamic(config);
  config.isTraining = isTraining;

  return config;
};
