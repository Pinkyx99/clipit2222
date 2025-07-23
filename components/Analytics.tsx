import React, { useState } from 'react';
import { PlayerState } from '../types';
import LineChart from './ui/LineChart';
import { InformationCircleIcon } from './icons/Icons';

interface AnalyticsProps {
    gameState: PlayerState;
    onBack: () => void;
}

type AnalyticsTab = 'followers' | 'earnings';

const formatNumber = (num: number) => num.toLocaleString();

const StatCard: React.FC<{ label: string; value: string | number; subValue?: string, subColor?: string }> = ({ label, value, subValue, subColor = 'text-green-400' }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subValue && <p className={`text-sm font-semibold ${subColor}`}>{subValue}</p>}
    </div>
);

const FollowerAnalytics: React.FC<{ gameState: PlayerState }> = ({ gameState }) => {
    const last7DaysStats = gameState.dailyStats.slice(-7);
    const newFollowersLast7Days = last7DaysStats.reduce((sum, day) => sum + day.followersGained, 0);

    const prev7DaysFollowers = gameState.dailyStats.slice(-14, -7).reduce((sum, day) => sum + day.followersGained, 0);
    
    let growthRate = 0;
    if (prev7DaysFollowers > 0) {
        growthRate = ((newFollowersLast7Days - prev7DaysFollowers) / prev7DaysFollowers) * 100;
    } else if (newFollowersLast7Days > 0) {
        growthRate = 100; // Infinite growth if prev was 0
    }
    
    const chartLabels = gameState.dailyStats.map(s => s.date);
    const chartData = gameState.dailyStats.map(s => s.followersGained);

    return (
        <div className="space-y-4">
            <StatCard label="Total followers" value={formatNumber(gameState.followers)} />
            <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Follower History (Last {gameState.dailyStats.length} days)</p>
                <LineChart labels={chartLabels} data={chartData} color="#38bdf8" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <StatCard label="New followers" value={`+${formatNumber(newFollowersLast7Days)}`} subValue="last 7 days" />
                <StatCard 
                    label="Growth rate" 
                    value={`${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(2)}%`}
                    subValue="vs. previous 7 days"
                    subColor={growthRate >= 0 ? 'text-green-400' : 'text-red-400'}
                />
            </div>
        </div>
    );
};

const EarningsAnalytics: React.FC<{ gameState: PlayerState }> = ({ gameState }) => {
    const totalEarnings = gameState.postedVideos.reduce((sum, post) => sum + post.targetEarnings, 0);
    const last30DaysEarnings = gameState.dailyStats.slice(-30).reduce((sum, day) => sum + day.moneyGained, 0);
    
    const qualifiedViews = gameState.postedVideos.reduce((sum, post) => sum + post.targetViews, 0);
    const rpm = totalEarnings > 0 ? (totalEarnings / qualifiedViews) * 1000 : 0;
    
    const chartLabels = gameState.dailyStats.map(s => s.date);
    const chartData = gameState.dailyStats.map(s => s.moneyGained);

    return (
         <div className="space-y-4">
            <StatCard label="Total estimated rewards to date" value={totalEarnings.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
             <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Rewards Trend (Last {gameState.dailyStats.length} days)</p>
                <LineChart labels={chartLabels} data={chartData} color="#f472b6" />
            </div>
             <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Overview</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-400 flex items-center justify-center gap-1">Est. rewards <InformationCircleIcon/></p>
                        <p className="font-bold text-xl">{last30DaysEarnings.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-400 flex items-center justify-center gap-1">Qualified views <InformationCircleIcon/></p>
                        <p className="font-bold text-xl">{`${(qualifiedViews / 1_000_000).toFixed(1)}M`}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-400 flex items-center justify-center gap-1">RPM <InformationCircleIcon/></p>
                        <p className="font-bold text-xl">{rpm.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Analytics: React.FC<AnalyticsProps> = ({ gameState, onBack }) => {
    const [activeTab, setActiveTab] = useState<AnalyticsTab>('followers');

    return (
        <div className="h-full flex flex-col bg-gray-900 animate-fadeIn">
            <header className="flex-shrink-0 flex items-center p-3 bg-gray-800/80 backdrop-blur-md sticky top-0 z-10">
                <button onClick={onBack} className="text-sm text-blue-400">&larr; Profile</button>
                <h1 className="flex-grow text-center font-bold text-lg">Analytics</h1>
                <div className="w-16"></div>
            </header>
            <nav className="flex-shrink-0 flex border-b border-gray-700">
                <button 
                    onClick={() => setActiveTab('followers')} 
                    className={`flex-1 py-2 text-center text-sm font-semibold transition-colors ${activeTab === 'followers' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Followers
                </button>
                 <button 
                    onClick={() => setActiveTab('earnings')} 
                    className={`flex-1 py-2 text-center text-sm font-semibold transition-colors ${activeTab === 'earnings' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                 >
                    Earnings
                </button>
            </nav>
            <main className="flex-grow overflow-y-auto p-4 bg-black">
                {activeTab === 'followers' && <FollowerAnalytics gameState={gameState} />}
                {activeTab === 'earnings' && <EarningsAnalytics gameState={gameState} />}
            </main>
        </div>
    );
};

export default Analytics;