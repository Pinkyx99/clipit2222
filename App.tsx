import React, { useState, useEffect } from 'react';
import { GameView, Streamer, RawClip, EditedClip, AppName } from './types';
import useGameLogic from './hooks/useGameLogic';
import Twitch from './components/Twitch';
import ClipMiniGame from './components/ClipMiniGame';
import CapCut from './components/CapCut';
import TikTok from './components/TikTok';
import Whop from './components/Whop';
import { STREAMERS, TUTORIAL_STEPS } from './constants';
import TutorialPopup from './components/ui/TutorialPopup';
import PhoneFrame from './components/phone/PhoneFrame';
import HomeScreen from './components/phone/HomeScreen';
import AppView from './components/phone/AppView';
import Clips from './components/Clips';
import Bank from './components/Bank';

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
    const [rawClip, setRawClip] = useState<RawClip | null>(null);
    const [editedClip, setEditedClip] = useState<EditedClip | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [isTutorialPopupVisible, setTutorialPopupVisible] = useState(true);

    useEffect(() => {
        setTutorialPopupVisible(true);
    }, [gameState.tutorialStep]);
    
    const goHome = () => {
        setView('homescreen');
        setSelectedStreamer(null);
        setRawClip(null);
        setEditedClip(null);
    };

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
            tutorialStep: Math.max(prev.tutorialStep, 2)
        }));
        setRawClip(newClip);
        setView('editing');
    };

    const handleClipFailure = () => {
        setCooldown(30);
    };

    const handleEditingComplete = (clip: RawClip) => {
        const newEditedClip: EditedClip = {
            ...clip,
            quality: gameState.level,
        };
        setEditedClip(newEditedClip);
        setView('posting');
        setGameState(prev => ({...prev, tutorialStep: Math.max(prev.tutorialStep, 3)}));
    };

    const handlePost = (title: string, hashtags: string[]) => {
        if (editedClip) {
            postVideo(editedClip, title, hashtags);
            checkForRandomEvent();
            setEditedClip(null);
            setView('tiktok');
            setGameState(prev => ({...prev, tutorialStep: Math.max(prev.tutorialStep, 4)}));
        }
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
                    return <ClipMiniGame 
                        streamer={selectedStreamer}
                        onSuccess={() => handleClipSuccess(selectedStreamer)}
                        onFailure={handleClipFailure}
                        cooldown={cooldown}
                    />;
                }
                goHome(); return null;

            case 'editing':
                if(rawClip){
                    return <CapCut rawClip={rawClip} onFinishEditing={handleEditingComplete} />
                }
                goHome(); return null;

            case 'posting':
                if (editedClip) {
                    return <TikTok editedClip={editedClip} onPost={handlePost} gameState={gameState} setView={setView} setGameState={setGameState} />;
                }
                goHome(); return null;
            
            case 'twitch':
                return <AppView title="Twitch" goHome={goHome}><Twitch 
                    streamers={STREAMERS} 
                    onSelectStreamer={(s) => { 
                        setSelectedStreamer(s); 
                        setView('clipping');
                        setGameState(prev => ({...prev, tutorialStep: Math.max(prev.tutorialStep, 1)}));
                    }} 
                /></AppView>;

            case 'tiktok':
                 return <AppView title="TikTok" goHome={goHome}><TikTok editedClip={null} onPost={handlePost} gameState={gameState} setView={setView} setGameState={setGameState} /></AppView>;
           
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

    const closeTutorial = () => {
        setTutorialPopupVisible(false);
        if(gameState.tutorialStep === TUTORIAL_STEPS.length - 1){
             setGameState(prev => ({...prev, tutorialStep: 999})); // End tutorial
        }
    };

    return (
        <PhoneFrame>
            <div className="w-full h-full bg-black relative">
                {renderScreen()}
                {gameState.tutorialStep < TUTORIAL_STEPS.length && isTutorialPopupVisible && (
                    <TutorialPopup
                        step={gameState.tutorialStep}
                        content={TUTORIAL_STEPS[gameState.tutorialStep]}
                        onClose={closeTutorial}
                    />
                )}
            </div>
        </PhoneFrame>
    );
};

export default App;