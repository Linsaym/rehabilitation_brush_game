/* eslint-disable lines-between-class-members */

import {GamePlay} from './game-play';
import {Img} from './engine/img';
import {Obj} from './engine/obj';

const RADIUS_1 = 35;
const RADIUS_2 = 38;
const TOTAL_TIME = 2;

export class Timer extends Obj {
  timeLeft: number = TOTAL_TIME;
  timerIsCreated: boolean = false;

  gamePlay: GamePlay;
  sprite: Img;
  circle: TimerCircle;

  constructor(gamePlay: GamePlay) {
    super();

    this.gamePlay = gamePlay;

    this.sprite = new Img(
        this.gamePlay.config.resourcesBase + 'img/timerBg.svg',
        -0.5, -0.5,
    );
    this.addChild(this.sprite);

    this.circle = new TimerCircle(this);
    this.addChild(this.circle);

    this.visible = false;
  }

  createTimer(y: number, timeLeft: number) {
    this.gamePlay.events.emit('Constructing', {});
    this.gamePlay.sound.play('timer');

    this.x = this.gamePlay.islandCenterLeftOffset;
    this.y = y > this.gamePlay.config.height - 200 ? y - 500 : y;

    this.visible = true;
    this.timeLeft = timeLeft;
    this.timerIsCreated = true;
  }

  deleteTimer() {
    this.gamePlay.sound.stop('timer');

    this.visible = false;
    this.timeLeft = TOTAL_TIME;
    this.timerIsCreated = false;
  }

  selfUpdate(dt: number) {
    if (this.visible) {
      this.timeLeft -= dt;

      if (this.timeLeft <= 0) {
        this.deleteTimer();
      }

      this.circle.updatePct(this.timeLeft / TOTAL_TIME);
    }
  }
}

class TimerCircle extends Obj {
  currPct: number = 1;
  radius1: number = RADIUS_1;
  radius2: number = RADIUS_2;
  circ: number = Math.PI * 2;
  quart: number = Math.PI / 2;

  timer: Timer;

  constructor(timer: Timer) {
    super();

    this.timer = timer;
  }

  selfRender(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(
        0, 0,
        this.radius2,
        -this.quart,
        this.circ * this.currPct - this.quart,
        false,
    );

    ctx.lineWidth = RADIUS_2 * 2;
    ctx.strokeStyle = '#E3A300';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
        0, 0,
        this.radius1,
        -this.quart,
        this.circ * this.currPct - this.quart,
        false,
    );

    ctx.lineWidth = RADIUS_1 * 2;
    ctx.strokeStyle = '#FFC900';
    ctx.stroke();
  }

  updatePct(pct: number) {
    this.currPct = pct;
  }
}
