import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { sendMessageToOpenAI } from '../services/api';

const ThreadSidebar = () => {
    const {
        conversations,
        activeTopicId,
        activeThreadMsgId,
        rightSidebarOpen,
        closeThread,
        addMessage,
        apiKey
    } = useChat();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const activeConversation = conversations.find(c => c.id === activeTopicId);
    const parentMessage = activeConversation?.messages.find(m => m.id === activeThreadMsgId);
    const replies = parentMessage?.replies || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [replies, rightSidebarOpen]);

    if (!rightSidebarOpen || !parentMessage) return null;

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userReply = { role: 'user', content: input, timestamp: Date.now() };
        addMessage(activeTopicId, userReply, activeThreadMsgId);
        setInput('');
        setIsLoading(true);

        try {
            // Context: Parent message + previous replies
            const contextMessages = [
                { role: parentMessage.role, content: parentMessage.content },
                ...replies.map(r => ({ role: r.role, content: r.content })),
                { role: 'user', content: userReply.content }
            ];

            const responseContent = await sendMessageToOpenAI(contextMessages, apiKey);
            const aiReply = { role: 'assistant', content: responseContent, timestamp: Date.now() };
            addMessage(activeTopicId, aiReply, activeThreadMsgId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-96 bg-sidebar border-l border-border flex flex-col h-full shadow-xl z-20">
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-sidebar">
                <h3 className="font-bold text-white">Thread</h3>
                <button onClick={closeThread} className="text-gray-400 hover:text-white">
                    ×
                </button>
            </div>

            {/* Parent Message Context */}
            <div className="p-4 bg-main/50 border-b border-border">
                <div className="text-xs text-gray-500 mb-1">Replying to:</div>
                <div className="text-sm text-gray-300 line-clamp-3 italic">
                    "{parentMessage.content}"
                </div>
            </div>

            {/* Replies */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-main">
                {replies.length === 0 && (
                    <div className="text-center text-gray-500 text-sm mt-4">
                        No replies yet. Start a thread!
                    </div>
                )}
                {replies.map((reply, idx) => (
                    <div key={idx} className={`flex ${reply.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] p-3 rounded-lg text-sm ${reply.role === 'user' ? 'bg-blue-600 text-white' : 'bg-message-user text-gray-200'
                            }`}>
                            {reply.content}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-gray-500 text-xs ml-2">Thinking...</div>}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendReply} className="p-4 bg-sidebar border-t border-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-input text-white p-2 rounded text-sm focus:outline-none focus:border-blue-500"
                        placeholder="Reply to thread..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-500"
                        disabled={isLoading || !input.trim()}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ThreadSidebar;
