/* eslint-disable lines-between-class-members */

import {GamePlay} from './game-play';
import {Island} from './island';
import {Obj} from './engine/obj';

export class IslandLayer extends Obj {
  gamePlay: GamePlay;
  islands: Island[];
  currIsland: Island;
  currIslandIndex: number;

  nextIsland!: Island;
  isNeedCheckLastIsland: boolean;

  constructor(gamePlay: GamePlay) {
    super();

    this.gamePlay = gamePlay;

    this.islands = [];
    this.createIsland(this.gamePlay.islandCenterLeftOffset);

    this.currIsland = this.islands[0];
    this.currIslandIndex = 0;

    this.isNeedCheckLastIsland = true;
  }

  createIsland(
      x: number,
      y: number = this.gamePlay.config.height / 2,
      islandIsMoving: boolean = false,
  ) {
    const islandType = islandIsMoving ? 'movable' : 'motionless';
    const island = new Island(this.gamePlay, islandType, x, y);

    island.x = x;
    island.y = y;

    island.isMoving = islandIsMoving;

    this.addChild(island);
    this.islands.push(island);

    if (this.islands.length > 1 && !this.nextIsland) {
      this.nextIsland = island;
    }
  }

  checkIsland(index: number) {
    if (this.islands[index+1]) {
      this.currIsland = this.islands[index+1];
      this.currIslandIndex = index+1;

      this.nextIsland = this.islands[this.currIslandIndex+1];
    }

    for (let i = this.islands.length-1; i >= 0; i--) {
      const island = this.islands[i];

      if (island.x < -600) {
        this.removeChild(island);
        this.islands.splice(i, 1);
        this.currIslandIndex--;
      }
    }
  }

  checkLastIsland() {
    const island = this.islands[this.islands.length-1];
    const islandRightCoord = island.x + island.spriteWidth/2;
    const islandRightOffset = this.gamePlay.realWidth - islandRightCoord;

    const nextIslandOffset =
      this.gamePlay.islandOffsets[this.gamePlay.islandOffsets.length-1];

    if (islandRightOffset + island.spriteWidth/2 > nextIslandOffset) {
      const initialX = island.x + nextIslandOffset + island.spriteWidth/2;

      const bridgeType =
        this.gamePlay.bridgeTypes[this.gamePlay.bridgeTypes.length-1];

      let bridgeWidth;

      switch (bridgeType) {
        case 'medium': {
          bridgeWidth = this.gamePlay.bridgesParamObj.medium.activeWidth;
          break;
        } case 'long': {
          bridgeWidth = this.gamePlay.bridgesParamObj.long.activeWidth;
          break;
        }
      }

      const islandMovableArr = this.gamePlay.islandMovableArr;
      const islandIsMoving = islandMovableArr[islandMovableArr.length-1];

      const yDiff = Math.sqrt(bridgeWidth**2 - nextIslandOffset**2) * 1.2;
      let initialY = 0;
      if (island.y >= this.gamePlay.config.height / 2) {
        initialY = island.y - yDiff;
      } else {
        initialY = island.y + yDiff;
      }

      this.createIsland(initialX, initialY, islandIsMoving);
      this.gamePlay.defineNextBridgeType();
    } else {
      this.isNeedCheckLastIsland = false;
    }
  }

  selfUpdate(dt: number) {
    if (this.currIsland.isPass) {
      this.checkIsland(this.currIslandIndex);
    }

    if (this.gamePlay.isScreenMove) {
      if (
        !this.currIsland.isPass &&
        this.currIsland.x < this.gamePlay.islandCenterLeftOffset
      ) {
        this.gamePlay.stopScreen();
        this.gamePlay.isBridgeNeeded = true;
      }

      if (this.gamePlay.isScreenMove) {
        for (const island of this.islands) {
          island.x -= dt * this.gamePlay.config.carSpeed;
        }
      }

      this.checkLastIsland();
    }

    if (this.isNeedCheckLastIsland) {
      this.checkLastIsland();
    }
  }
}
