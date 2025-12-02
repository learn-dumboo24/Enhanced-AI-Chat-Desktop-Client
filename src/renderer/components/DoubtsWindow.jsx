import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { sendMessageToOpenAI } from '../services/api';

const DoubtsWindow = () => {
    const { doubtsOpen, setDoubtsOpen, apiKey } = useChat();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!doubtsOpen) return null;

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseContent = await sendMessageToOpenAI([...messages, userMessage], apiKey);
            const aiMessage = { role: 'assistant', content: responseContent };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'system', content: 'Error: ' + error.message }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute bottom-20 right-8 w-96 h-[500px] bg-sidebar border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
            {/* Header */}
            <div className="bg-blue-600 p-3 flex justify-between items-center text-white">
                <span className="font-bold">Quick Doubts</span>
                <button
                    onClick={() => setDoubtsOpen(false)}
                    className="hover:bg-blue-700 rounded-full w-6 h-6 flex items-center justify-center"
                >
                    ×
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-main">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm mt-10">
                        Ask a quick question.<br />History is not saved here.
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-message-user text-gray-200'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-gray-500 text-xs ml-2">Thinking...</div>}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-2 bg-sidebar border-t border-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-input text-white p-2 rounded text-sm focus:outline-none focus:border-blue-500 border border-transparent"
                        placeholder="Ask anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-500"
                        disabled={isLoading}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DoubtsWindow;
