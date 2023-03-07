/* eslint-disable lines-between-class-members */

import * as utils from  './../utils';

import {GamePlay} from './game-play';
import {IBirdProps} from './bird-layer';
import {Img} from './engine/img';
import {Obj} from './engine/obj';

export class Bird extends Obj {
  gamePlay: GamePlay;

  sprites: Img[];
  birdType: number;

  lastAnimFrame: number;
  currAnimFrame: number;
  framePass: number;

  isAnim: boolean;
  framesWithoutAnim: number;

  rotateDeg: number;
  xTravelTime: number;
  yTravelTime: number;

  constructor(birdProps: IBirdProps, gamePlay: GamePlay) {
    super();

    this.gamePlay = gamePlay;

    this.sprites = [];
    this.birdType = utils.randomIntBetween(1, 5);

    this.lastAnimFrame = 0;
    this.currAnimFrame = 0;
    this.framePass = 0;

    this.isAnim = true;
    this.framesWithoutAnim = this.gamePlay.config.numFramesWithoutBirdAnim;

    this.rotateDeg = birdProps.rotateDeg;
    this.xTravelTime = birdProps.xTravelTime;
    this.yTravelTime = birdProps.yTravelTime;
    this.x = birdProps.initialX;
    this.y = birdProps.initialY;


    for (let i = 1; i <= 8; i++) {
      const sprite = new Img(
          // eslint-disable-next-line max-len
          `${this.gamePlay.config.resourcesBase}img/birds/${this.birdType}/${i}.svg`,
          -0.5, -0.5,
      );

      sprite.visible = false;
      this.addChild(sprite);
      this.sprites.push(sprite);
    }

    this.sprites[0].visible = true;
  }

  animate() {
    if (this.framePass === 0) {
      this.sprites[this.lastAnimFrame].visible = false;
      this.sprites[this.currAnimFrame].visible = true;

      this.lastAnimFrame = this.currAnimFrame;
      this.currAnimFrame++;

      if (this.currAnimFrame >= this.sprites.length) {
        this.currAnimFrame = 0;
        this.isAnim = false;
      }

      this.framePass = 5;
    } else {
      this.framePass--;
    }
  }

  selfUpdate() {
    if (this.isAnim) {
      this.animate();
    } else {
      this.framesWithoutAnim--;

      if (this.framesWithoutAnim <= 0) {
        this.isAnim = true;
        this.framesWithoutAnim = this.gamePlay.config.numFramesWithoutBirdAnim;
      }
    }
  }
}
