import './App.css';

import {Game} from './views/Game';
import React, {useRef} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import * as fp from 'fingerpose'

import {CloseHandGesture, OpenHandGesture} from "./HandPose"

function App() {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    return (
        <div className="App">
            <Game webcamRef={webcamRef} canvasRef={canvasRef}/>
            <Webcam
                ref={webcamRef}
                style={{
                    position: "fixed",
                    marginLeft: 'auto',
                    top: '10px',
                    right: '10px',
                    textAlign: "center",
                    zindex: 9,
                    width: 400,
                    height: 200,
                }}
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    marginLeft: "auto",
                    top: '10px',
                    right: '10px',
                    textAlign: "center",
                    zindex: 9,
                    width: 400,
                    height: 200,
                }}
            />
        </div>
    );
}

export default App;
