import React, { useState } from 'react';
import { EditedClip, GameView, PlayerState, TikTokPost } from '../types';
import { VIRAL_HASHTAGS, STREAMERS } from '../constants';

interface TikTokProps {
    editedClip: EditedClip | null;
    gameState: PlayerState;
    onPost: (title: string, hashtags: string[]) => void;
    setView: (view: GameView) => void;
    setGameState: React.Dispatch<React.SetStateAction<PlayerState>>;
}

const TikTok: React.FC<TikTokProps> = ({ editedClip, gameState, onPost, setView, setGameState }) => {
    const [title, setTitle] = useState('');
    const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
    const [username, setUsername] = useState('');

    if (!gameState.tiktokUsername && !editedClip) {
        const handleCreateAccount = (e: React.FormEvent) => {
            e.preventDefault();
            if (username.trim()) {
                 const pfp = STREAMERS[Math.floor(Math.random() * STREAMERS.length)].imgSrc;
                 setGameState(prev => ({...prev, tiktokUsername: username, tiktokPfp: pfp}));
            }
        };
        
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn p-4">
                <h1 className="text-3xl font-bold mb-4 text-red-500">Create TikTok Account</h1>
                <form onSubmit={handleCreateAccount} className="w-full max-w-sm bg-gray-800 p-6 rounded-lg">
                    <p className="mb-4 text-gray-300">Choose a username to start posting!</p>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                        aria-label="Enter username"
                    />
                    <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                        Create Account
                    </button>
                </form>
            </div>
        )
    }

    if (editedClip) {
        const toggleHashtag = (tag: string) => {
            setSelectedHashtags(prev =>
                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
            );
        };

        return (
            <div className="animate-fadeIn w-full max-w-lg mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-red-500">Post to TikTok</h1>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="bg-black aspect-video rounded-md flex items-center justify-center mb-4 border-2 border-gray-700">
                        <img src={editedClip.streamerImg} alt={editedClip.streamerName} className="w-16 h-16 rounded-full" />
                    </div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter video title..."
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                        aria-label="Video title"
                    />
                    <p className="font-semibold mb-2">Choose hashtags:</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {VIRAL_HASHTAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleHashtag(tag)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                                    selectedHashtags.includes(tag) 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => onPost(title, selectedHashtags)}
                        disabled={!title}
                        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                        Post to TikTok
                    </button>
                </div>
            </div>
        );
    }
    
    // TikTok Feed View
    const formatNumber = (num: number) => {
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
        return num;
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-800 rounded-lg">
                <img src={gameState.tiktokPfp || 'https://picsum.photos/seed/pfp/100/100'} alt="Profile picture" className="w-20 h-20 rounded-full" />
                <div>
                    <h2 className="text-2xl font-bold">{gameState.tiktokUsername || 'Clipper123'}</h2>
                    <p className="text-gray-400">{formatNumber(gameState.followers)} Followers</p>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-4">My Feed</h3>
            <div className="space-y-4">
                {gameState.postedVideos.length === 0 ? (
                    <p className="text-center text-gray-500 mt-8">You haven't posted any videos yet. Go clip something!</p>
                ) : (
                    gameState.postedVideos.map(post => (
                        <div key={post.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-start space-x-4">
                                <img src={post.streamerImg} alt={post.streamerName} className="w-12 h-12 rounded-lg" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{post.title || `Clip of ${post.streamerName}`}</p>
                                    <p className="text-xs text-gray-400">{post.hashtags.join(' ')}</p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-3 text-gray-300">
                                        <span>❤️ {formatNumber(post.likes)}</span>
                                        <span>💬 {formatNumber(post.comments)}</span>
                                        <span>🔗 {formatNumber(post.shares)}</span>
                                        <span className="font-bold text-green-400">💰 ${post.earnings.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-blue-400">{formatNumber(post.views)}</p>
                                    <p className="text-xs text-gray-500">views</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TikTok;