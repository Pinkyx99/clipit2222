import React from 'react';
import { PlayerState } from '../types';
import { GOALS, LEVEL_THRESHOLDS } from '../constants';
import ProgressBar from './ui/ProgressBar';

interface BankProps {
    gameState: PlayerState;
}

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4">
        <div className={`text-3xl ${color}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-lg font-bold">{value}</p>
        </div>
    </div>
);

const Bank: React.FC<BankProps> = ({ gameState }) => {
    const formatMoney = (amount: number) => {
        if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
        if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
        return `$${amount.toFixed(2)}`;
    };

    const formatFollowers = (amount: number) => {
        if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
        if (amount >= 1e3) return `${(amount / 1e3).toFixed(1)}K`;
        return amount;
    };

    const currentGoal = GOALS.find(g => gameState.level-1 >= g.level && (
        (g.type === 'followers' && gameState.followers < g.target) ||
        (g.type === 'money' && gameState.money < g.target)
    )) || GOALS[GOALS.length-1];

    const goalProgress = currentGoal.type === 'followers' ? gameState.followers : gameState.money;

    const xpForNextLevel = LEVEL_THRESHOLDS[gameState.level] || Infinity;
    const xpForCurrentLevel = LEVEL_THRESHOLDS[gameState.level - 1] || 0;
    const levelProgress = gameState.xp - xpForCurrentLevel;
    const levelMax = xpForNextLevel - xpForCurrentLevel;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-green-400">Financials</h1>
                <p className="text-gray-400">{gameState.tiktokUsername ? `Account: @${gameState.tiktokUsername}` : 'Your financial overview'}</p>
            </div>

             {gameState.randomEvent.active && (
                <div className="bg-purple-600 p-3 rounded-lg text-center font-semibold animate-pulse">
                    {gameState.randomEvent.message}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <StatCard label="Money" value={formatMoney(gameState.money)} icon={'💰'} color="text-green-400" />
                <StatCard label="Followers" value={formatFollowers(gameState.followers)} icon={'👥'} color="text-blue-400" />
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">Level {gameState.level}</p>
                    <p className="text-sm font-semibold">{gameState.xp} / {xpForNextLevel} XP</p>
                </div>
                <ProgressBar value={levelProgress} max={levelMax} colorClass="bg-yellow-500" />
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-lg font-bold mb-2">Current Goal</p>
                <p className="text-gray-300 mb-3">{currentGoal.description}</p>
                <ProgressBar value={goalProgress} max={currentGoal.target} colorClass="bg-green-500" />
                <p className="text-right text-sm mt-1 text-gray-400">
                    {currentGoal.type === 'followers' ? formatFollowers(goalProgress) : formatMoney(goalProgress)} / {currentGoal.type === 'followers' ? formatFollowers(currentGoal.target) : formatMoney(currentGoal.target)}
                </p>
            </div>
             {gameState.isPartner && (
                <div className="bg-green-500 bg-opacity-20 border border-green-500 p-3 rounded-lg text-center">
                    <h3 className="font-bold text-green-400">✓ TikTok Partner Unlocked!</h3>
                    <p className="text-sm text-gray-300">You now earn $2.00 per 1000 views!</p>
                </div>
            )}
        </div>
    );
};

export default Bank;