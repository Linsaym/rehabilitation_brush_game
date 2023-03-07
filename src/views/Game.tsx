import Bridges from './../bridges';
import React from 'react';

export const Game: React.FC = ({webcamRef, canvasRef}: any) => {
    const game = React.useRef<Bridges>();
    const containerRef = React.useRef<any>();

    React.useEffect(() => {
        if (!game.current) {
            game.current = new Bridges({
                duration: 30 * 60,
                isTraining: true,
                webcamRef,
                canvasRef,
            });

            containerRef.current.appendChild(game.current.view);
            game.current.resume();
        }
    }, []);

    return (
        <div className='game'>
            <div className='game__canvas-container' ref={containerRef}/>

            <div className="game__overlay"></div>
        </div>
    )
}