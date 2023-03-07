/* eslint-disable lines-between-class-members */

import {BackgroundRow} from './background-row';
import {GamePlay} from './game-play';
import {Obj} from './engine/obj';

export class Background extends Obj {
  bgWidth: number;

  gamePlay: GamePlay;

  bgRows: BackgroundRow[];

  isMove: boolean;

  constructor(gamePlay: GamePlay) {
    super();
    this.bgWidth = 1920;

    this.gamePlay = gamePlay;

    this.bgRows = [];

    this.isMove = false;

    this.createBgRow(0);
  }

  createBgRow(initialX: number) {
    const bgRow = new BackgroundRow(this.gamePlay);

    bgRow.x = initialX;
    this.bgRows.push(bgRow);
    this.addChild(bgRow);
  }

  deleteBgRow(index: number, bgRow: BackgroundRow) {
    this.removeChild(bgRow);
    this.bgRows.splice(index, 1);
  }

  checkCoords() {
    const lastBgRow = this.bgRows[this.bgRows.length-1];
    const firstBgRow = this.bgRows[0];

    if (lastBgRow.x + this.bgWidth < this.gamePlay.realWidth) {
      this.createBgRow(lastBgRow.x + this.bgWidth - 1);
    }

    if (firstBgRow.x < -(this.bgWidth+100)) {
      this.deleteBgRow(0, firstBgRow);
    }
  }

  selfUpdate(dt: number) {
    if (this.isMove) {
      for (const bgRow of this.bgRows) {
        bgRow.x -= dt * this.gamePlay.config.carSpeed;
      }
    }

    this.checkCoords();
  }
}
