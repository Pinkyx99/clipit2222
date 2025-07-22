import React from 'react';
import { GameView, PlayerState, AppName } from '../../types';
import { AppIcon, BankIcon, CogIcon, FilmIcon, FolderIcon, ScissorsIcon, ShoppingCartIcon, VideoCameraIcon } from '../icons/Icons';

interface HomeScreenProps {
    gameState: PlayerState;
    setView: (view: GameView) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ gameState, setView }) => {
    const isWhopUnlocked = gameState.isPartner;

    return (
        <div 
            className="w-full h-full bg-cover bg-center" 
            style={{backgroundImage: "url('https://picsum.photos/seed/phonebg/400/850')"}}
        >
            <div className="w-full h-full bg-black bg-opacity-20 backdrop-blur-sm p-6 flex flex-col justify-between">
                <div className="flex-grow grid grid-cols-4 gap-y-8 content-start pt-8">
                    <AppIcon label="Twitch" icon={<VideoCameraIcon />} gradient="bg-gradient-to-br from-purple-500 to-indigo-600" onClick={() => setView('twitch')} />
                    <AppIcon label="CapCut" icon={<ScissorsIcon />} gradient="bg-gradient-to-br from-blue-400 to-blue-600" onClick={() => setView('editing')} disabled={true} />
                    <AppIcon label="TikTok" icon={<FilmIcon />} gradient="bg-gradient-to-br from-red-500 via-pink-500 to-yellow-500" onClick={() => setView('tiktok')} />
                    <AppIcon label="Whop" icon={<ShoppingCartIcon />} gradient="bg-gradient-to-br from-indigo-500 to-purple-700" onClick={() => setView('whop')} disabled={!isWhopUnlocked} />
                    <AppIcon label="Clips" icon={<FolderIcon />} gradient="bg-gradient-to-br from-yellow-400 to-orange-500" onClick={() => setView('clips')} />
                    <AppIcon label="Bank" icon={<BankIcon />} gradient="bg-gradient-to-br from-green-500 to-emerald-600" onClick={() => setView('bank')} />
                    <AppIcon label="Settings" icon={<CogIcon />} gradient="bg-gradient-to-br from-gray-500 to-gray-700" onClick={() => setView('settings')} />
                </div>
                
                <div className="h-24 bg-gray-900 bg-opacity-40 backdrop-blur-lg rounded-3xl flex items-center justify-evenly">
                     <AppIcon label="" icon={<VideoCameraIcon />} gradient="bg-gradient-to-br from-purple-500 to-indigo-600" onClick={() => setView('twitch')} />
                     <AppIcon label="" icon={<ScissorsIcon />} gradient="bg-gradient-to-br from-blue-400 to-blue-600" onClick={() => {}} disabled={true} />
                     <AppIcon label="" icon={<FilmIcon />} gradient="bg-gradient-to-br from-red-500 via-pink-500 to-yellow-500" onClick={() => setView('tiktok')} />
                     <AppIcon label="" icon={<BankIcon />} gradient="bg-gradient-to-br from-green-500 to-emerald-600" onClick={() => setView('bank')} />
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;