/* eslint-disable lines-between-class-members */
import {Obj} from './obj';

export type TTextAlign = 'left' | 'right' | 'center' | 'start' | 'end';

export type TTextBaseline =
  'top' |
  'hanging' |
  'middle' |
  'alphabetic' |
  'ideographic' |
  'bottom';

export type TTextShadowProps = {
  color: string,
  offsetX: number,
  offsetY: number,
  blur: number,
}

export class Text extends Obj {
  text: string;
  font: string;

  color: string;
  baseline: TTextBaseline;
  align: TTextAlign;

  constructor(
      text: string,
      font: string,
  ) {
    super();

    this.text = text;
    this.font = font;

    this.color = '#ffffff';
    this.baseline = 'alphabetic';
    this.align = 'center';
  }

  selfRender(ctx: CanvasRenderingContext2D) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.textBaseline = this.baseline;

    ctx.fillText(this.text, 0, 0);
  }
}
