/* eslint-disable lines-between-class-members */
import Game from '..';
import {HitPoints} from './hit-points';
import {Obj} from './engine/obj';
import {Score} from './score';

export class UI {
  game: Game;

  view: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  stage: Obj;

  score!: Score;
  hitPoints!: HitPoints;

  constructor(game: Game) {
    this.game = game;

    this.view = document.createElement('canvas');
    this.view.style.position = 'fixed';
    this.view.style.zIndex = '2';
    const viewContainer = document.querySelector('.game > div');

    viewContainer!.append(this.view);
    this.ctx = this.view.getContext('2d') as CanvasRenderingContext2D;

    this.stage = new Obj();
  }

  restart() {
    if (this.score) this.score.remove();
    if (this.hitPoints) this.hitPoints.remove();

    this.score = new Score(this.game, this);
    this.score.y = 80;
    this.score.x = this.game.config.width - 140;
    this.stage.addChild(this.score);

    if (!this.game.config.isTraining) {
      this.hitPoints = new HitPoints(this.game, this);
      this.hitPoints.x = 20;
      this.hitPoints.y = 20;
      this.stage.addChild(this.hitPoints);
    }

    this.render();
  }

  destroy() {
    this.stage.destroy();
    this.render();
  }

  resize() {
    this.view.width = this.game.width;
    this.view.height = this.game.height;

    this.view.style.width = `${this.game.width}px`;
    this.view.style.height = `${this.game.height}px`;

    this.stage.scale = this.game.width / this.game.config.width;

    this.render();
  }

  render() {
    this.ctx.clearRect(0, 0, this.game.width, this.game.height);

    this.stage.render(this.ctx);
  }
}
