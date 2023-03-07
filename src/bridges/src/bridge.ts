/* eslint-disable lines-between-class-members */

import * as utils from  './../utils';

import {BridgeLayer} from './bridge-layer';
import {Img} from './engine/img';
import {Obj} from './engine/obj';
import {resourcesBase} from '../difficulty';

export type BridgeType = 'medium' | 'long';

export class Bridge extends Obj {
  segmentSprites: Img[] = [];

  isPassed: boolean = false;
  isUnset: boolean = true;
  isFall: boolean = false;
  isSetted: boolean = false;
  isRotate: boolean = false;
  isInAction: boolean = false;
  neededRotateDeg: number = 0;
  currRotateDeg: number = 0;

  layer: BridgeLayer;
  bridgeType: BridgeType;
  numOfSigments: number;
  spriteWidth: number;
  stateLayer: Obj;
  wrongSprite: Img;
  correctSprite: Img;


  constructor(bridgeType: BridgeType, layer: BridgeLayer) {
    super();

    this.layer = layer;
    this.bridgeType = bridgeType;

    switch (this.bridgeType) {
      case 'medium':
        this.numOfSigments = 4;
        this.spriteWidth =
          this.layer.gamePlay.bridgesParamObj.medium.spriteWidth;
        break;
      case 'long':
        this.numOfSigments = 5;
        this.spriteWidth =
          this.layer.gamePlay.bridgesParamObj.long.spriteWidth;
        break;
    }

    this.createSegments();

    this.stateLayer = new Obj();
    this.addChild(this.stateLayer);
    this.stateLayer.visible = false;

    this.wrongSprite = new Img(
        `${resourcesBase}img/bridges/red/${this.bridgeType}.svg`,
        0, -0.5,
    );
    this.wrongSprite.x = 115;
    this.wrongSprite.visible = true;


    this.correctSprite = new Img(
        `${resourcesBase}img/bridges/green/${this.bridgeType}.svg`,
        0, -0.5,
    );
    this.correctSprite.x = 115;
    this.correctSprite.visible = false;

    this.stateLayer.addChild(this.wrongSprite);
    this.stateLayer.addChild(this.correctSprite);
  }

  createSegments() {
    for (let i = 1; i <= this.numOfSigments; i++) {
      const segment = new Img(
          resourcesBase +
          `img/bridges/segments/${this.bridgeType}/${i}.svg`,
          0, -0.5,
      );
      segment.visible = false;
      segment.scaleX = 0.7;
      segment.scaleY = 0.7;
      segment.alpha = 0;

      this.segmentSprites.push(segment);
      this.addChild(segment);
    }

    switch (this.bridgeType) {
      case 'medium':
        this.segmentSprites[1].x = 199;
        this.segmentSprites[2].x = 303;
        this.segmentSprites[3].x = 403;
        break;
      case 'long':
        this.segmentSprites[1].x = 200;
        this.segmentSprites[1].y = 0.5;
        this.segmentSprites[2].x = 304;
        this.segmentSprites[3].x = 407;
        this.segmentSprites[4].x = 508;
        break;
    }
  }

  setAnimate() {
    for (const [index, segment] of this.segmentSprites.entries()) {
      if (!segment.visible) {
        segment.visible = true;
      }

      if (segment.scaleX < 1) {
        if (index === 0) {
          segment.scaleX += 0.015;
          segment.scaleY += 0.015;
        } else if (this.segmentSprites[index-1].scaleX > 0.79) {
          segment.scaleX += 0.015;
          segment.scaleY += 0.015;
        }

        if (segment.alpha >= 1) {
          segment.alpha = 1;
          continue;
        }

        this.segmentSprites[0].alpha += 0.05;
        if (index !== 0 && this.segmentSprites[index-1].alpha > 0.3) {
          this.segmentSprites[index].alpha += 0.05;
        }
      }
    }

    if (this.segmentSprites[this.segmentSprites.length-1].scaleX >= 1) {
      this.isUnset = false;

      for (const segment of this.segmentSprites) {
        segment.alpha = 1;
      }
    }
  }

  fallAnimate() {
    const firstSegment = this.segmentSprites[0];

    if (this.segmentSprites[1].scaleX <= 0.91) {
      if (firstSegment.scaleX >= 0.7) {
        firstSegment.scaleX -= 0.015;
        firstSegment.scaleY -= 0.015;
      }

      if (this.segmentSprites[0].alpha >= 0.1) {
        this.segmentSprites[0].alpha -= 0.05;
      } else {
        this.segmentSprites[0].alpha = 0;
        firstSegment.visible = false;
      }
    }


    for (const [index, segment] of this.segmentSprites.entries()) {
      if (index === 0) continue;

      if (segment.scaleX >= 0.7) {
        if (index === 1) {
          segment.scaleX -= 0.015;
          segment.scaleY -= 0.015;
        } else if (this.segmentSprites[index-1].scaleX <= 0.91) {
          segment.scaleX -= 0.015;
          segment.scaleY -= 0.015;
        }

        if (segment.alpha <= 0.2) {
          segment.alpha = 0;
          segment.visible = false;
          continue;
        };

        this.segmentSprites[1].alpha -= 0.05;
        if (index !== 1 && this.segmentSprites[index-1].alpha <= 0.7) {
          this.segmentSprites[index].alpha -= 0.05;
        }
      }
    }

    if (this.segmentSprites[this.segmentSprites.length-1].scaleX <= 0.7) {
      this.isUnset = true;
      this.isFall = false;

      for (const segment of this.segmentSprites) {
        segment.alpha = 0;
      }
    }
  }

  rotationAnimate() {
    if (this.currRotateDeg !== this.neededRotateDeg) {
      if (this.currRotateDeg < this.neededRotateDeg) {
        this.currRotateDeg++;
        this.rotation = utils.degToRad(this.currRotateDeg);
      } else {
        this.currRotateDeg--;
        this.rotation = utils.degToRad(this.currRotateDeg);
      }
    } else {
      this.isRotate = false;
    }
  }

  selfUpdate() {
    this.isInAction = !this.isPassed && !this.isUnset && !this.isFall &&
      !this.isSetted && !this.isRotate;

    this.stateLayer.visible = this.isInAction;

    if (this.isInAction) {
      const currDeg = Math.round(utils.radToDeg(this.rotation));
      const diffDeg = Math.abs(this.neededRotateDeg - currDeg);

      const maxDiff = 10 * this.layer.gamePlay.islandLayer.nextIsland.scaleY;

      this.wrongSprite.visible = diffDeg > maxDiff;
      this.correctSprite.visible = diffDeg <= maxDiff;

      this.alpha = 0.5;
    }

    if (this.isFall) {
      this.fallAnimate();
    }

    if (this.isUnset) {
      this.setAnimate();
    }

    if (this.isRotate) {
      this.rotationAnimate();
      this.alpha = 1;
    }
  }
}
