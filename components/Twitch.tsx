
import React from 'react';
import { Streamer } from '../types';

interface TwitchProps {
    streamers: Streamer[];
    onSelectStreamer: (streamer: Streamer) => void;
}

const Twitch: React.FC<TwitchProps> = ({ streamers, onSelectStreamer }) => {
    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">Browse Streamers</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {streamers.map(streamer => (
                    <div 
                        key={streamer.id} 
                        onClick={() => onSelectStreamer(streamer)}
                        className="bg-gray-800 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-700 hover:scale-105 transition-transform duration-300"
                    >
                        <img 
                            src={streamer.imgSrc} 
                            alt={streamer.name} 
                            className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-gray-700"
                        />
                        <p className="font-bold text-lg">{streamer.name}</p>
                        <p className="text-sm text-gray-400">Popularity: {streamer.popularity}/10</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Twitch;