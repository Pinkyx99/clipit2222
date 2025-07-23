import React, { useState, useEffect, useRef } from 'react';
import { FAKE_CHAT_USERS, FAKE_CHAT_MESSAGES } from '../constants';

interface ChatMessage {
    id: number;
    user: string;
    message: string;
    color: string;
}

const USER_COLORS = [
    'text-red-400', 'text-green-400', 'text-blue-400', 'text-yellow-400',
    'text-purple-400', 'text-pink-400', 'text-indigo-400', 'text-teal-400'
];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const LiveChat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const newMessage: ChatMessage = {
                id: Date.now() + Math.random(),
                user: getRandomElement(FAKE_CHAT_USERS),
                message: getRandomElement(FAKE_CHAT_MESSAGES),
                color: getRandomElement(USER_COLORS)
            };

            setMessages(prev => {
                const newMessages = [...prev, newMessage];
                if (newMessages.length > 50) {
                    return newMessages.slice(newMessages.length - 50);
                }
                return newMessages;
            });
        }, 400); // New message every 400ms

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="h-full bg-gray-900/80 p-2 flex flex-col-reverse overflow-hidden">
            <div className="space-y-1 overflow-y-auto pr-1">
                {messages.map(msg => (
                    <div key={msg.id} className="text-sm break-words leading-tight">
                        <span className={`font-bold ${msg.color}`}>{msg.user}:</span>
                        <span className="text-gray-200 ml-1.5">{msg.message}</span>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
        </div>
    );
};

export default LiveChat;
