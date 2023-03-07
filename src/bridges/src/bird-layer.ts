/* eslint-disable lines-between-class-members */

import * as utils from  './../utils';

import {Bird} from './bird';
import {GamePlay} from './game-play';
import {Obj} from './engine/obj';

export interface IBirdProps {
  rotateDeg: number;
  xTravelTime: number;
  yTravelTime: number;
  initialX: number;
  initialY: number;
}

export class BirdLayer extends Obj {
  gamePlay: GamePlay;

  birds: Bird[];

  birdScreenSpeed: number;
  spawnInterval: number;

  constructor(gamePlay: GamePlay) {
    super();

    this.gamePlay = gamePlay;


    this.birds = [];
    this.birdScreenSpeed = 0;
    this.spawnInterval = this.gamePlay.config.birdSpawnInterval;

    this.createBird();
  }

  createBird() {
    const birdProps = this.defineDirection();

    const bird = new Bird(birdProps, this.gamePlay);
    bird.rotation = utils.degToRad(bird.rotateDeg);

    this.addChild(bird);
    this.birds.push(bird);
  }

  defineDirection(): IBirdProps {
    let rotateDeg: number;
    let yTravelTime: number;
    let initialY: number;

    const sign = utils.randomIntBetween(0, 1) === 1 ? 1 : -1;

    if (sign > 0) {
      rotateDeg = utils.randomIntBetween(15, 165);
      yTravelTime = this.gamePlay.config.birdSpeed;
      initialY = -100;
    } else {
      rotateDeg = utils.randomIntBetween(-165, -15);
      yTravelTime = -this.gamePlay.config.birdSpeed;
      initialY = this.gamePlay.config.height + 100;
    }

    const initialX = utils.randomIntBetween(100, this.gamePlay.realWidth - 100);

    const tan = Math.tan(utils.degToRad(rotateDeg));
    const xTravelTime = yTravelTime / tan;

    return {
      rotateDeg: rotateDeg,
      xTravelTime: xTravelTime,
      yTravelTime: yTravelTime,
      initialX: initialX,
      initialY: initialY,
    };
  }

  deleteBird(index: number, bird: Bird) {
    this.removeChild(bird);
    this.birds.splice(index, 1);
  }

  checkCoords(index: number, bird: Bird) {
    if (bird.rotateDeg > 0 && bird.y > this.gamePlay.config.height + 100) {
      this.deleteBird(index, bird);
    } else if (bird.y < -100) {
      this.deleteBird(index, bird);
    }
  }

  selfUpdate(dt: number) {
    for (const [index, bird] of this.birds.entries()) {
      bird.x += (dt * bird.xTravelTime) - (dt * this.birdScreenSpeed);
      bird.y += dt * bird.yTravelTime;

      this.checkCoords(index, bird);
    }

    this.spawnInterval -= dt;
    if (this.spawnInterval <= 0) {
      this.spawnInterval = this.gamePlay.config.birdSpawnInterval;
      this.createBird();
    }
  }
}
