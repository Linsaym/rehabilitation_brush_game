/* eslint-disable lines-between-class-members */

import * as utils from  './../utils';

import {Background} from './background';
import {BirdLayer} from './bird-layer';
import {BridgeLayer} from './bridge-layer';
import {BridgeType} from './bridge';
import {Car} from './car';
import {EventEmitter} from './../event-emmiter';
import {FlyingScore} from './flying-score';
import Game from '..';
import {IConfig} from '../config';
import {IslandLayer} from './island-layer';
import {Obj} from './engine/obj';
import {Sound} from './../sound';
import {Timer} from './timer';

export class GamePlay extends Obj {
  game: Game;
  config: IConfig;
  realWidth: number;

  events: EventEmitter;
  sound: Sound;

  bridgesParamObj: {
    medium: {
      spriteWidth: number;
      activeWidth: number;
    };
    long: {
      spriteWidth: number;
      activeWidth: number;
    };
  };

  bridgeTypes: BridgeType[];
  islandOffsets: number[];
  islandMovableArr: boolean[];

  isIslandsMoving: boolean;
  currIslandScale: number;

  background: Background;
  islandLayer: IslandLayer;
  bridgeLayer: BridgeLayer;
  car: Car;
  flyingScore: FlyingScore;
  birdLayer: BirdLayer;
  isScreenMove: boolean;
  isBridgeNeeded: boolean;

  timer: Timer;
  islandCenterLeftOffset: number;

  constructor(game: Game) {
    super();

    this.game = game;
    this.config = game.config;
    this.realWidth = window.innerWidth;


    this.events = game.events;
    this.sound = game.sound;

    this.bridgesParamObj = {
      medium: {
        spriteWidth: 490,
        activeWidth: 420,
      },
      long: {
        spriteWidth: 595,
        activeWidth: 525,
      },
    };

    this.bridgeTypes = [];
    this.islandOffsets = []; // in px
    this.islandMovableArr = [];
    this.defineNextBridgeType();

    this.islandCenterLeftOffset = 220;

    this.isIslandsMoving = false;
    this.currIslandScale = 1;

    this.background = new Background(this);
    this.addChild(this.background);

    this.islandLayer = new IslandLayer(this);
    this.addChild(this.islandLayer);

    this.bridgeLayer = new BridgeLayer(this);
    this.addChild(this.bridgeLayer);

    this.car = new Car(this);
    this.addChild(this.car);

    this.flyingScore = new FlyingScore(this);
    this.addChild(this.flyingScore);

    this.birdLayer = new BirdLayer(this);
    this.addChild(this.birdLayer);

    this.isScreenMove = false;
    this.isBridgeNeeded = false;

    this.timer = new Timer(this);
    this.addChild(this.timer);

    this.stopScreen();
    this.isBridgeNeeded = true;
  }

  resize() {
    this.realWidth = window.innerWidth / this.scaleX;

    this.background.y = this.config.height;
  }

  defineNextBridgeType() {
    const bridgeTypeNum = utils.randomIntBetween(1, 2);

    let bridgeWidth;
    switch (bridgeTypeNum) {
      case 1:
        this.bridgeTypes.push('medium');
        bridgeWidth = this.bridgesParamObj.medium.activeWidth;
        break;
      case 2:
        this.bridgeTypes.push('long');
        bridgeWidth = this.bridgesParamObj.long.activeWidth;
        break;
      default:
        throw new Error('Wrong bridgeTypeNum');
    }

    const lastOffset = this.islandOffsets[this.islandOffsets.length-1];
    const lastIslandIsMoving =
      this.islandMovableArr[this.islandMovableArr.length-1];

    let islandIsMoving = false;
    if (this.config.islandIsMoving && !lastIslandIsMoving) {
      islandIsMoving = utils.randomIntBetween(1, 4) <= 3;
    }

    let minWidth;
    if (islandIsMoving) {
      minWidth = bridgeWidth;
    } else if (lastIslandIsMoving) {
      minWidth = 300;
    } else {
      minWidth = lastOffset <= 350 ? 350 : 0;
    }

    this.islandMovableArr.push(islandIsMoving);
    this.islandOffsets.push(utils.randomIntBetween(minWidth, bridgeWidth));
  }

  startScreen() {
    this.isScreenMove = true;
    this.car.isAnim = true;
    this.birdLayer.birdScreenSpeed = this.config.carSpeed;
    this.background.isMove = true;

    this.isBridgeNeeded = false;
    this.islandLayer.currIsland.isPass = true;

    this.sound.setVolume('car', 1);
    this.sound.play('carMoving');
    this.sound.sounds['wood'].currentTime = 0;
    this.sound.play('wood');
  }

  stopScreen() {
    this.isScreenMove = false;
    this.car.isAnim = false;
    this.birdLayer.birdScreenSpeed = 0;
    this.background.isMove = false;

    this.sound.setVolume('car', 0.5);
    this.sound.stop('wood');
  }

  act(input: number) {
    if (Math.abs(this.bridgeLayer.bridgeRotateDeg - input) >= 1) {
      if (input > 75) {
        input = 75;
      } else if (input < -75) {
        input = -75;
      } else {
        input = Math.floor(input);
      }

      if (
        this.bridgeLayer.currBridge &&
        !this.bridgeLayer.currBridge.isSetted
      ) {
        this.bridgeLayer.currBridge.rotation = utils.degToRad(input);
      }

      this.bridgeLayer.bridgeRotateDeg = input;
    }
  }

  selfUpdate(dt: number) {
    if (this.config.isDynamic) {
      this.game.dynamicManager!.update(dt);
    }
  }
}
