import {GamePlay} from './game-play';
/* eslint-disable lines-between-class-members */
import {Obj} from './engine/obj';
import {Text} from './engine/text';

const FLY_DURATION = 1; // in seconds

export class FlyingScore extends Obj {
  isActive: boolean = false;
  currValue: number = 0;
  xSpeed: number = 0;
  ySpeed: number = 0;

  gamePlay: GamePlay;
  text: Text;

  constructor(gamePlay: GamePlay) {
    super();

    this.gamePlay = gamePlay;

    this.text = new Text('0', '60px GolosTextWebBold');
    this.addChild(this.text);
    this.visible = false;
  }

  set active(value: boolean) {
    this.isActive = value;
    this.visible = value;
    this.text.alpha = value ? 1 : 0;
  }

  get active(): boolean {
    return this.isActive;
  }

  create(value: number, x: number, y: number) {
    this.active = true;

    this.currValue = value;
    this.text.color = value > 15 ? '#5367D3' : '#E76565';
    this.text.text = String(value);

    this.text.x = x;
    this.text.y = y;

    this.xSpeed = (this.gamePlay.realWidth - x) / FLY_DURATION;
    this.ySpeed = -y / FLY_DURATION;
  }

  selfUpdate(dt: number) {
    if (this.isActive) {
      this.text.x += dt * this.xSpeed;
      this.text.y += dt * this.ySpeed;

      this.text.alpha -= dt / FLY_DURATION;

      if (this.text.alpha <= 0) {
        this.active = false;
        this.gamePlay.game.UI.score.incValue(this.currValue);
      }
    }
  }
}
