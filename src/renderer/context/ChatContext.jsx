import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState(() => {
        const saved = localStorage.getItem('conversations');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeTopicId, setActiveTopicId] = useState(null);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
    const [doubtsOpen, setDoubtsOpen] = useState(false);

    // Threading State
    const [activeThreadMsgId, setActiveThreadMsgId] = useState(null);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('conversations', JSON.stringify(conversations));
    }, [conversations]);

    useEffect(() => {
        localStorage.setItem('openai_api_key', apiKey);
    }, [apiKey]);

    const addConversation = (topic) => {
        const newConv = {
            id: Date.now().toString(),
            topic,
            messages: []
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveTopicId(newConv.id);
        return newConv.id;
    };

    const addMessage = (topicId, message, parentMsgId = null) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === topicId) {
                // If it's a thread reply
                if (parentMsgId) {
                    const updatedMessages = conv.messages.map(msg => {
                        if (msg.id === parentMsgId) {
                            return {
                                ...msg,
                                replies: [...(msg.replies || []), { ...message, id: Date.now().toString() }]
                            };
                        }
                        return msg;
                    });
                    return { ...conv, messages: updatedMessages };
                }

                // Normal message
                return {
                    ...conv,
                    messages: [...conv.messages, { ...message, id: Date.now().toString(), replies: [] }]
                };
            }
            return conv;
        }));
    };

    const openThread = (msgId) => {
        setActiveThreadMsgId(msgId);
        setRightSidebarOpen(true);
    };

    const closeThread = () => {
        setRightSidebarOpen(false);
        setActiveThreadMsgId(null);
    };

    const deleteConversation = (id) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeTopicId === id) setActiveTopicId(null);
    };

    return (
        <ChatContext.Provider value={{
            conversations,
            activeTopicId,
            setActiveTopicId,
            addConversation,
            addMessage,
            deleteConversation,
            apiKey,
            setApiKey,
            doubtsOpen,
            setDoubtsOpen,
            activeThreadMsgId,
            rightSidebarOpen,
            openThread,
            closeThread
        }}>
            {children}
        </ChatContext.Provider>
    );
};
