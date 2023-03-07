/* eslint-disable lines-between-class-members */

import * as utils from  './../utils';

import {GamePlay} from './game-play';
import {Img} from './engine/img';
import {Obj} from './engine/obj';
import {resourcesBase} from '../difficulty';

export class Car extends Obj {
  gamePlay: GamePlay;

  carType: number;
  sprites: Img[];

  isAnim: boolean;
  lastSpriteIndex: number;
  currSpriteIndex: number;
  framePass: number;

  smokeObjs: Smoke[];
  isSmokeAnim: boolean;
  smokeFramePass: number;

  isRotate: boolean;
  neededRad: number;
  currRad: number;
  isMoveDiagonally: boolean;
  speed: number;
  islandY: number;
  isMoveForward: boolean;

  constructor(gamePlay: GamePlay) {
    super();

    this.gamePlay = gamePlay;
    this.x = this.gamePlay.islandCenterLeftOffset;

    this.carType = utils.randomIntBetween(1, 5);
    this.sprites = [];

    for (let i = 1; i <= 3; i++) {
      const sprite = new Img(
          // eslint-disable-next-line max-len
          `${this.gamePlay.config.resourcesBase}img/cars/${this.carType}/${i}.svg`,
          -0.5, -0.5,
      );

      sprite.visible = false;
      this.addChild(sprite);
      this.sprites.push(sprite);
    }

    this.sprites[0].visible = true;
    this.isAnim = false;

    this.lastSpriteIndex = 0;
    this.currSpriteIndex = 0;
    this.framePass = 0;

    this.smokeObjs = [];

    for (let i = 1; i <= 3; i++) {
      const smokeObj = new Smoke(i % 2 === 0 ? -1 : 1);

      this.addChild(smokeObj.sprite);
      this.smokeObjs.push(smokeObj);
    }

    this.isSmokeAnim = true;
    this.smokeFramePass = 90;

    this.isRotate = false;
    this.neededRad = 0;
    this.currRad = 0;
    this.isMoveForward = false;

    this.isMoveDiagonally = false;
    this.speed = 0;
    this.islandY = this.gamePlay.config.height / 2;
  }

  animate() {
    if (this.framePass < 0) {
      this.sprites[this.lastSpriteIndex].visible = false;
      this.sprites[this.currSpriteIndex].visible = true;

      this.lastSpriteIndex = this.currSpriteIndex;
      this.currSpriteIndex++;

      if (this.currSpriteIndex > 2) {
        this.currSpriteIndex = 0;
      }

      this.framePass = 2;
    }

    this.framePass--;
  }

  smokeAnimate() {
    for (const [index, smoke] of this.smokeObjs.entries()) {
      if (index !== 0) {
        if (!smoke.isPass && this.smokeObjs[index-1].isPass) {
          smoke.isAnim = true;
        }
      } else {
        if (!smoke.isPass) {
          smoke.isAnim = true;
        }
      }

      smoke.animate();
    }

    if (this.smokeFramePass < 0) {
      this.smokeFramePass = 90;

      for (const smoke of this.smokeObjs) {
        smoke.isPass = false;
        smoke.yDirectionNum *= -1;
      }
    }

    this.smokeFramePass--;
  }

  rotateOnIsland(rad: number, bridgeWidth: number, islandY: number) {
    const y = Math.sin(rad) * bridgeWidth;
    const x = Math.cos(rad) * bridgeWidth;
    const yCoef = x / y;

    this.speed = this.gamePlay.config.carSpeed / yCoef;

    this.isRotate = true;
    this.neededRad = rad;
    this.islandY = islandY;
    this.isMoveForward = false;
    this.isMoveDiagonally = true;
  }

  // TODO: Fix bug when car place on center of screen
  rotateForward() {
    this.isRotate = true;
    this.neededRad = 0;
    this.isMoveForward = true;
    this.isMoveDiagonally = false;
  }

  selfUpdate(dt: number) {
    if (this.isMoveDiagonally) {
      this.y += dt * this.speed;
    } else {
      this.y = this.islandY;
    }

    if (this.isAnim) {
      this.animate();
    }

    if (this.isSmokeAnim) {
      this.smokeAnimate();
    }

    if (this.isRotate) {
      if (this.neededRad !== 0) {
        this.currRad += this.neededRad / 15;
        this.rotation = this.currRad;

        if (this.neededRad < 0) {
          if (this.currRad <= this.neededRad) {
            this.currRad = this.neededRad;
            this.rotation = this.currRad;
            this.isRotate = false;
            this.isMoveDiagonally = true;
          }
        } else {
          if (this.currRad >= this.neededRad) {
            this.currRad = this.neededRad;
            this.rotation = this.currRad;
            this.isRotate = false;
            this.isMoveDiagonally = true;
          }
        }
      } else {
        if (this.currRad < 0) {
          this.currRad += dt;
          this.rotation = this.currRad;

          if (this.currRad > 0) {
            this.currRad = 0;
            this.rotation = this.currRad;
            this.isRotate = false;
            this.isMoveDiagonally = false;
          }
        } else {
          this.currRad -= dt;
          this.rotation = this.currRad;

          if (this.currRad < 0) {
            this.currRad = 0;
            this.rotation = this.currRad;
            this.isRotate = false;
            this.isMoveDiagonally = false;
          }
        }
      }
    }
  }
}

class Smoke {
  defFramePass: number;
  currFramePass: number;

  defX: number;
  defY: number;

  sprite: Img;

  isAnim: boolean;
  isPass: boolean;
  yDirectionNum: number;

  constructor(yDirNum: number) {
    this.defFramePass = 30;
    this.currFramePass = this.defFramePass;

    this.defX = -80;
    this.defY = 17;

    this.sprite = new Img(
        resourcesBase + 'img/smoke.svg',
        -0.5, -0.5,
    );

    this.sprite.x = this.defX;
    this.sprite.y = this.defY;
    this.yDirectionNum = yDirNum;

    this.sprite.scaleX = 0.3;
    this.sprite.scaleY = 0.3;

    this.isAnim = false;
    this.isPass = false;
  }

  animate() {
    if (this.isAnim) {
      this.sprite.visible = true;

      this.sprite.x -= 0.7;
      this.sprite.y -= this.yDirectionNum * 0.3;

      this.sprite.scaleX += 0.05;
      this.sprite.scaleY += 0.05;

      this.sprite.alpha -= 1 / (this.defFramePass+2);

      this.currFramePass--;

      if (this.currFramePass < 0) {
        this.sprite.alpha = 1;
        this.isAnim = false;
        this.currFramePass = this.defFramePass;

        this.sprite.scaleX = 0.3;
        this.sprite.scaleY = 0.3;

        this.sprite.x = this.defX;
        this.sprite.y = this.defY;

        this.isPass = true;
      }
    } else {
      this.sprite.visible = false;
    }
  }
}
