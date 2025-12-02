import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { sendMessageToOpenAI } from '../services/api';

const ChatWindow = () => {
    const {
        conversations,
        activeTopicId,
        addMessage,
        apiKey,
        addConversation,
        setActiveTopicId,
        openThread
    } = useChat();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const activeConversation = conversations.find(c => c.id === activeTopicId);
    const messages = activeConversation ? activeConversation.messages : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeTopicId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        if (!apiKey) {
            alert('Please enter your OpenAI API Key in Settings.');
            return;
        }

        const userContent = input;
        setInput('');
        setIsLoading(true);

        let currentTopicId = activeTopicId;

        // If no active topic, create one
        if (!currentTopicId) {
            currentTopicId = addConversation(userContent.substring(0, 30) + (userContent.length > 30 ? '...' : ''));
            setActiveTopicId(currentTopicId);
        }

        // Add user message
        const userMessage = { role: 'user', content: userContent, timestamp: Date.now() };
        addMessage(currentTopicId, userMessage);

        try {
            const history = messages.slice(-10);
            const responseContent = await sendMessageToOpenAI([...history, userMessage], apiKey);

            const aiMessage = { role: 'assistant', content: responseContent, timestamp: Date.now() };
            addMessage(currentTopicId, aiMessage);
        } catch (error) {
            console.error(error);
            alert('Failed to get response: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!activeTopicId && conversations.length > 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-[#212121]">
                <div className="bg-[#2f2f2f] px-4 py-2 rounded-md text-sm text-gray-300">
                    Select a chat to start messaging
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#212121] relative h-full">
            {/* Header (Model Selector style) */}
            <div className="h-14 border-b border-white/10 flex items-center px-4 justify-between bg-[#212121] text-gray-200 font-medium">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#2f2f2f] px-2 py-1 rounded-md transition-colors">
                    <span>GPT-4</span>
                    <span className="text-xs opacity-50">▼</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col pb-32 pt-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center mt-20 text-white">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div key={idx} className="w-full text-gray-100 border-b border-black/5 dark:border-white/5 bg-[#212121]">
                            <div className="max-w-3xl mx-auto flex gap-6 p-6 group relative">
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-sm flex-shrink-0 flex items-center justify-center font-bold text-xs ${msg.role === 'user' ? 'bg-purple-600' : 'bg-[#10a37f]'
                                    }`}>
                                    {msg.role === 'user' ? 'U' : 'AI'}
                                </div>

                                {/* Content */}
                                <div className="relative flex-1 overflow-hidden">
                                    <div className="font-semibold text-sm mb-1 opacity-90">
                                        {msg.role === 'user' ? 'You' : 'ChatGPT'}
                                    </div>
                                    <div className="prose prose-invert max-w-none leading-7 text-[15px]">
                                        {msg.content}
                                    </div>

                                    {/* Thread Button - Only show if NO replies yet */}
                                    {(!msg.replies || msg.replies.length === 0) && (
                                        <button
                                            onClick={() => openThread(msg.id)}
                                            className="absolute -bottom-5 right-0 text-xs text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                        >
                                            <span className="text-lg">💬</span>
                                        </button>
                                    )}

                                    {/* Persistent Reply Link */}
                                    {msg.replies && msg.replies.length > 0 && (
                                        <div
                                            onClick={() => openThread(msg.id)}
                                            className="text-xs text-blue-400 mt-2 cursor-pointer hover:underline flex items-center gap-1"
                                        >
                                            <span className="text-lg">💬</span>
                                            {msg.replies.length} replies
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="w-full text-gray-100 bg-[#212121]">
                            <div className="max-w-3xl mx-auto flex gap-6 p-6">
                                <div className="w-8 h-8 bg-[#10a37f] rounded-sm flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2 h-4 bg-gray-400 animate-pulse inline-block"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-10 pb-6">
                <div className="max-w-3xl mx-auto px-4">
                    <form onSubmit={handleSendMessage} className="relative flex items-center w-full p-3 bg-[#2f2f2f] border border-white/10 rounded-xl shadow-lg focus-within:border-white/20 transition-colors">
                        <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                            <span className="text-xl">📎</span>
                        </button>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white p-2 focus:outline-none placeholder-gray-500 max-h-52 overflow-y-auto"
                            placeholder="Message ChatGPT..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`p-2 rounded-md transition-colors ${input.trim() ? 'bg-[#10a37f] text-white' : 'bg-transparent text-gray-500 cursor-not-allowed'
                                }`}
                            disabled={isLoading || !input.trim()}
                        >
                            <span className="text-lg">➤</span>
                        </button>
                    </form>
                    <div className="text-center text-xs text-gray-500 mt-2">
                        ChatGPT can make mistakes. Consider checking important information.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
