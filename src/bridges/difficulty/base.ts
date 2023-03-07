import {IConfig} from '../config';

export const resourcesBase = '/bridges/';

export const base: IConfig = {
  width: 2560,
  height: 1440,

  isTraining: true,
  isDynamic: false,

  birdSpeed: 100,
  islandSpeed: 50,
  carSpeed: 200,
  bgSpeed: 50,

  bridgeRotateSpeed: 40,
  birdSpawnInterval: 15,
  numFramesWithoutBirdAnim: 60,

  islandScale: 1,
  islandIsMoving: false,

  hitPoints: 3,

  dynamic: {
    durationToMax: 240,

    durationForMovingIsland: 60,

    start: {
      islandScale: 1,
      islandSpeed: 50,
    },
    end: {
      islandScale: 0.8,
      islandSpeed: 150,
    },
  },

  resourcesBase: resourcesBase,

  sound: {
    music: {
      src: `${resourcesBase}snd/music.mp3`,
      volume: 0.3,
      loop: true,
    },
    waves: {
      src: `${resourcesBase}snd/waves.mp3`,
      volume: 0.2,
      loop: true,
    },
    car: {
      src: `${resourcesBase}snd/car.wav`,
      volume: 0.5,
      loop: true,
    },
    carMoving: {
      src: `${resourcesBase}snd/carMoving.wav`,
      volume: 1,
      loop: false,
    },
    wrongConstruction: {
      src: `${resourcesBase}snd/wrongConstruction.wav`,
      volume: 1,
      loop: false,
    },
    timer: {
      src: `${resourcesBase}snd/timer.wav`,
      volume: 0.6,
      loop: true,
    },
    wood: {
      src: `${resourcesBase}snd/wood.mp3`,
      volume: 1,
      loop: true,
    },
  },
};
