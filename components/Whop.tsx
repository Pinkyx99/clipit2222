
import React from 'react';
import { Campaign } from '../types';

interface WhopProps {
    campaigns: Campaign[];
    onJoinCampaign: (campaign: Campaign) => void;
    money: number;
}

const Whop: React.FC<WhopProps> = ({ campaigns, onJoinCampaign, money }) => {
    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">Whop Campaigns</h1>
            <div className="space-y-4">
                {campaigns.map(campaign => (
                    <div key={campaign.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-bold text-indigo-300">{campaign.name}</h2>
                        <p className="text-gray-400 mb-2">{campaign.description}</p>
                        <div className="flex justify-between items-center mt-3">
                            <div>
                                <p className="text-green-400 font-semibold">Payout: ${campaign.payoutPer1000Views}/1k views</p>
                                <p className="text-red-400 font-semibold">Fee: ${campaign.fee}</p>
                            </div>
                            <button
                                onClick={() => onJoinCampaign(campaign)}
                                disabled={money < campaign.fee || campaign.active}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                {campaign.active ? 'Joined' : 'Join'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Whop;