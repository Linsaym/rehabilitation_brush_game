/* eslint-disable lines-between-class-members */

import * as utils from  './../utils';

import {Bridge} from './bridge';
import {GamePlay} from './game-play';
import {Island} from './island';
import {Obj} from './engine/obj';

interface ICollisionObj {
  isCollision: boolean;
  pointForCollision: number;
}
export class BridgeLayer extends Obj {
  gamePlay: GamePlay;
  bridges: Bridge[];

  bridgeIsMoving: boolean;
  bridgeSetDelay: number;

  lastBridgeIndex: number;
  currIsland: Island;
  passedTime: number;
  isCountdownStarted: boolean;

  bridgeRotateDeg: number;
  lastBridgeRotateDeg: number;
  currBridge!: Bridge;

  constructor(gamePlay: GamePlay) {
    super();

    this.gamePlay = gamePlay;
    this.bridges = [];

    this.bridgeIsMoving = true;
    this.bridgeSetDelay = 3;

    this.lastBridgeIndex = 0;

    this.currIsland = this.gamePlay.islandLayer.currIsland;
    this.passedTime = 0;
    this.isCountdownStarted = false;

    this.bridgeRotateDeg = 30;
    this.lastBridgeRotateDeg = 30;
  }

  createBridge(): Bridge {
    this.bridgeSetDelay = 3;
    const bridge =
      new Bridge(this.gamePlay.bridgeTypes[this.lastBridgeIndex], this);
    this.lastBridgeIndex++;

    this.currBridge = bridge;

    bridge.x = this.gamePlay.islandCenterLeftOffset;
    bridge.y = this.gamePlay.islandLayer.currIsland.y;
    bridge.rotation = utils.degToRad(this.lastBridgeRotateDeg);

    this.bridges.push(bridge);
    this.addChild(bridge);

    return bridge;
  }

  checkBridges() {
    for (let i = this.bridges.length-1; i >= 0; i--) {
      const bridge = this.bridges[i];

      if (bridge.x < -1000) {
        this.removeChild(bridge);
        this.bridges.splice(i, 1);
      }
    }
  }

  checkCollision(currBridge: Bridge, nextIsland: Island): ICollisionObj {
    const yDiff = currBridge.y - nextIsland.y;
    const xDiff = nextIsland.x - currBridge.x;
    const hypotenuse = Math.sqrt(yDiff**2 + xDiff**2);

    const needDeg = Math.round(
        utils.radToDeg(Math.asin(-yDiff / hypotenuse)),
    );

    const currDeg = Math.round(utils.radToDeg(currBridge.rotation));
    const diffDeg = Math.abs(needDeg - currDeg);

    const islandLeftX = nextIsland.x - 210;
    const bridgeXEnd = currBridge.x +
        Math.cos(currBridge.rotation)*currBridge.spriteWidth*currBridge.scaleX;

    const isXCollision = bridgeXEnd > islandLeftX;

    const maxDiff = 10 * nextIsland.scaleY;
    const isYCollision = diffDeg <= maxDiff;

    let decPoints = Math.round(diffDeg / nextIsland.scaleY);
    decPoints = decPoints < 10 ? decPoints : 9;


    if (isXCollision && isYCollision) {
      this.gamePlay.events.emit('RightConstruction', {});

      return {
        isCollision: true,
        pointForCollision: 10 - decPoints,
      };
    } else {
      this.gamePlay.events.emit('WrongConstruction', {});

      return {
        isCollision: false,
        pointForCollision: 0,
      };
    }
  }

  selfUpdate(dt: number) {
    if (
      Math.abs(
          Math.abs(this.bridgeRotateDeg) -
          Math.abs(this.lastBridgeRotateDeg),
      ) >= 10
    ) {
      this.bridgeIsMoving = true;
      this.lastBridgeRotateDeg = this.bridgeRotateDeg;
    } else {
      this.bridgeIsMoving = false;
    }

    if (this.isCountdownStarted) {
      this.passedTime += dt;
    }

    if (this.gamePlay.isBridgeNeeded) {
      const bridgeType = this.gamePlay.bridgeTypes[this.lastBridgeIndex];
      const bridge = this.createBridge();
      this.gamePlay.isBridgeNeeded = false;

      if (
        this.gamePlay.islandLayer.currIsland &&
        this.gamePlay.islandLayer.nextIsland
      ) {
        const yDiff =
            this.gamePlay.islandLayer.currIsland.y -
            this.gamePlay.islandLayer.nextIsland.y;
        const xDiff =
            this.gamePlay.islandLayer.currIsland.x -
            this.gamePlay.islandLayer.nextIsland.x;

        const hypotenuseForScale = Math.sqrt(yDiff**2 + xDiff**2) - 100;
        const bridgeWidth =
          this.gamePlay.bridgesParamObj[bridgeType].spriteWidth;
        bridge.scaleX = hypotenuseForScale / bridgeWidth;
      }

      this.isCountdownStarted = true;
    }

    if (this.gamePlay.isScreenMove) {
      for (const bridge of this.bridges) {
        bridge.x -= dt * this.gamePlay.config.carSpeed;
      }

      this.checkBridges();

      if (this.gamePlay.car.x >= this.currBridge.x - 10) {
        this.gamePlay.car.rotateOnIsland(
            utils.degToRad(this.currBridge.neededRotateDeg),
            this.currBridge.spriteWidth,
            this.gamePlay.islandLayer.currIsland.y,
        );
      }
    }

    if (!this.gamePlay.isScreenMove && !this.gamePlay.car.isMoveForward) {
      this.gamePlay.car.rotateForward();
    }

    if (!this.currBridge.isPassed) {
      const yDiff =
            this.gamePlay.islandLayer.currIsland.y -
            this.gamePlay.islandLayer.nextIsland.y;
      const xDiff =
            this.gamePlay.islandLayer.currIsland.x -
            this.gamePlay.islandLayer.nextIsland.x;

      const hypotenuse = Math.sqrt(yDiff**2 + xDiff**2);
      this.currBridge.neededRotateDeg = Math.round(
          utils.radToDeg(Math.asin(-yDiff / hypotenuse)),
      );

      if (!this.bridgeIsMoving) {
        this.bridgeSetDelay -= dt;

        if (this.bridgeSetDelay <= 2 && !this.gamePlay.timer.timerIsCreated) {
          this.gamePlay.timer.createTimer(
              this.currBridge.y + 250,
              this.bridgeSetDelay,
          );
        }

        if (this.bridgeSetDelay < 0) {
          const collisionObj = this.checkCollision(
              this.currBridge,
              this.gamePlay.islandLayer.nextIsland,
          );

          if (!collisionObj.isCollision) {
            this.currBridge.isFall = true;
            this.currBridge.alpha = 1;
            this.bridgeSetDelay = 3;
          } else {
            this.currBridge.isPassed = true;
            this.isCountdownStarted = false;

            this.gamePlay.startScreen();
            this.gamePlay.islandLayer.nextIsland.isMoving = false;

            let timePoints = 10;
            let decTimePoints = 0;
            this.passedTime = Math.floor(this.passedTime);

            if (this.passedTime > 5) {
              decTimePoints = this.passedTime-5 < 10 ? this.passedTime-5 : 9;
            }

            timePoints -= decTimePoints;
            this.passedTime = 0;

            this.gamePlay.flyingScore.create(
                1 + collisionObj.pointForCollision + timePoints,
                this.gamePlay.islandLayer.nextIsland.x,
                this.gamePlay.islandLayer.nextIsland.y,
            );
          }
        }
      } else {
        this.bridgeSetDelay = 3;

        if (this.gamePlay.timer.timerIsCreated) {
          this.gamePlay.timer.deleteTimer();
        }
      }
    } else if (!this.currBridge.isSetted) {
      this.currBridge.currRotateDeg = this.bridgeRotateDeg;

      this.currBridge.isSetted = true;
      this.currBridge.isRotate = true;
    }
  }
}
