import React, { useState, useEffect } from 'react';
import { Streamer } from '../types';

interface TwitchProps {
    streamers: Streamer[];
    onSelectStreamer: (streamer: Streamer) => void;
}

const getRandomViewers = (min: number = 0, max: number = 0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const formatViewers = (viewers: number) => {
    return viewers >= 1000 ? `${(viewers / 1000).toFixed(1)}K` : viewers.toString();
};

const Twitch: React.FC<TwitchProps> = ({ streamers, onSelectStreamer }) => {
    const [viewerCounts, setViewerCounts] = useState<Record<number, number>>({});

    useEffect(() => {
        const counts: Record<number, number> = {};
        streamers.forEach(s => {
            counts[s.id] = getRandomViewers(s.minViewers, s.maxViewers);
        });
        setViewerCounts(counts);
    }, [streamers]);

    return (
        <div className="animate-fadeIn h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center text-purple-400 flex-shrink-0">Live Streamers</h1>
            <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                {streamers.map(streamer => (
                    <div 
                        key={streamer.id} 
                        onClick={() => onSelectStreamer(streamer)}
                        className="bg-gray-800 p-3 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    >
                        <img 
                            src={streamer.imgSrc} 
                            alt={streamer.name} 
                            className="w-14 h-14 rounded-full flex-shrink-0"
                        />
                        <div className="flex-grow">
                            <p className="font-bold text-lg">{streamer.name}</p>
                            <p className="text-sm text-gray-400">Playing Just Chatting</p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-gray-300">
                                {viewerCounts[streamer.id] ? formatViewers(viewerCounts[streamer.id]) : '...'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Twitch;