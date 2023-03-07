/* eslint-disable lines-between-class-members */

import Game from '..';
import {Img} from './engine/img';
import {Obj} from './engine/obj';
import {Text} from './engine/text';
import {UI} from './ui';

export class Score extends Obj {
  game: Game;
  UI: UI;

  text: Text;
  _value!: number;

  constructor(game: Game, UI: UI) {
    super();

    this.game = game;
    this.UI = UI;

    this.addChild(new Img(
        this.game.config.resourcesBase + 'img/scoreBg.svg',
        -0.5, -0.5,
        () => {
          this.UI.render();
        },
    ));

    this.text = new Text('0', '34px GolosTextWebBold');
    this.text.color = '#000000';
    this.text.y = 12;
    this.text.x = -40;
    this.addChild(this.text);

    this.value = 0;
  }

  get value() {
    return this._value;
  }

  set value(newValue: number) {
    this._value = newValue;
    this.text.text = `${this._value}`;
    this.UI.render();
  }

  incValue(value: number) {
    this.value += value;
  }

  inc() {
    this.value++;
  }
}
