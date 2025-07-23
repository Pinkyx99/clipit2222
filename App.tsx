import React, { useState, useEffect, useRef } from 'react';
import { GameView, Streamer, RawClip, EditedClip, AppName, TikTokPost, DailyStat } from './types';
import useGameLogic from './hooks/useGameLogic';
import Twitch from './components/Twitch';
import StreamClippingPage from './components/StreamClippingPage';
import CapCut from './components/CapCut';
import TikTok from './components/TikTok';
import Whop from './components/Whop';
import { STREAMERS, LEVEL_THRESHOLDS } from './constants';
import PhoneFrame from './components/phone/PhoneFrame';
import HomeScreen from './components/phone/HomeScreen';
import AppView from './components/phone/AppView';
import Clips from './components/Clips';
import Bank from './components/Bank';
import { BankIcon, FilmIcon, StarIcon } from './components/icons/Icons';


const App: React.FC = () => {
    const {
        gameState,
        setGameState,
        dailyLogin,
        postVideo,
        joinCampaign,
        checkForRandomEvent,
    } = useGameLogic();

    const [view, setView] = useState<GameView>('homescreen');
    const [selectedStreamer, setSelectedStreamer] = useState<Streamer | null>(null);
    const [cooldown, setCooldown] = useState(0);

    const goHome = () => {
        setView('homescreen');
        setSelectedStreamer(null);
    };

    // --- Main Game Loop for Gradual Stats & Analytics Data Recording ---
    useEffect(() => {
        const gameLoop = setInterval(() => {
            setGameState(prev => {
                let hasChanges = false;
                const newPostedVideos = [...prev.postedVideos];
                let moneyGainedThisTick = 0;
                let followersGainedThisTick = 0;
                
                for (let i = 0; i < newPostedVideos.length; i++) {
                    const post = { ...newPostedVideos[i] };
                    let postChanged = false;

                    // Increment views
                    if (post.currentViews < post.targetViews) {
                        const increment = Math.max(1, Math.ceil((post.targetViews - post.currentViews) * 0.05));
                        post.currentViews = Math.min(post.targetViews, post.currentViews + increment);
                        postChanged = true;
                    }

                    // Increment others based on view percentage
                    const progress = post.targetViews > 0 ? post.currentViews / post.targetViews : 1;
                    
                    const oldFollowers = post.currentFollowersGained;
                    post.currentLikes = Math.floor(progress * post.targetLikes);
                    post.currentComments = Math.floor(progress * post.targetComments);
                    post.currentShares = Math.floor(progress * post.targetShares);
                    post.currentEarnings = progress * post.targetEarnings;
                    post.currentFollowersGained = Math.floor(progress * post.targetFollowersGained);
                    
                    if(post.currentFollowersGained > oldFollowers) {
                        followersGainedThisTick += post.currentFollowersGained - oldFollowers;
                    }

                    if (postChanged) {
                        hasChanges = true;
                        newPostedVideos[i] = post;
                    }
                }
                
                const totalCurrentEarnings = newPostedVideos.reduce((sum, post) => sum + post.currentEarnings, 0);
                const totalPreviousEarnings = prev.postedVideos.reduce((sum, post) => sum + post.currentEarnings, 0);
                moneyGainedThisTick = totalCurrentEarnings - totalPreviousEarnings;
                
                if (hasChanges) {
                    const newFollowers = prev.followers + followersGainedThisTick;
                    const newXp = prev.xp + Math.floor(moneyGainedThisTick * 10);
                    let newLevel = prev.level;
                    if (newLevel < LEVEL_THRESHOLDS.length && newXp >= LEVEL_THRESHOLDS[newLevel]) {
                        newLevel++;
                    }

                    // --- New Analytics Data Recording Logic ---
                    const today = new Date().toISOString().split('T')[0];
                    let newDailyStats = [...(prev.dailyStats || [])];
                    const todayStatIndex = newDailyStats.findIndex(s => s.date === today);

                    if (todayStatIndex > -1) {
                        const todayStat = newDailyStats[todayStatIndex];
                        newDailyStats[todayStatIndex] = {
                            ...todayStat,
                            followersGained: todayStat.followersGained + followersGainedThisTick,
                            moneyGained: todayStat.moneyGained + moneyGainedThisTick,
                        };
                    } else {
                        newDailyStats.push({
                            date: today,
                            followersGained: followersGainedThisTick,
                            moneyGained: moneyGainedThisTick,
                        });
                    }

                    if (newDailyStats.length > 30) {
                        newDailyStats = newDailyStats.slice(-30);
                    }

                    return {
                        ...prev,
                        postedVideos: newPostedVideos,
                        money: prev.money + moneyGainedThisTick,
                        followers: newFollowers,
                        xp: newXp,
                        level: newLevel,
                        isPartner: newFollowers >= 10000 ? true : prev.isPartner,
                        dailyStats: newDailyStats,
                    };
                }

                return prev;
            });
        }, 1000); // Run loop every second

        return () => clearInterval(gameLoop);
    }, [setGameState]);

    const handleClipSuccess = (streamer: Streamer) => {
        const newClip: RawClip = {
            id: Date.now(),
            streamerId: streamer.id,
            streamerName: streamer.name,
            streamerImg: streamer.imgSrc,
            timestamp: new Date(),
        };
        setGameState(prev => ({
            ...prev,
            rawClips: [newClip, ...prev.rawClips].slice(0, 50),
        }));
        goHome();
    };

    const handleClipFailure = () => {
        setCooldown(30);
    };

    const handleEditingComplete = (clip: RawClip, quality: number) => {
        const newEditedClip: EditedClip = {
            ...clip,
            quality: quality,
        };
        
        setGameState(prev => ({
            ...prev,
            rawClips: prev.rawClips.filter(c => c.id !== clip.id),
            editedClips: [newEditedClip, ...prev.editedClips],
        }));
        goHome();
    };

    const handlePost = (clip: EditedClip, title: string, hashtags: string[]) => {
        postVideo(clip, title, hashtags);
        checkForRandomEvent();
    };
    
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);
    
    useEffect(() => {
        dailyLogin();
    }, [dailyLogin]);
    
    const renderScreen = () => {
        switch (view) {
            case 'homescreen':
                return <HomeScreen gameState={gameState} setView={setView} />;

            case 'clipping':
                if (selectedStreamer) {
                    return <StreamClippingPage 
                        streamer={selectedStreamer}
                        onSuccess={() => handleClipSuccess(selectedStreamer)}
                        onFailure={handleClipFailure}
                        cooldown={cooldown}
                    />;
                }
                goHome(); return null;

            case 'capcut':
                 return <AppView title="CapCut" goHome={goHome}><CapCut allClips={gameState.rawClips} onFinishEditing={handleEditingComplete} /></AppView>;
            
            case 'twitch':
                return <AppView title="Twitch" goHome={goHome}><Twitch 
                    streamers={STREAMERS} 
                    onSelectStreamer={(s) => { 
                        setSelectedStreamer(s); 
                        setView('clipping');
                    }} 
                /></AppView>;

            case 'tiktok':
                 return <AppView title="TikTok" goHome={goHome}><TikTok gameState={gameState} setGameState={setGameState} onPost={handlePost} /></AppView>;
           
            case 'whop':
                return <AppView title="Whop" goHome={goHome}><Whop campaigns={gameState.availableCampaigns} onJoinCampaign={joinCampaign} money={gameState.money} /></AppView>;
            
            case 'clips':
                return <AppView title="My Clips" goHome={goHome}><Clips gameState={gameState} /></AppView>;
            
            case 'bank':
                 return <AppView title="Bank & Goals" goHome={goHome}><Bank gameState={gameState} /></AppView>;

            case 'settings':
                return <AppView title="Settings" goHome={goHome}><div className="text-center text-gray-400">Settings coming soon!</div></AppView>
            
            default:
                goHome();
                return null;
        }
    };

    return (
        <PhoneFrame>
            <div className="w-full h-full bg-black relative">
                {renderScreen()}
            </div>
        </PhoneFrame>
    );
};

export default App;