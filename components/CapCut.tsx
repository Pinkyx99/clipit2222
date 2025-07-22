
import React, { useState, useEffect } from 'react';
import { RawClip } from '../types';

interface CapCutProps {
    rawClip: RawClip;
    onFinishEditing: (clip: RawClip) => void;
}

const CapCut: React.FC<CapCutProps> = ({ rawClip, onFinishEditing }) => {
    const [progress, setProgress] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        let timer: number | undefined;
        if (isEditing && progress < 100) {
            timer = setTimeout(() => {
                setProgress(prev => Math.min(prev + 2, 100));
            }, 50);
        } else if (progress >= 100) {
            setTimeout(() => onFinishEditing(rawClip), 500);
        }
        return () => clearTimeout(timer);
    }, [isEditing, progress, onFinishEditing, rawClip]);

    const startEditing = () => {
        setIsEditing(true);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
            <h1 className="text-3xl font-bold mb-4 text-center text-blue-400">Clip Editor</h1>
            
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <p className="text-lg font-semibold mb-4">Clip Preview:</p>
                <div className="bg-black aspect-video rounded-md flex items-center justify-center mb-6 border-2 border-gray-700">
                    <img src={rawClip.streamerImg} alt={rawClip.streamerName} className="w-16 h-16 rounded-full"/>
                </div>

                {isEditing ? (
                    <div className="w-full">
                        <p className="mb-2 text-yellow-400">Processing...</p>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div className="bg-blue-500 h-4 rounded-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">{Math.round(progress)}%</p>
                    </div>
                ) : (
                    <button
                        onClick={startEditing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                        Start Editing
                    </button>
                )}
            </div>
        </div>
    );
};

export default CapCut;