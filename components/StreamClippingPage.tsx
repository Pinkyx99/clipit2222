import React, { useState, useEffect, useRef } from 'react';
import { Streamer } from '../types';
import LiveChat from './LiveChat';

interface StreamClippingPageProps {
    streamer: Streamer;
    onSuccess: () => void;
    onFailure: () => void;
    cooldown: number;
}

const StreamClippingPage: React.FC<StreamClippingPageProps> = ({ streamer, onSuccess, onFailure, cooldown }) => {
    const [position, setPosition] = useState(0);
    const [direction, setDirection] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const requestRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);

    const targetStart = 40; // in %
    const targetWidth = 20; // in %
    const speed = 25; // Speed in percentage points per second

    const animate = (time: number) => {
        if (lastTimeRef.current !== null) {
            const deltaTime = (time - lastTimeRef.current) / 1000;
            setPosition(prev => {
                const newPos = prev + direction * speed * deltaTime;
                if (newPos >= 100) { setDirection(-1); return 100; }
                if (newPos <= 0) { setDirection(1); return 0; }
                return newPos;
            });
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (cooldown === 0 && !gameOver) {
            lastTimeRef.current = null;
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [cooldown, gameOver]);

    const handleClipAttempt = () => {
        if (gameOver || cooldown > 0) return;
        setGameOver(true);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);

        if (position >= targetStart && position <= targetStart + targetWidth) {
            onSuccess();
        } else {
            onFailure();
        }
    };
    
    if (cooldown > 0) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn p-4 bg-black">
                <h2 className="text-2xl font-bold mb-4">Clip Failed!</h2>
                <p className="text-red-400 mb-2">You missed the moment.</p>
                <p className="text-gray-300">Try again in...</p>
                <p className="text-4xl font-bold text-yellow-400 my-4">{cooldown}s</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-gray-900">
            {/* Stream Player */}
            <div className="relative aspect-video bg-black flex-shrink-0 flex items-center justify-center border-b-2 border-purple-500">
                <img src={streamer.imgSrc} alt={streamer.name} className="w-full h-full object-cover opacity-60" />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</div>
                <div className="absolute bottom-2 left-2">
                    <h3 className="text-white font-bold text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{streamer.name}</h3>
                </div>
            </div>

            {/* Clipping and Chat container */}
            <div className="flex-grow flex flex-col min-h-0" onClick={handleClipAttempt} role="button" tabIndex={0}>
                {/* Clipping Game UI */}
                <div className="flex-shrink-0 p-4 text-center">
                    <p className="text-gray-400 mb-4">Tap anywhere to clip when the bar is in the green zone!</p>
                    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-8 relative overflow-hidden border border-gray-700">
                        <div className="absolute top-0 h-full bg-green-500 bg-opacity-50" style={{ left: `${targetStart}%`, width: `${targetWidth}%` }}></div>
                        <div className="absolute top-0 h-full w-1 bg-red-500" style={{ left: `${position}%` }}></div>
                    </div>
                </div>
                
                {/* Live Chat */}
                <div className="flex-grow min-h-0">
                    <LiveChat />
                </div>
            </div>
        </div>
    );
};

export default StreamClippingPage;