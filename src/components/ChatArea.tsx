import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Paperclip, Mic, PanelLeftOpen } from 'lucide-react';

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatAreaProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ isSidebarOpen, toggleSidebar }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'assistant', content: 'Hello! How can I help you today?' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: messages.length + 1,
            role: 'user',
            content: input
        };

        setMessages([...messages, newMessage]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse: Message = {
                id: messages.length + 2,
                role: 'assistant',
                content: 'I am a simulated AI response. I can help you with React and TypeScript coding tasks.'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-main relative">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 px-5 py-2.5 flex items-center justify-between z-10">
                {!isSidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="bg-transparent border-none text-[#b4b4b4] cursor-pointer p-1.5 rounded-md hover:bg-hover hover:text-[#ececec]"
                    >
                        <PanelLeftOpen size={20} />
                    </button>
                )}
                <div className="font-semibold text-[#b4b4b4] cursor-pointer px-3 py-2 rounded-lg transition-colors hover:bg-hover hover:text-[#ececec]">
                    <span>GPT-4</span>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto pt-[60px] pb-[120px] flex flex-col gap-0 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`py-6 w-full border-b border-transparent ${msg.role === 'user' ? 'bg-transparent' : ''}`}>
                        <div className="max-w-[800px] mx-auto flex gap-5 px-5">
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-[30px]">
                                {msg.role === 'user' ? (
                                    <div className="w-[30px] h-[30px] bg-[#7c3aed] text-white rounded-sm flex items-center justify-center font-bold text-sm">
                                        U
                                    </div>
                                ) : (
                                    <div className="w-[30px] h-[30px] bg-[#10a37f] text-white rounded-sm flex items-center justify-center">
                                        <Bot size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Message Content */}
                            <div className="flex-1 text-[#ececec] text-base leading-relaxed">
                                <div className="font-semibold mb-1.5 text-sm">
                                    {msg.role === 'user' ? 'You' : 'ChatGPT'}
                                </div>
                                <div>{msg.content}</div>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-main from-20% to-transparent p-5 flex flex-col items-center">
                <div className="w-full max-w-[800px] bg-input border border-border rounded-xl px-3.5 py-2.5 flex items-end gap-2.5 shadow-[0_0_15px_rgba(0,0,0,0.1)] focus-within:border-[#666]">
                    <button className="bg-transparent border-none text-[#b4b4b4] cursor-pointer p-1.5 rounded-md flex items-center justify-center hover:text-[#ececec] hover:bg-[#404040]">
                        <Paperclip size={20} />
                    </button>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message ChatGPT..."
                        rows={1}
                        className="flex-1 bg-transparent border-none text-[#ececec] resize-none py-2 text-base outline-none placeholder:text-[#8e8ea0]"
                        style={{ height: 'auto', minHeight: '24px', maxHeight: '200px' }}
                    />

                    {input ? (
                        <button
                            onClick={handleSend}
                            className="bg-[#19c37d] text-white rounded p-1.5 cursor-pointer transition-all hover:bg-[#1a7f5a]"
                        >
                            <Send size={16} />
                        </button>
                    ) : (
                        <button className="bg-transparent border-none text-[#b4b4b4] cursor-pointer p-1.5 rounded-md flex items-center justify-center hover:text-[#ececec] hover:bg-[#404040]">
                            <Mic size={20} />
                        </button>
                    )}
                </div>

                <div className="text-xs text-[#6e6e80] mt-2.5 text-center">
                    ChatGPT can make mistakes. Consider checking important information.
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
