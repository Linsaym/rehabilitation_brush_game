/* eslint-disable lines-between-class-members */
import Game from '..';
import {Img} from './engine/img';
import {Obj} from './engine/obj';
import {UI} from './ui';

export class HitPoints extends Obj {
  private _hitPoints: number;
  hearts: Img[] = [];

  game: Game;
  UI: UI;

  defaultHitPointsNum: number;

  constructor(game: Game, UI: UI) {
    super();

    this.game = game;
    this.UI = UI;

    this.defaultHitPointsNum = this.game.config.hitPoints;
    this._hitPoints = this.defaultHitPointsNum;

    this.iniCreate();
  }

  set hitPoints(value: number) {
    this._hitPoints = value;

    this.updateHearts();
    this.UI.render();
  }

  get hitPoints() {
    return this._hitPoints;
  }

  iniCreate() {
    for (let i = 0; i < this.defaultHitPointsNum; i++) {
      const x = i * 120;

      const emptyHeart = new Img(
          `${this.game.config.resourcesBase}img/heart/empty.svg`,
          0, 0,
          () => {
            this.UI.render();
          },
      );
      emptyHeart.x = x;
      this.addChild(emptyHeart);

      const heart = new Img(
          `${this.game.config.resourcesBase}img/heart/filled.svg`,
          0, 0,
          () => {
            this.UI.render();
          },
      );
      heart.x = x;
      this.addChild(heart);

      this.hearts.push(heart);
    };
  }

  updateHearts() {
    for (const [index, heart] of this.hearts.entries()) {
      if (index >= this._hitPoints) {
        heart.visible = false;
      } else {
        heart.visible = true;
      }
    }
  }

  decHitPoint() {
    this.hitPoints--;
  }
}
