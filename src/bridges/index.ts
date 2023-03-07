import {IConfig, getConfig} from './config';

import {DynamicManager} from './src/engine/dynamic-manager';
import {EventEmitter} from './event-emmiter';
import {GamePlay} from './src/game-play';
import {Img} from './src/engine/img';
import {Obj} from './src/engine/obj';
import {Sound} from './sound';
import {UI} from './src/ui';

import * as handpose from "@tensorflow-models/handpose";
import {CloseHandGesture, OpenHandGesture} from "../HandPose";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
// @ts-ignore
import * as fp from 'fingerpose'


export default class Game {
    public events: EventEmitter = new EventEmitter();

    private _clear: boolean = false;

    lastUpdateTime: number = performance.now();

    public view: HTMLCanvasElement;

    public ctx: CanvasRenderingContext2D;

    public stage: Obj;

    public width!: number;

    public height!: number;

    public readonly sound: Sound;

    public readonly gameLayer: Obj;

    public gamePlay!: GamePlay;

    public config: IConfig;

    public lastTime!: number;

    public paused!: boolean;

    public isGameOver!: boolean;

    public duration: number;

    public currDuration!: number;

    public totalDuration!: number;

    public UI: UI;

    public dynamicManager?: DynamicManager;

    _listener!: (e: PointerEvent) => void;

    bindedResize: () => void;

    isOverlayMute!: boolean;

    constructor(configs: {
        duration: number;
        isTraining: boolean;
        webcamRef: any,
        canvasRef: any,
    }) {
        const {duration, isTraining, webcamRef, canvasRef} = configs;

        this.config = getConfig(isTraining);
        this.duration = duration;

        if (this.config.isDynamic) {
            this.dynamicManager = new DynamicManager(this.config);
        }

        this.preloadBirds();

        this.view = document.createElement('canvas');
        this.view.style.position = 'fixed';
        this.view.style.zIndex = '1';
        document.body.appendChild(this.view);

        this.ctx = this.view.getContext('2d') as CanvasRenderingContext2D;

        this.sound = new Sound(this.config.sound, []);

        this.stage = new Obj();
        this.gameLayer = new Obj();
        this.stage.addChild(this.gameLayer);

        this.UI = new UI(this);

        this.events.on('WrongConstruction', () => {
            this.sound.play('wrongConstruction');

            if (!this.config.isTraining) {
                this.UI.hitPoints.decHitPoint();
            }
        });
        this.events.on('RightConstruction', () => {
        });
        this.events.on('Constructing', () => {
        });

        this.bindedResize = this.resize.bind(this);
        window.addEventListener('resize', this.bindedResize);
        this.setMouseControl(webcamRef, canvasRef);

        this.restart();
        this.render();
    }

    preloadBirds() {
        const paths = [];

        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 8; j++) {
                paths.push(`${this.config.resourcesBase}img/birds/${i}/${j}.svg`);
            }
        }

        Img.preload(paths);
    }

    preInitResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.view.width = this.width;
        this.view.height = this.height;

        this.view.style.width = `${this.width}px`;
        this.view.style.height = `${this.height}px`;
    }

    resize() {
        this.preInitResize();

        const scale = this.height / this.config.height;

        this.gamePlay.scale = scale;
        this.gamePlay.resize();

        this.UI.resize();
    }

    calcDt(): number {
        const time = performance.now();
        const dt = (time - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = time;

        return dt < 0.1 ? dt : 0.1;
    }

    render() {
        if (this._clear) {
            return;
        }
        ;

        const dt = this.calcDt();

        this.ctx.clearRect(0, 0, this.width, this.height);

        let hitPoints = 3;
        if (this.UI.hitPoints) {
            hitPoints = this.UI.hitPoints.hitPoints;
        }

        if (!this.paused && !this.isGameOver) {
            this.stage.update(dt);
            this.totalDuration += dt;

            if (this.config.isTraining) {
                this.currDuration -= dt;

                this.events.emit('CountDown', {
                    countDown: this.currDuration * 1000,
                });
            }

            this.events.emit('Points', {
                points: this.UI.score.value,
            });

            this.act();

            if (this.config.isTraining && this.currDuration < 0 || hitPoints <= 0) {
                this.gameOver();
            }
        }

        this.stage.render(this.ctx);

        requestAnimationFrame(this.render.bind(this));
    }

    act() {
        if (!this.paused && !this.isGameOver) {
            if (this.gamePlay !== null) {
                // @ts-ignore
                const input = 180 * global.inputVal;
                this.gamePlay.act(input - 90);
            }
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.sound.mute();

        this.events.emit('GameOver', {
            score: this.UI.score.value,
            duration: Math.floor(this.totalDuration * 1000),
        });
    }

    restart() {
        if (this.config.isDynamic) {
            this.dynamicManager!.restart();
        }

        if (this.gamePlay) {
            this.gamePlay.remove();
        }

        this.gamePlay = new GamePlay(this);
        this.gameLayer.addChild(this.gamePlay);

        this.currDuration = this.duration;
        this.totalDuration = 0;

        this.UI.restart();
        this.isGameOver = false;

        this.resize();
        this.resume();
    }

    pause() {
        this.paused = true;
        this.sound.stop('waves');
        this.sound.stop('car');
        this.sound.stop('wood');
        this.sound.stop('carMoving');
        this.sound.stop('timer');
    }

    resume() {
        this.paused = false;

        if (!this.isOverlayMute) {
            this.sound.unmute();
            this.sound.play('waves');
            this.sound.play('car');

            if (this.gamePlay.timer.timerIsCreated) {
                this.sound.play('timer');
            }
        }
    }

    mute() {
        this.isOverlayMute = true;
        this.sound.mute();
    }

    unmute() {
        this.isOverlayMute = false;
        this.sound.unmute();
    }

    destroy() {
        this.view.remove();

        this.events.clean();
        this.sound.clean();

        this.stage.destroy();

        this.UI.destroy();
    }

    clean() {
        this._clear = true;
        this.sound.mute();

        this.destroy();

        window.removeEventListener('resize', this.bindedResize);
        document.removeEventListener('pointermove', this._listener);
        document.body.style.touchAction = '';
    }

    // @ts-ignore
    setMouseControl(webcamRef, canvasRef) {

        const runHandpose = async () => {
            const net = await handpose.load()
            setInterval(() => {
                detect(net)
            }, 100)
        }
        // @ts-ignore
        const detect = async (net) => {
            if (typeof webcamRef.current != "undefined" &&
                webcamRef.current != null &&
                webcamRef.current.video.readyState === 4
            ) {
                const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;

                webcamRef.current.video.width = videoWidth;
                webcamRef.current.video.height = videoHeight;
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                // Make detect
                const hand = await net.estimateHands(video);
                if (hand.length > 0) {
                    const GE = new fp.GestureEstimator([
                        CloseHandGesture,
                        OpenHandGesture
                    ])
                    const gesture = await GE.estimate(hand[0].landmarks, 4)
                    if (gesture.gestures.length > 0) {
                        // @ts-ignore
                        if (gesture.gestures[0].name == 'hand_open' && global.inputVal > 0.01) {
                            // @ts-ignore
                            global.inputVal -= 0.01
                        }
                        // @ts-ignore
                        if (gesture.gestures[0].name == 'hand_close' && global.inputVal < 0.99) {
                            // @ts-ignore
                            global.inputVal += 0.01
                        }
                    }
                }
                ;

            }
        }

        runHandpose()

        document.addEventListener('pointermove', this._listener);
        document.body.style.touchAction = 'none';
    }
}
