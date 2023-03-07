/* eslint-disable lines-between-class-members */

import * as utils from  './../utils';

import {GamePlay} from './game-play';
import {Img} from './engine/img';
import {Obj} from './engine/obj';

export type IlandType = 'motionless' | 'movable';
export class Island extends Obj {
  gamePlay: GamePlay;

  iniX: number;
  iniY: number;

  spriteType: IlandType;
  spriteNum: number;
  spriteHeight!: number;
  spriteWidth!: number;

  sprite: Img;

  isMoving: boolean;
  directionNum: number;
  isPass: boolean;

  constructor(
      gamePlay: GamePlay,
      spriteType: IlandType,
      x: number,
      y: number,
  ) {
    super();

    this.gamePlay = gamePlay;

    this.x = this.iniX = x;
    this.y = this.iniY = y;

    this.spriteType = spriteType;
    if (this.spriteType === 'motionless') {
      this.spriteNum = utils.randomIntBetween(1, 6);
    } else {
      this.spriteNum = utils.randomIntBetween(1, 4);
    }

    this.scaleY = this.gamePlay.config.islandScale;

    this.spriteHeight = this.scaleY * 434;
    this.spriteWidth = 434;

    this.sprite = new Img(
        // eslint-disable-next-line max-len
        `${this.gamePlay.config.resourcesBase}img/islands/${this.spriteType}/${this.spriteNum}.svg`,
        -0.5, -0.5,
    );
    this.addChild(this.sprite);

    this.isMoving = false;
    this.directionNum = utils.randomIntBetween(-1, 0) === 0 ? 1 : -1;
    this.isPass = false;
  }

  selfUpdate(dt: number): void {
    if (this.isMoving) {
      this.y += dt * this.directionNum * this.gamePlay.config.islandSpeed;

      if (
        this.y < this.iniY - 200 && this.directionNum !== 1 ||
        this.y > this.iniY + 200 && this.directionNum !== -1
      ) {
        this.directionNum *= -1;
      }
    }
  }
}
