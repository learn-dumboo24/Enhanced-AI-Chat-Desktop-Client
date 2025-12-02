import React, { useState } from 'react';
import Minimap from './components/Minimap';
import ChatWindow from './components/ChatWindow';
import DoubtsWindow from './components/DoubtsWindow';
import ThreadSidebar from './components/ThreadSidebar';
import Login from './components/Login';
import { useChat } from './context/ChatContext';

function App() {
    const { setDoubtsOpen, apiKey, setApiKey } = useChat();
    const [showSettings, setShowSettings] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return <Login onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-main text-white font-sans">
            {/* Sidebar / Minimap */}
            <div className="flex flex-col h-full">
                <Minimap />
                <div className="p-4 bg-sidebar border-t border-border border-r">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full p-2 bg-input rounded hover:bg-hover text-sm text-gray-300 mb-2"
                    >
                        Settings
                    </button>
                    <button
                        onClick={() => setDoubtsOpen(true)}
                        className="w-full p-2 bg-blue-600/20 text-blue-400 border border-blue-600/50 rounded hover:bg-blue-600/30 text-sm font-medium"
                    >
                        Quick Doubts
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <ChatWindow />

            {/* Right Sidebar (Threads) */}
            <ThreadSidebar />

            {/* Overlays */}
            <DoubtsWindow />

            {/* Settings Modal */}
            {showSettings && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm">
                    <div className="bg-sidebar p-6 rounded-xl w-96 border border-border shadow-2xl transform transition-all">
                        <h2 className="text-xl font-bold mb-4 text-white">Settings</h2>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">OpenAI API Key</label>
                            <input
                                type="password"
                                className="w-full p-3 bg-input rounded-lg border border-border focus:outline-none focus:border-blue-500 text-white placeholder-gray-600"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Your key is stored locally on your device.
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 text-white font-medium"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
