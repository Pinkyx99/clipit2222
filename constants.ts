import { Streamer, Campaign } from './types';

export const STREAMERS: Streamer[] = [
    { id: 1, name: 'iShowSpeed', imgSrc: 'https://i.imgur.com/a8Rs1hS.jpg', popularity: 10, minViewers: 80000, maxViewers: 100000 },
    { id: 2, name: 'xQc', imgSrc: 'https://i.imgur.com/4D4bxDu.png', popularity: 9, minViewers: 20000, maxViewers: 50000 },
    { id: 3, name: 'Kai Cenat', imgSrc: 'https://i.imgur.com/EslwjyG.jpg', popularity: 10, minViewers: 90000, maxViewers: 120000 },
    { id: 4, name: 'Pokimane', imgSrc: 'https://i.imgur.com/PihoScn.jpg', popularity: 8, minViewers: 10000, maxViewers: 20000 },
];

export const FAKE_CHAT_USERS = ['Clipper_1', 'NoobMaster69', 'xX_Gamer_Xx', 'W_Enjoyer', 'ChatterBox', 'RandomViewer', 'SpeedFan_123', 'Juicer12', 'KaiMafia', 'PokiFan'];
export const FAKE_CHAT_MESSAGES = ['CLIP IT!', 'W MOMENT', 'L STREAMER', 'KEKW', 'OMEGALUL', 'WTF', 'POG', 'SO GOOD', 'EZ', 'Actually good', 'BORING', '🔥🔥🔥', '💀💀💀', 'GOATED', 'That was insane!', 'Chat, are you seeing this?'];


export const VIRAL_HASHTAGS = [
    '#fyp', '#gaming', '#viral', '#streamer', '#funny', '#fail', '#fortnite', '#minecraft', '#live', '#react'
];

export const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500, 3000, 6000, 10000, 15000, 25000]; // XP for each level

export const GOALS = [
    { level: 0, description: "Reach 10,000 TikTok followers.", target: 10000, type: 'followers' },
    { level: 1, description: "Earn your first $1,000.", target: 1000, type: 'money'},
    { level: 2, description: "Reach 100,000 TikTok followers.", target: 100000, type: 'followers'},
    { level: 3, description: "Become a millionaire!", target: 1000000, type: 'money'},
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
    { id: 1, name: 'Speed Reacts Collab', streamerId: 1, payoutPer1000Views: 5, fee: 100, description: 'Clip Speed\'s funniest reactions.', active: false },
    { id: 2, name: 'xQc Juicer Moments', streamerId: 2, payoutPer1000Views: 6, fee: 250, description: 'Find the best "juicer" clips from xQc.', active: false },
    { id: 3, name: 'Kai Cenat Mafia Highlights', streamerId: 3, payoutPer1000Views: 7, fee: 500, description: 'Clip the most intense Mafia game moments.', active: false },
    { id: 4, name: 'Poki\'s Wholesome Clips', streamerId: 4, payoutPer1000Views: 3, fee: 50, description: 'Share wholesome and funny clips.', active: false },
];