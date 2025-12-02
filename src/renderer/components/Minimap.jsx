import React from 'react';
import { useChat } from '../context/ChatContext';

const Minimap = () => {
    const { conversations, activeTopicId, setActiveTopicId, addConversation } = useChat();

    return (
        <div className="w-[260px] bg-[#171717] flex flex-col h-full border-r border-white/10">
            {/* New Chat Button */}
            <div className="p-3">
                <button
                    onClick={() => addConversation('New Chat')}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-md border border-white/20 hover:bg-[#212121] transition-colors text-white text-sm text-left"
                >
                    <span className="text-lg">+</span>
                    New chat
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 custom-scrollbar">
                <div className="text-xs font-medium text-gray-500 px-3 py-2">Today</div>
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => setActiveTopicId(conv.id)}
                        className={`group flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer text-sm transition-colors ${activeTopicId === conv.id
                                ? 'bg-[#212121] text-white'
                                : 'text-gray-300 hover:bg-[#212121]'
                            }`}
                    >
                        <span className="text-gray-400">💬</span>
                        <span className="truncate flex-1">{conv.topic}</span>
                    </div>
                ))}
                {conversations.length === 0 && (
                    <div className="text-gray-500 text-center text-xs mt-4">
                        No history yet.
                    </div>
                )}
            </div>

            {/* User Profile / Bottom Section */}
            <div className="p-3 border-t border-white/10 mt-auto">
                <button className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-[#212121] transition-colors text-white text-sm">
                    <div className="w-8 h-8 bg-purple-600 rounded-sm flex items-center justify-center text-xs font-bold">
                        U
                    </div>
                    <div className="flex-1 text-left">
                        <div className="font-medium">User</div>
                        <div className="text-xs text-gray-400">Upgrade to Plus</div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Minimap;
