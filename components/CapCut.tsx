import React, { useState, useEffect, useRef } from 'react';
import { RawClip } from '../types';
import { PlayIcon, StarIcon, MusicNoteSmallIcon, SlidersIcon } from './icons/Icons';

interface CapCutProps {
    allClips: RawClip[];
    onFinishEditing: (clip: RawClip, quality: number) => void;
}

// --- Editor Mini-Game Components ---

const EffectsTimingGame: React.FC<{ onSuccess: () => void, onFail: () => void }> = ({ onSuccess, onFail }) => {
    const [position, setPosition] = useState(0);
    const [direction, setDirection] = useState(1);
    const requestRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);

    const targetStart = 45;
    const targetWidth = 10;
    const speed = 40; // % per second

    const animate = (time: number) => {
        if (lastTimeRef.current !== null) {
            const deltaTime = (time - lastTimeRef.current) / 1000;
            setPosition(prev => {
                const newPos = prev + direction * speed * deltaTime;
                if (newPos >= 100 || newPos <= 0) {
                    setDirection(d => -d);
                }
                return Math.max(0, Math.min(100, newPos));
            });
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const handleApplyEffect = () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        if (position >= targetStart && position <= targetStart + targetWidth) {
            onSuccess();
        } else {
            onFail();
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg w-full">
            <p className="text-sm text-gray-400 mb-4 text-center">Stop the marker in the green zone!</p>
            <div className="w-full bg-gray-900 rounded-full h-6 relative my-2 border border-gray-700">
                <div className="absolute top-0 h-full bg-green-500/50" style={{ left: `${targetStart}%`, width: `${targetWidth}%` }}></div>
                <div className="absolute top-0 h-full w-1 bg-yellow-400" style={{ left: `${position}%` }}></div>
            </div>
            <button onClick={handleApplyEffect} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Apply Effect
            </button>
        </div>
    );
};

const TrendingSoundGame: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [value, setValue] = useState(50);
    const [target] = useState(Math.floor(Math.random() * 61) + 20); // 20-80
    
    const isSuccess = Math.abs(value - target) <= 2;

    useEffect(() => {
        if (isSuccess) {
            setTimeout(onSuccess, 500);
        }
    }, [isSuccess, onSuccess]);

    return (
        <div className="bg-gray-800 p-4 rounded-lg w-full">
            <p className="text-sm text-gray-400 mb-4 text-center">Match the sound wave!</p>
            <div className="relative h-20">
                {/* Target Wave */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-green-500/50" style={{ transform: `translateY(-${target/4}px)` }}></div>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-green-500" style={{ clipPath: `polygon(0% ${100-target}%, 100% ${target}%, 100% 100%, 0% 100%)` }}></div>

                {/* User Wave */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-yellow-400" style={{ transform: `translateY(-${value/4}px)` }}></div>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                disabled={isSuccess}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer mt-4 ${isSuccess ? 'bg-green-500' : 'bg-gray-700'}`}
            />
        </div>
    );
};

const ColorGradeGame: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [values, setValues] = useState({ hue: 0, saturation: 50, brightness: 50 });
    const [targets] = useState({
        hue: Math.floor(Math.random() * 21) + 40, // 40-60
        saturation: Math.floor(Math.random() * 21) + 40,
        brightness: Math.floor(Math.random() * 21) + 40,
    });

    const isSuccess = 
        Math.abs(values.hue - targets.hue) <= 5 &&
        Math.abs(values.saturation - targets.saturation) <= 5 &&
        Math.abs(values.brightness - targets.brightness) <= 5;
        
    useEffect(() => {
        if (isSuccess) {
            setTimeout(onSuccess, 500);
        }
    }, [isSuccess, onSuccess]);
    
    const handleChange = (key: keyof typeof values, value: number) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg w-full space-y-4">
            <p className="text-sm text-gray-400 text-center">Find the perfect color grade.</p>
            <div>
                <label className="text-xs text-red-400">Hue</label>
                <input type="range" min="0" max="100" value={values.hue} onChange={e => handleChange('hue', Number(e.target.value))} className="w-full h-2 bg-red-400/50 rounded-lg appearance-none cursor-pointer accent-red-400" disabled={isSuccess} />
            </div>
             <div>
                <label className="text-xs text-green-400">Saturation</label>
                <input type="range" min="0" max="100" value={values.saturation} onChange={e => handleChange('saturation', Number(e.target.value))} className="w-full h-2 bg-green-400/50 rounded-lg appearance-none cursor-pointer accent-green-400" disabled={isSuccess} />
            </div>
             <div>
                <label className="text-xs text-blue-400">Brightness</label>
                <input type="range" min="0" max="100" value={values.brightness} onChange={e => handleChange('brightness', Number(e.target.value))} className="w-full h-2 bg-blue-400/50 rounded-lg appearance-none cursor-pointer accent-blue-400" disabled={isSuccess} />
            </div>
            {isSuccess && <p className="text-center text-green-400 font-bold">Perfect!</p>}
        </div>
    );
};


const TaskOverlay: React.FC<{ title: string, onClose: () => void, children: React.ReactNode }> = ({ title, onClose, children }) => (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fadeIn p-4">
        <div className="bg-gray-800 rounded-xl p-1 w-full max-w-sm border border-gray-700 relative">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white z-10 text-2xl leading-none">&times;</button>
            <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
                {children}
            </div>
        </div>
    </div>
);


const CheckmarkOverlay: React.FC = () => (
    <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    </div>
);

type ActiveTask = 'effects' | 'sound' | 'color';

const EditorView: React.FC<{ clip: RawClip; onFinish: (clip: RawClip, quality: number) => void; onBack: () => void; }> = ({ clip, onFinish, onBack }) => {
    const [tasks, setTasks] = useState({ effects: false, sound: false, color: false });
    const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [showFailMessage, setShowFailMessage] = useState(false);

    const tasksCompleted = Object.values(tasks).filter(Boolean).length;
    const isExportable = tasksCompleted >= 2;

    const handleExport = () => {
        if (!isExportable) return;
        setIsExporting(true);
        // Perfect quality for all 3 tasks, slightly lower for 2 tasks
        const quality = tasksCompleted === 3 ? 1.0 : 0.9;
        setTimeout(() => {
            onFinish(clip, quality);
        }, 1500);
    }
    
    const handleEffectFail = () => {
        setShowFailMessage(true);
        setTimeout(() => setShowFailMessage(false), 1500);
    }
    
    const handleTaskSuccess = (task: ActiveTask) => {
        setTasks(prev => ({...prev, [task]: true}));
        setActiveTask(null);
    };

    if (isExporting) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn bg-black">
                <h2 className="text-2xl font-bold mb-4">Exporting Video...</h2>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Quality: <span className="font-bold text-white">{tasksCompleted === 3 ? 'Perfect' : 'Good'}</span></p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-black text-white animate-fadeIn relative">
            {/* Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-3 bg-gray-900 border-b border-gray-800 z-10">
                <button onClick={onBack} className="text-gray-300 hover:text-white px-2 py-1 rounded-md">&larr; Clips</button>
                <h2 className="font-bold text-lg">Editor</h2>
                <button 
                    onClick={handleExport}
                    disabled={!isExportable || isExporting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-1.5 px-4 rounded-lg text-sm"
                >
                    {isExporting ? '...' : 'Export'}
                </button>
            </header>

            {/* Preview */}
            <main className="flex-grow flex items-center justify-center p-4">
                 <img src={clip.streamerImg} alt={clip.streamerName} className="max-h-full max-w-full object-contain rounded-lg shadow-lg" />
                 {showFailMessage && (
                    <div className="absolute bottom-24 bg-red-500 text-white font-bold py-2 px-4 rounded-lg animate-pulse">
                        Effect Failed! Try Again.
                    </div>
                )}
            </main>

            {/* Toolbar */}
            <footer className="flex-shrink-0 bg-gray-900 p-3 border-t border-gray-800">
                <div className="flex justify-around items-start">
                    <button onClick={() => setActiveTask('effects')} disabled={tasks.effects} className="flex flex-col items-center gap-1 text-gray-300 disabled:text-gray-500">
                        <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center relative">
                            <StarIcon />
                            {tasks.effects && <CheckmarkOverlay />}
                        </div>
                        <span className="text-xs font-semibold">Effects</span>
                    </button>
                    <button onClick={() => setActiveTask('sound')} disabled={tasks.sound} className="flex flex-col items-center gap-1 text-gray-300 disabled:text-gray-500 enabled:hover:text-white">
                        <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center relative">
                            <MusicNoteSmallIcon />
                            {tasks.sound && <CheckmarkOverlay />}
                        </div>
                        <span className="text-xs font-semibold">Sound</span>
                    </button>
                     <button onClick={() => setActiveTask('color')} disabled={tasks.color} className="flex flex-col items-center gap-1 text-gray-300 disabled:text-gray-500 enabled:hover:text-white">
                        <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center relative">
                            <SlidersIcon />
                            {tasks.color && <CheckmarkOverlay />}
                        </div>
                        <span className="text-xs font-semibold">Color</span>
                    </button>
                </div>
                 {isExportable && (
                    <p className="text-center text-xs text-yellow-400 mt-2">Ready to Export!</p>
                )}
            </footer>
            
            {activeTask === 'effects' && (
                <TaskOverlay title="Add Viral Effect" onClose={() => setActiveTask(null)}>
                    <EffectsTimingGame 
                        onSuccess={() => handleTaskSuccess('effects')}
                        onFail={() => {
                             setActiveTask(null);
                             handleEffectFail();
                        }}
                    />
                </TaskOverlay>
            )}
            {activeTask === 'sound' && (
                <TaskOverlay title="Find Trending Sound" onClose={() => setActiveTask(null)}>
                     <TrendingSoundGame onSuccess={() => handleTaskSuccess('sound')} />
                </TaskOverlay>
            )}
             {activeTask === 'color' && (
                <TaskOverlay title="Perfect the Color Grade" onClose={() => setActiveTask(null)}>
                     <ColorGradeGame onSuccess={() => handleTaskSuccess('color')} />
                </TaskOverlay>
            )}
        </div>
    );
};

const CapCut: React.FC<CapCutProps> = ({ allClips, onFinishEditing }) => {
    const [selectedClip, setSelectedClip] = useState<RawClip | null>(null);

    const generateClipName = (clip: RawClip): string => {
        const streamerClips = allClips
            .filter(c => c.streamerId === clip.streamerId)
            .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const clipIndex = streamerClips.findIndex(c => c.id === clip.id);
        const streamerName = clip.streamerName.toLowerCase().replace(/\s/g, '');
        return `${streamerName}.clip${clipIndex + 1}`;
    }

    if (!selectedClip) {
        return (
            <div className="animate-fadeIn h-full flex flex-col">
                <h1 className="text-2xl font-bold mb-4 text-center text-blue-400 flex-shrink-0">My Raw Clips</h1>
                {allClips.length === 0 ? (
                     <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-500 text-center">No raw clips to edit.<br/>Go capture some moments!</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                        {allClips.map(clip => (
                            <div 
                                key={clip.id} 
                                onClick={() => setSelectedClip(clip)}
                                className="bg-gray-800 p-3 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200 border border-transparent"
                            >
                                <img src={clip.streamerImg} alt={clip.streamerName} className="w-12 h-12 rounded-md flex-shrink-0 object-cover" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-white">{generateClipName(clip)}</p>
                                    <p className="text-xs text-gray-400">{new Date(clip.timestamp).toLocaleTimeString()}</p>
                                </div>
                                <PlayIcon />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    
    return <EditorView clip={selectedClip} onFinish={onFinishEditing} onBack={() => setSelectedClip(null)} />;
};

export default CapCut;