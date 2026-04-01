'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'them';
    time: string;
    read: boolean;
}

interface Conversation {
    id: string;
    name: string;
    username: string;
    avatar: string;
    college: string;
    lastMessage: string;
    lastTime: string;
    unread: number;
    online: boolean;
    messages: Message[];
}

export default function MessagesPage() {
    const { isReady } = useAuthGuard();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isReady) return;
        api.getConnections().then((res: any) => {
            const conns = res?.connections || [];
            const convos: Conversation[] = conns.map((c: any) => ({
                id: c.id || c.user_id,
                name: c.display_name || c.name || 'Unknown',
                username: c.username || '',
                avatar: c.avatar || (c.display_name?.[0] || '?'),
                college: c.college || c.college_name || '',
                lastMessage: c.last_message || 'Say hi! 👋',
                lastTime: c.last_message_at ? new Date(c.last_message_at).toLocaleDateString() : 'New',
                unread: c.unread_count || 0,
                online: c.online ?? false,
                messages: [],
            }));
            setConversations(convos);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [isReady]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat, conversations]);

    const activeConvo = conversations.find(c => c.id === activeChat);

    const sendMessage = () => {
        if (!newMessage.trim() || !activeChat) return;
        const msg: Message = {
            id: `m${Date.now()}`,
            text: newMessage.trim(),
            sender: 'me',
            time: 'Just now',
            read: false,
        };
        setConversations(prev => prev.map(c =>
            c.id === activeChat
                ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, lastTime: msg.time }
                : c
        ));
        setNewMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

    const filteredConversations = conversations.filter(c =>
        !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.college.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-0">
                    <div className="max-w-5xl mx-auto flex h-[calc(100vh-56px-96px)] md:h-[calc(100vh-56px)]">
                        {/* Sidebar — conversation list */}
                        <div className={`${activeChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-slate-200 bg-white shrink-0`}>
                            {/* Header */}
                            <div className="px-4 py-4 border-b border-slate-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h1 className="text-lg font-bold text-slate-900 st-font-heading">Messages</h1>
                                    {totalUnread > 0 && (
                                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">{totalUnread} new</span>
                                    )}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search conversations..." className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                                </div>
                            </div>

                            {/* Conversation list */}
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="animate-pulse">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-50">
                                                <div className="w-11 h-11 bg-slate-200 rounded-full shrink-0" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                                                    <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : filteredConversations.length === 0 ? (
                                    <div className="text-center py-12 px-4">
                                        <span className="text-4xl block mb-3">💬</span>
                                        <p className="text-sm text-slate-500">No conversations yet.<br />Connect with peers to start chatting!</p>
                                        <Link href="/network" className="mt-4 inline-block st-btn-primary text-sm px-5 py-2">Find Peers →</Link>
                                    </div>
                                ) : filteredConversations.map(convo => (
                                    <button key={convo.id}
                                        onClick={() => { setActiveChat(convo.id); setConversations(prev => prev.map(c => c.id === convo.id ? { ...c, unread: 0 } : c)); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-slate-50 ${activeChat === convo.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center text-lg">
                                                {convo.avatar}
                                            </div>
                                            {convo.online && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-sm text-slate-900 truncate">{convo.name}</p>
                                                <span className="text-[10px] text-slate-400 shrink-0 ml-2">{convo.lastTime}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-slate-500 truncate">{convo.lastMessage}</p>
                                                {convo.unread > 0 && (
                                                    <span className="shrink-0 ml-2 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                        {convo.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat area */}
                        <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-col flex-1 bg-white`}>
                            {activeConvo ? (
                                <>
                                    {/* Chat header */}
                                    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white">
                                        <button onClick={() => setActiveChat(null)} className="md:hidden text-slate-500 hover:text-slate-700 p-1">
                                            ←
                                        </button>
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center text-lg">
                                                {activeConvo.avatar}
                                            </div>
                                            {activeConvo.online && (
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/u/${activeConvo.username}`} className="font-semibold text-sm text-slate-900 hover:text-indigo-600 transition-colors">
                                                {activeConvo.name}
                                            </Link>
                                            <p className="text-[10px] text-slate-400">{activeConvo.college} · {activeConvo.online ? '🟢 Online' : 'Offline'}</p>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50">
                                        {activeConvo.messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                <span className="text-4xl mb-3">👋</span>
                                                <p className="text-sm text-slate-500">Start the conversation with {activeConvo.name}!</p>
                                            </div>
                                        ) : activeConvo.messages.map((msg, i) => (
                                            <motion.div key={msg.id}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.02 }}
                                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'me'
                                                    ? 'bg-indigo-600 text-white rounded-br-md'
                                                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-md shadow-sm'
                                                    }`}>
                                                    <p>{msg.text}</p>
                                                    <p className={`text-[9px] mt-1 ${msg.sender === 'me' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                        {msg.time} {msg.sender === 'me' && (msg.read ? '✓✓' : '✓')}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="px-4 py-3 border-t border-slate-100 bg-white">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={e => setNewMessage(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Type a message..."
                                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                            />
                                            <button onClick={sendMessage}
                                                disabled={!newMessage.trim()}
                                                className="shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                                ➤
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Empty state */
                                <div className="flex-1 flex items-center justify-center text-center px-8">
                                    <div>
                                        <span className="text-6xl block mb-4">💬</span>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Your Messages</h3>
                                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                            Connect with peers, mentors, and study partners. Start a conversation from someone&apos;s profile.
                                        </p>
                                        <Link href="/network" className="mt-4 inline-block st-btn-primary text-sm px-5 py-2">
                                            Find Peers →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
