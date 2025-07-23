import React, { useState, useRef, useEffect } from 'react';
import { EditedClip, PlayerState, TikTokPost } from '../types';
import { VIRAL_HASHTAGS, STREAMERS } from '../constants';
import { HomeIcon, SearchIcon, PlusSquareIcon, MessageSquareIcon, UserIcon, HeartIcon, ShareIcon, MusicNoteIcon, GridIcon, LockIcon, ChartBarIcon } from './icons/Icons';
import Analytics from './Analytics';

type TikTokInternalView = 'feed' | 'profile' | 'select-clip' | 'create-post' | 'discover' | 'inbox' | 'analytics';

const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

// --- Sub-components for each view ---

const AccountCreation: React.FC<{ setGameState: React.Dispatch<React.SetStateAction<PlayerState>> }> = ({ setGameState }) => {
    const [username, setUsername] = useState('');
    const handleCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            const pfp = STREAMERS[Math.floor(Math.random() * STREAMERS.length)].imgSrc;
            setGameState(prev => ({...prev, tiktokUsername: username, tiktokPfp: pfp }));
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn p-4 bg-black">
            <h1 className="text-3xl font-bold mb-4 text-white">Create TikTok Account</h1>
            <form onSubmit={handleCreateAccount} className="w-full max-w-sm bg-gray-900 p-6 rounded-lg">
                <p className="mb-4 text-gray-300">Choose a username to start posting!</p>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                    aria-label="Enter username"
                />
                <button type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-lg">
                    Create Account
                </button>
            </form>
        </div>
    );
};

const FeedView: React.FC<{ postedVideos: TikTokPost[]; onProfileClick: () => void; initialPostIndex?: number }> = ({ postedVideos, onProfileClick, initialPostIndex }) => {
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialPostIndex !== undefined && feedRef.current) {
            const postElement = feedRef.current.children[initialPostIndex] as HTMLElement;
            if (postElement) {
                postElement.scrollIntoView({ behavior: 'instant' });
            }
        }
    }, [initialPostIndex]);

    if (postedVideos.length === 0) {
        return (
            <div className="text-center text-gray-500 flex flex-col justify-center items-center h-full px-4">
                <p className="text-2xl font-bold mb-2">Welcome to TikTok!</p>
                <p>Your feed is empty. Tap the [+] icon below to post your first video!</p>
            </div>
        );
    }
    
    return (
        <div ref={feedRef} className="h-full overflow-y-auto snap-y snap-mandatory">
            {postedVideos.map(post => (
                <div key={post.id} className="h-full w-full snap-start flex-shrink-0 relative bg-black">
                    {/* Video Background */}
                    <img src={post.streamerImg} alt={post.title} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* UI Overlay */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                        <div className="flex justify-between items-end">
                            {/* Left Side: Post Info */}
                            <div className="space-y-2 max-w-[calc(100%-60px)]">
                                <p className="font-bold text-lg cursor-pointer" onClick={onProfileClick}>@{post.streamerName}</p>
                                <p className="text-sm">{post.title}</p>
                                <p className="text-xs text-gray-300">{post.hashtags.join(' ')}</p>
                                <div className="flex items-center space-x-2">
                                    <MusicNoteIcon />
                                    <p className="text-sm truncate">original sound - @{post.streamerName}</p>
                                </div>
                            </div>
                            
                            {/* Right Side: Action Icons */}
                            <div className="flex flex-col items-center space-y-5">
                                <div className="flex flex-col items-center">
                                    <HeartIcon />
                                    <span className="text-sm font-semibold">{formatNumber(post.currentLikes)}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <MessageSquareIcon />
                                    <span className="text-sm font-semibold">{formatNumber(post.currentComments)}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <ShareIcon />
                                    <span className="text-sm font-semibold">{formatNumber(post.currentShares)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ProfileView: React.FC<{ gameState: PlayerState; onPostClick: (index: number) => void; onAnalyticsClick: () => void; }> = ({ gameState, onPostClick, onAnalyticsClick }) => {
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'private'
    const totalLikes = gameState.postedVideos.reduce((acc, p) => acc + p.currentLikes, 0);

    return (
        <div className="animate-fadeIn h-full overflow-y-auto text-white bg-black">
            {/* Header section with PFP and Username */}
            <div className="pt-6 pb-4 flex flex-col items-center">
                <img 
                    src={gameState.tiktokPfp || ''} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-2 border-gray-800 object-cover" 
                />
                <h2 className="text-xl font-bold mt-3">@{gameState.tiktokUsername}</h2>
            </div>

            {/* Stats: Following, Followers, Likes */}
            <div className="flex justify-center text-center mb-4 space-x-8">
                <div>
                    <p className="text-lg font-bold">{formatNumber(gameState.activeCampaigns.length * 3 + 15)}</p> 
                    <p className="text-sm text-gray-400">Following</p>
                </div>
                <div>
                    <p className="text-lg font-bold">{formatNumber(gameState.followers)}</p>
                    <p className="text-sm text-gray-400">Followers</p>
                </div>
                <div>
                    <p className="text-lg font-bold">{formatNumber(totalLikes)}</p>
                    <p className="text-sm text-gray-400">Likes</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-2 px-4 mb-4">
                <button className="flex-grow bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors">
                    Edit profile
                </button>
                 <button onClick={onAnalyticsClick} className="flex-grow bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                    <ChartBarIcon />
                    Analytics
                </button>
            </div>
            
            {/* Bio */}
            <div className="px-5 text-center text-sm mb-4">
                <p>Tech editor for Insider's reference section.</p>
                <p>Your #1 source for gaming clips and news! 🚀</p>
            </div>

            {/* Tabs */}
            <div className="flex border-t border-b border-gray-800">
                <button 
                    onClick={() => setActiveTab('posts')}
                    className={`w-1/2 py-2 flex justify-center items-center transition-colors ${activeTab === 'posts' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-white'}`}
                    aria-label="Your Posts"
                >
                    <GridIcon />
                </button>
                 <button 
                    onClick={() => setActiveTab('private')}
                    className={`w-1/2 py-2 flex justify-center items-center transition-colors ${activeTab === 'private' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-white'}`}
                    aria-label="Private Posts"
                 >
                    <LockIcon />
                </button>
            </div>

            {/* Content Grid */}
            {activeTab === 'posts' && (
                <div className="grid grid-cols-3 gap-0.5">
                    {gameState.postedVideos.length === 0 ? (
                        <div className="col-span-3 text-center text-gray-500 py-20">
                            <p className="font-bold">No posts yet</p>
                            <p className="text-sm">Your public videos will appear here.</p>
                        </div>
                    ) : (
                        gameState.postedVideos.map((post, index) => (
                            <div key={post.id} onClick={() => onPostClick(index)} className="relative aspect-[9/16] bg-gray-900 cursor-pointer group">
                                <img src={post.streamerImg} alt={post.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors"></div>
                                <div className="absolute bottom-1.5 left-1.5 flex items-center space-x-1 text-white text-xs font-bold drop-shadow-lg bg-black/25 px-1 rounded-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                    <span>{formatNumber(post.currentViews)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            {activeTab === 'private' && (
                <div className="col-span-3 text-center text-gray-500 py-20">
                    <p className="font-bold">This tab is private</p>
                    <p className="text-sm">Your private videos will appear here.</p>
                </div>
            )}
        </div>
    );
};

const SelectClipView: React.FC<{
    editedClips: EditedClip[];
    onSelectClip: (clip: EditedClip) => void;
}> = ({ editedClips, onSelectClip }) => {
    
    const generateClipName = (clip: EditedClip): string => {
        const streamerName = clip.streamerName.toLowerCase().replace(/\s/g, '');
        const clipIndex = clip.id.toString().slice(-4);
        return `${streamerName}.clip${clipIndex}.edited`;
    }

    return (
        <div className="animate-fadeIn p-4 text-white">
            <h1 className="text-2xl font-bold mb-4 text-center">Select a Clip to Post</h1>
            {editedClips.length === 0 ? (
                <div className="text-center text-gray-500 pt-16">
                    <p className="text-xl">No edited clips found!</p>
                    <p>Go to CapCut, edit a raw clip, and come back here to post it.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {editedClips.map(clip => (
                        <div key={clip.id} onClick={() => onSelectClip(clip)} className="bg-gray-800 p-3 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-gray-700">
                             <img src={clip.streamerImg} alt={clip.streamerName} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                             <p className="font-semibold text-white">{generateClipName(clip)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CreatePostView: React.FC<{
    clip: EditedClip;
    onPost: (clip: EditedClip, title: string, hashtags: string[]) => void;
}> = ({ clip, onPost }) => {
    const [title, setTitle] = useState('');
    const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
    
    const toggleHashtag = (tag: string) => {
        setSelectedHashtags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
         <div className="animate-fadeIn w-full p-4 text-white">
            <h1 className="text-2xl font-bold mb-4 text-center">Create Post</h1>
            <div className="bg-gray-900 p-4 rounded-lg">
                <div className="bg-black aspect-video rounded-md flex items-center justify-center mb-4 border-2 border-gray-700">
                    <img src={clip.streamerImg} alt={clip.streamerName} className="w-16 h-16 rounded-full" />
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title..."
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                    aria-label="Video title"
                />
                <div className="flex flex-wrap gap-2 mb-6">
                    {VIRAL_HASHTAGS.map(tag => (
                        <button key={tag} onClick={() => toggleHashtag(tag)} className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${selectedHashtags.includes(tag) ? 'bg-white text-black' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                            {tag}
                        </button>
                    ))}
                </div>
                <button onClick={() => onPost(clip, title, selectedHashtags)} disabled={!title} className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg">
                    Post to TikTok
                </button>
            </div>
        </div>
    );
};

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full text-gray-500 text-2xl font-bold">{title} Coming Soon</div>
)

// --- Main TikTok Component ---
interface TikTokProps {
    gameState: PlayerState;
    setGameState: React.Dispatch<React.SetStateAction<PlayerState>>;
    onPost: (clip: EditedClip, title: string, hashtags: string[]) => void;
}

const TikTok: React.FC<TikTokProps> = ({ gameState, setGameState, onPost }) => {
    const [internalView, setInternalView] = useState<TikTokInternalView>('feed');
    const [clipToPost, setClipToPost] = useState<EditedClip | null>(null);
    const [initialFeedIndex, setInitialFeedIndex] = useState<number | undefined>(undefined);

    if (!gameState.tiktokUsername) {
        return <AccountCreation setGameState={setGameState} />;
    }

    const handleSelectClip = (clip: EditedClip) => {
        setClipToPost(clip);
        setInternalView('create-post');
    };

    const handlePost = (clip: EditedClip, title: string, hashtags: string[]) => {
        onPost(clip, title, hashtags);
        setClipToPost(null);
        setInternalView('feed');
        setInitialFeedIndex(0);
    };
    
    const handleProfilePostClick = (index: number) => {
        setInitialFeedIndex(index);
        setInternalView('feed');
    }

    const renderInternalView = () => {
        switch (internalView) {
            case 'feed':
                return <FeedView postedVideos={gameState.postedVideos} onProfileClick={() => setInternalView('profile')} initialPostIndex={initialFeedIndex} />;
            case 'profile':
                return <ProfileView gameState={gameState} onPostClick={handleProfilePostClick} onAnalyticsClick={() => setInternalView('analytics')} />;
            case 'analytics':
                 return <Analytics gameState={gameState} onBack={() => setInternalView('profile')} />;
            case 'select-clip':
                return <SelectClipView editedClips={gameState.editedClips} onSelectClip={handleSelectClip} />;
            case 'create-post':
                if (clipToPost) {
                    return <CreatePostView clip={clipToPost} onPost={handlePost} />;
                }
                setInternalView('select-clip'); // Fallback if no clip is selected
                return null;
            case 'discover':
                return <PlaceholderView title="Discover" />;
            case 'inbox':
                return <PlaceholderView title="Inbox" />;
            default:
                return <FeedView postedVideos={gameState.postedVideos} onProfileClick={() => setInternalView('profile')} />;
        }
    };
    
    const NavButton: React.FC<{ label: string, view: TikTokInternalView, icon: React.ReactNode, isPostButton?: boolean }> = ({ label, view, icon, isPostButton }) => {
        const isActive = internalView === view;
        const className = isPostButton
            ? "flex-col !text-white w-12 h-8 bg-white rounded-md flex items-center justify-center text-black"
            : `flex-col ${isActive ? 'text-white' : 'text-gray-500'}`;

        const handleClick = () => {
            setInitialFeedIndex(undefined);
            setInternalView(view);
        };
        
        return (
            <button onClick={handleClick} className={`flex items-center justify-center text-xs font-semibold p-1 transition-colors ${className}`}>
                {icon}
                {!isPostButton && <span className="mt-1">{label}</span>}
            </button>
        )
    }

    return (
        <div className="flex flex-col h-full bg-black">
            <main className="flex-grow overflow-y-hidden">
                {renderInternalView()}
            </main>
            { internalView !== 'analytics' && (
                <nav className="flex-shrink-0 flex justify-around items-center h-16 bg-black border-t border-gray-800">
                    <NavButton label="For You" view="feed" icon={<HomeIcon />} />
                    <NavButton label="Discover" view="discover" icon={<SearchIcon />} />
                    <NavButton label="" view="select-clip" icon={<PlusSquareIcon />} isPostButton />
                    <NavButton label="Inbox" view="inbox" icon={<MessageSquareIcon />} />
                    <NavButton label="Me" view="profile" icon={<UserIcon />} />
                </nav>
            )}
        </div>
    );
};

export default TikTok;