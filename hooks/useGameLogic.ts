import React, { useState, useEffect, useCallback } from 'react';
import { PlayerState, EditedClip, Campaign, TikTokPost, RawClip } from '../types';
import { LEVEL_THRESHOLDS, INITIAL_CAMPAIGNS } from '../constants';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

const INITIAL_STATE: PlayerState = {
    money: 10,
    followers: 0,
    xp: 0,
    level: 1,
    isPartner: false,
    tiktokUsername: null,
    tiktokPfp: null,
    postedVideos: [],
    rawClips: [],
    activeCampaigns: [],
    availableCampaigns: INITIAL_CAMPAIGNS,
    lastLogin: null,
    tutorialStep: 0,
    randomEvent: { message: '', active: false },
};

const useGameLogic = () => {
    const [gameState, setGameState] = useLocalStorage<PlayerState>('clipItTycoonSave', INITIAL_STATE);

    const addMoney = useCallback((amount: number) => {
        setGameState(prev => ({ ...prev, money: prev.money + amount }));
    }, [setGameState]);

    const addFollowers = useCallback((amount: number) => {
        setGameState(prev => ({ ...prev, followers: prev.followers + amount }));
    }, [setGameState]);

    const addXp = useCallback((amount: number) => {
        const newXp = gameState.xp + amount;
        let newLevel = gameState.level;
        if (newLevel < LEVEL_THRESHOLDS.length && newXp >= LEVEL_THRESHOLDS[newLevel]) {
            newLevel++;
            // You can add a notification for level up here
        }
        setGameState(prev => ({ ...prev, xp: newXp, level: newLevel }));
    }, [gameState.xp, gameState.level, setGameState]);

    const levelUp = useCallback(() => {
        setGameState(prev => ({ ...prev, level: prev.level + 1 }));
    }, [setGameState]);
    
    const dailyLogin = useCallback(() => {
        const today = new Date().toDateString();
        if (gameState.lastLogin !== today) {
            const bonus = 50 + gameState.level * 10;
            addMoney(bonus);
            setGameState(prev => ({...prev, lastLogin: today}));
            // Here you can trigger a notification for the daily bonus
        }
    }, [gameState.lastLogin, gameState.level, addMoney, setGameState]);

    const postVideo = (clip: EditedClip, title: string, hashtags: string[]): TikTokPost => {
        const levelMultiplier = 1 + (gameState.level - 1) * 0.1;
        const partnershipMultiplier = gameState.isPartner ? 1.5 : 1;
        
        let baseViews = Math.floor(Math.random() * 4900) + 100;
        const isViral = Math.random() < (0.5 + (gameState.level * 0.01));
        if (isViral) {
            baseViews *= (Math.random() * 15 + 5); // Viral multiplier
        }

        const totalViews = Math.floor(baseViews * levelMultiplier * partnershipMultiplier);
        
        const payoutRate = gameState.isPartner ? 2 : 0.5;
        let earnings = (totalViews / 1000) * payoutRate;

        // Check for campaign bonus
        const activeCampaign = gameState.activeCampaigns.find(c => c.streamerId === clip.streamerId);
        if(activeCampaign){
            earnings += (totalViews / 1000) * activeCampaign.payoutPer1000Views;
        }

        const followersGained = Math.floor(totalViews / (Math.random() * 30 + 20));

        const newPost: TikTokPost = {
            ...clip,
            title,
            hashtags,
            views: totalViews,
            likes: Math.floor(totalViews * (Math.random() * 0.3 + 0.6)),
            comments: Math.floor(totalViews * (Math.random() * 0.05 + 0.01)),
            shares: Math.floor(totalViews * (Math.random() * 0.02 + 0.005)),
            earnings,
        };

        addMoney(earnings);
        addFollowers(followersGained);
        addXp(Math.floor(totalViews / 100));

        setGameState(prev => ({
            ...prev,
            postedVideos: [newPost, ...prev.postedVideos],
            isPartner: prev.followers + followersGained >= 10000 ? true : prev.isPartner
        }));
        
        return newPost;
    };
    
    const joinCampaign = (campaign: Campaign) => {
        if (gameState.money >= campaign.fee && !gameState.activeCampaigns.find(c => c.id === campaign.id)) {
            setGameState(prev => ({
                ...prev,
                money: prev.money - campaign.fee,
                activeCampaigns: [...prev.activeCampaigns, { ...campaign, active: true }],
            }));
        }
    };
    
    const checkForRandomEvent = useCallback(() => {
        const roll = Math.random();
        let message = '';
        if (roll < 0.05) { // 5% chance
            const bonusMoney = Math.floor(50 + Math.random() * 500);
            message = `Your clip went viral overnight! You earned an extra $${bonusMoney.toFixed(2)}!`;
            addMoney(bonusMoney);
        } else if (roll < 0.08) { // 3% chance
            message = "Editing software crash! You lost a raw clip and some time.";
            // This is just a message, but you could implement a penalty
        }
        
        if (message) {
            setGameState(prev => ({ ...prev, randomEvent: { message, active: true } }));
            setTimeout(() => {
                setGameState(prev => ({...prev, randomEvent: {message: '', active: false}}));
            }, 5000);
        }
    }, [addMoney, setGameState]);


    return { gameState, setGameState, dailyLogin, addMoney, addFollowers, addXp, levelUp, postVideo, joinCampaign, checkForRandomEvent };
};

export default useGameLogic;