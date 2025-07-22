import React from 'react';
import { PlayerState } from '../types';

interface ClipsProps {
    gameState: PlayerState;
}

const Clips: React.FC<ClipsProps> = ({ gameState }) => {
    return (
        <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-yellow-300">My Raw Clips</h2>
            <div className="space-y-3">
                {gameState.rawClips.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No clips yet.</p>
                        <p className="text-gray-400">Go to the Twitch app and capture some moments!</p>
                    </div>
                ) : (
                    gameState.rawClips.map(clip => (
                        <div key={clip.id} className="bg-gray-800 p-3 rounded-lg flex items-center space-x-4">
                            <img src={clip.streamerImg} alt={clip.streamerName} className="w-12 h-12 rounded-md flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="font-semibold text-white">{clip.streamerName}</p>
                                <p className="text-xs text-gray-400">{new Date(clip.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Clips;