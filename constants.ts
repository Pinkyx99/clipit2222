
import { Streamer, Campaign } from './types';

export const STREAMERS: Streamer[] = [
    { id: 1, name: 'iShowSpeed', imgSrc: 'https://picsum.photos/seed/ishowspeed/100/100', popularity: 10 },
    { id: 2, name: 'xQc', imgSrc: 'https://picsum.photos/seed/xqc/100/100', popularity: 9 },
    { id: 3, name: 'Kai Cenat', imgSrc: 'https://picsum.photos/seed/kaicenat/100/100', popularity: 10 },
    { id: 4, name: 'Pokimane', imgSrc: 'https://picsum.photos/seed/pokimane/100/100', popularity: 8 },
    { id: 5, name: 'DrDisrespect', imgSrc: 'https://picsum.photos/seed/drdisrespect/100/100', popularity: 7 },
    { id: 6, name: 'Auronplay', imgSrc: 'https://picsum.photos/seed/auronplay/100/100', popularity: 9 },
];

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

export const TUTORIAL_STEPS = [
    "Welcome to Clip It Tycoon! Your goal is to get 10,000 followers. First, let's get a clip. Tap the 'Twitch' icon below and select a streamer.",
    "Great! Now for the fun part. Tap the screen when the moving bar is inside the green target zone to capture a clip!",
    "Awesome clip! Now let's edit it. Tap 'Start Editing' and wait for it to process. This is your 'CapCut' station.",
    "Perfectly edited! Time to post it. Give your video a title, add some hashtags, and hit 'Post to TikTok'!",
    "Your first video is up! Check your TikTok feed to see how it performs. Keep posting to gain followers and earn money. Good luck!",
];