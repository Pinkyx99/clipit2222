import React, { useState, useEffect, useRef } from 'react';
import { Streamer } from '../types';

interface ClipMiniGameProps {
    streamer: Streamer;
    onSuccess: () => void;
    onFailure: () => void;
    cooldown: number;
}

const ClipMiniGame: React.FC<ClipMiniGameProps> = ({ streamer, onSuccess, onFailure, cooldown }) => {
    const [position, setPosition] = useState(0);
    const [direction, setDirection] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const requestRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);

    const targetStart = 40; // in %
    const targetWidth = 20; // in %

    // Speed in percentage points per second. This is now frame-rate independent.
    const speed = 25;

    const animate = (time: number) => {
        if (lastTimeRef.current !== null) {
            const deltaTime = (time - lastTimeRef.current) / 1000; // in seconds
            setPosition(prev => {
                const newPos = prev + direction * speed * deltaTime;
                if (newPos >= 100) {
                    setDirection(-1);
                    return 100;
                }
                if (newPos <= 0) {
                    setDirection(1);
                    return 0;
                }
                return newPos;
            });
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (cooldown === 0 && !gameOver) {
            lastTimeRef.current = null; // Reset timer for the new animation cycle
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [cooldown, gameOver]);

    const handleClipAttempt = () => {
        if (gameOver || cooldown > 0) return;

        setGameOver(true);
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }

        if (position >= targetStart && position <= targetStart + targetWidth) {
            onSuccess();
        } else {
            onFailure();
        }
    };
    
    if(cooldown > 0){
        return (
             <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                <h2 className="text-2xl font-bold mb-4">Clip Failed!</h2>
                <p className="text-red-400 mb-2">You missed the moment.</p>
                <p className="text-gray-300">Try again in...</p>
                <p className="text-4xl font-bold text-yellow-400 my-4">{cooldown}s</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn" onClick={handleClipAttempt} role="button" tabIndex={0}>
            <h2 className="text-2xl font-bold mb-2">Clipping {streamer.name}</h2>
            <p className="text-gray-400 mb-8">Tap when the line is in the green zone!</p>

            <div className="w-full max-w-md bg-gray-700 rounded-full h-8 relative overflow-hidden" aria-hidden="true">
                {/* Target Zone */}
                <div
                    className="absolute top-0 h-full bg-green-500 bg-opacity-50"
                    style={{ left: `${targetStart}%`, width: `${targetWidth}%` }}
                ></div>
                {/* Moving Line */}
                <div
                    className="absolute top-0 h-full w-1 bg-red-500"
                    style={{ left: `${position}%` }}
                ></div>
            </div>
            <p className="mt-8 text-lg font-semibold">Tap anywhere to clip!</p>
        </div>
    );
};

export default ClipMiniGame;