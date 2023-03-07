/* eslint-disable lines-between-class-members */

import {GamePlay} from './game-play';
import {Img} from './engine/img';
import {Obj} from './engine/obj';

export class BackgroundRow extends Obj {
  gamePlay: GamePlay;

  bgHeight: number;
  bgWidth: number;
  bgScale!: number;

  sprites: Img[];

  constructor(gamePlay: GamePlay) {
    super();
    this.gamePlay = gamePlay;

    this.bgHeight = 1660;
    this.bgWidth = 1920;


    this.sprites = [];

    this.createBg(0);
  }

  createBg(y: number) {
    const bg = new Img(
        this.gamePlay.config.resourcesBase + 'img/bg.svg',
        0, -1,
    );

    bg.y = y;

    this.addChild(bg);
    this.sprites.push(bg);
  }

  checkCoords(bg: Img) {
    if (this.bgHeight - bg.y <= this.gamePlay.config.height + 10) {
      this.createBg(bg.y - this.bgHeight+1);
    }
  }

  removeBg(index: number, bg: Img) {
    this.removeChild(bg);
    this.sprites.splice(index, 1);
  }


  selfUpdate(dt: number) {
    for (const [index, sprite] of this.sprites.entries()) {
      sprite.y += dt * this.gamePlay.config.bgSpeed;

      if (sprite.y > this.bgHeight) {
        this.removeBg(index, sprite);
      }
    }

    const lastBg = this.sprites[this.sprites.length-1];
    this.checkCoords(lastBg);
  }
}
