/* eslint-disable lines-between-class-members */

import {Obj} from './obj';

export class Img extends Obj {
  static cache: {
    [resource: string]: HTMLCanvasElement;
  };

  resource: string;
  anchorX: number;
  anchorY: number;

  canvas!: HTMLCanvasElement;
  width!: number;
  height!: number;

  constructor(
      resource: string,
      anchorX: number,
      anchorY: number,
      cb?: Function,
  ) {
    super();

    this.resource = resource;
    this.anchorX = anchorX;
    this.anchorY = anchorY;

    if (Img.cache[this.resource]) {
      this.canvas = Img.cache[this.resource];
      this.width = this.canvas.width;
      this.height = this.canvas.height;

      if (cb) cb(this);
    } else {
      const image = new Image();

      image.src = this.resource;
      
      image.onload = () => {
        this.width = image.width;
        this.height = image.height;
        this.renderCanvas(image);

        if (cb) cb(this);

        Img.cache[this.resource] = this.canvas;
      };
    }
  }

  clean(): void {
    if (this.canvas) {
      this.canvas.remove();
    }
  }

  renderCanvas(image: HTMLImageElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    if (image) {
      ctx.drawImage(
          image,
          0, 0,
          this.width,
          this.height,
      );
    }
  }

  selfRender(ctx: CanvasRenderingContext2D) {
    if (this.canvas) {
      ctx.drawImage(
          this.canvas,
          Math.floor(this.width * this.anchorX),
          Math.floor(this.height * this.anchorY),
      );
    }
  }

  static preload(paths: string[]) {
    for (const path of paths) {
      if (Img.cache[path]) return;

      const image = new Image();
      image.src = path;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        if (image) {
          ctx.drawImage(
              image,
              0, 0,
              image.width,
              image.height,
          );
        }

        Img.cache[path] = canvas;
      };
    }
  }
}

Img.cache = {};
