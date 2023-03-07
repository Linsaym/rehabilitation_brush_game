/* eslint-disable lines-between-class-members */
export class Obj {
  protected isDestroyed: boolean = false;
  private _alpha: number = 1;

  parent: Obj | null = null;

  children: Obj[] = [];
  visible: boolean = true;

  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;

  constructor() {
    this.x = this.y = this.rotation = 0;
    this.scaleX = this.scaleY = 1;
  }

  set alpha(value: number) {
    this._alpha = value;

    for (const child of this.children) {
      child.alpha = value;
    }
  }

  get alpha() {
    return this._alpha;
  }

  get scale() {
    return Math.max(this.scaleX, this.scaleY);
  }

  set scale(value: number) {
    this.scaleX = value;
    this.scaleY = value;
  }

  addChild(child: Obj) {
    if (child.parent) {
      this.clearChild(child, child.parent);
    }

    this.children.push(child);
    child.parent = this;
  }

  removeChild(child: Obj) {
    this.clearChild(child, this);
    child.destroy();
  }

  clearChild(child: Obj, context: Obj) {
    const index = context.children.indexOf(child);

    if (index !== -1) {
      child.parent = null;
      context.children.splice(index, 1);
    }
  }

  displayOnTop(child: Obj) {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      this.children.splice(index, 1);
      this.children.push(child);
    }
  }

  destroy() {
    const len = this.children.length;
    for (let i = len-1; i >= 0; i--) {
      this.children[i].destroy();
    }

    Object.keys(this).forEach((key) => {
      // @ts-ignore
      this[key as keyof this] = null;
    });

    this.isDestroyed = true;
  }

  remove() {
    this.parent!.removeChild(this);
  }

  selfRender(ctx: CanvasRenderingContext2D) {}

  selfUpdate(dt: number) {}

  update(dt: number) {
    if (this.isDestroyed) return;

    for (const child of this.children) {
      child.update(dt);
    }

    this.selfUpdate(dt);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this._alpha;

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, this.scaleY);

    this.selfRender(ctx);

    if (this.children) {
      for (const child of this.children) {
        child.render(ctx);
      }
    }

    ctx.restore();
  }
}
