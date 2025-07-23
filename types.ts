export type AppName = 'twitch' | 'capcut' | 'tiktok' | 'whop' | 'clips' | 'bank' | 'settings';
export type GameView = 'homescreen' | AppName | 'clipping' | 'editing';

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
    editedClips: EditedClip[];
    activeCampaigns: Campaign[];
    availableCampaigns: Campaign[];
    lastLogin: string | null;
    randomEvent: { message: string, active: boolean };
    dailyStats: DailyStat[];
}

export interface DailyStat {
    date: string; // YYYY-MM-DD
    followersGained: number;
    moneyGained: number;
}

export interface Streamer {
    id: number;
    name: string;
    imgSrc: string;
    popularity: number; // 1-10 scale
    minViewers?: number;
    maxViewers?: number;
}

export interface RawClip {
    id: number;
    streamerId: number;
    streamerName: string;
    streamerImg: string;
    timestamp: Date;
}

export interface EditedClip extends RawClip {
    quality: number; // Represents editing performance (e.g., 1.0 for perfect, 0.9 for rushed)
}

export interface TikTokPost extends EditedClip {
    title: string;
    hashtags: string[];
    
    // Target (final) values
    targetViews: number;
    targetLikes: number;
    targetComments: number;
    targetShares: number;
    targetEarnings: number;
    targetFollowersGained: number;

    // Current, dynamic values
    currentViews: number;
    currentLikes: number;
    currentComments: number;
    currentShares: number;
    currentEarnings: number;
    currentFollowersGained: number;
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