export type AppName = 'twitch' | 'capcut' | 'tiktok' | 'whop' | 'clips' | 'bank' | 'settings';
export type GameView = 'homescreen' | AppName | 'clipping' | 'editing' | 'posting';


export interface PlayerState {
    money: number;
    followers: number;
    xp: number;
    level: number;
    isPartner: boolean;
    tiktokUsername: string | null;
    tiktokPfp: string | null;
    postedVideos: TikTokPost[];
    rawClips: RawClip[];
    activeCampaigns: Campaign[];
    availableCampaigns: Campaign[];
    lastLogin: string | null;
    tutorialStep: number;
    randomEvent: { message: string, active: boolean };
}

export interface Streamer {
    id: number;
    name: string;
    imgSrc: string;
    popularity: number; // 1-10 scale
}

export interface RawClip {
    id: number;
    streamerId: number;
    streamerName: string;
    streamerImg: string;
    timestamp: Date;
}

export interface EditedClip extends RawClip {
    quality: number; // Based on player level
}

export interface TikTokPost extends EditedClip {
    title: string;
    hashtags: string[];
    views: number;
    likes: number;
    comments: number;
    shares: number;
    earnings: number;
}

export interface Campaign {
    id: number;
    name: string;
    streamerId: number;
    payoutPer1000Views: number;
    fee: number;
    description: string;
    active: boolean;
}