'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/api';
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

const DEMO_CONVERSATIONS: Conversation[] = [
    {
        id: '1', name: 'Priya Sharma', username: 'priya_dev', avatar: '👩‍💻', college: 'IIT Bombay',
        lastMessage: 'Sure! I can share my Amazon prep notes', lastTime: '2m ago', unread: 2, online: true,
        messages: [
            { id: 'm1', text: 'Hey Priya! I saw you cleared Amazon OA. Congrats! 🎉', sender: 'me', time: '10:30 AM', read: true },
            { id: 'm2', text: 'Thanks! It was intense but manageable with practice', sender: 'them', time: '10:32 AM', read: true },
            { id: 'm3', text: 'Any tips for the coding rounds? I have mine next week', sender: 'me', time: '10:33 AM', read: true },
            { id: 'm4', text: 'Focus on sliding window and two-pointer. They love those patterns!', sender: 'them', time: '10:35 AM', read: true },
            { id: 'm5', text: 'Also practice their Leadership Principles — they ask behavioral Qs in every round', sender: 'them', time: '10:35 AM', read: true },
            { id: 'm6', text: 'Sure! I can share my Amazon prep notes', sender: 'them', time: '10:36 AM', read: false },
        ],
    },
    {
        id: '2', name: 'Arjun Patel', username: 'arjun_p', avatar: '👨‍🎓', college: 'NIT Trichy',
        lastMessage: 'That DP problem was tricky 😅', lastTime: '1h ago', unread: 0, online: true,
        messages: [
            { id: 'm1', text: 'Bro did you solve today\'s daily challenge?', sender: 'them', time: '9:15 AM', read: true },
            { id: 'm2', text: 'Yeah but took me 45 mins. The DP transition was hard to spot', sender: 'me', time: '9:20 AM', read: true },
            { id: 'm3', text: 'That DP problem was tricky 😅', sender: 'them', time: '9:22 AM', read: true },
        ],
    },
    {
        id: '3', name: 'Sneha Roy', username: 'sneha_codes', avatar: '👩‍💼', college: 'BITS Pilani',
        lastMessage: 'Let me know if you want to study together!', lastTime: '3h ago', unread: 1, online: false,
        messages: [
            { id: 'm1', text: 'Hi! I noticed we\'re both targeting PM roles. Want to prep together?', sender: 'them', time: 'Yesterday', read: true },
            { id: 'm2', text: 'That sounds great! I\'m preparing for Google PM', sender: 'me', time: 'Yesterday', read: true },
            { id: 'm3', text: 'Let me know if you want to study together!', sender: 'them', time: '3h ago', read: false },
        ],
    },
    {
        id: '4', name: 'Vikram Desai', username: 'vikram_d', avatar: '🧑', college: 'NIT Warangal',
        lastMessage: 'Check out this system design resource', lastTime: '1d ago', unread: 0, online: false,
        messages: [
            { id: 'm1', text: 'Check out this system design resource', sender: 'them', time: '1d ago', read: true },
        ],
    },
    {
        id: '5', name: 'Anjali Gupta', username: 'anjali_g', avatar: '👩', college: 'VIT Vellore',
        lastMessage: 'Thanks for the help with that SQL query!', lastTime: '2d ago', unread: 0, online: false,
        messages: [
            { id: 'm1', text: 'Can you help me with a SQL join query?', sender: 'them', time: '2d ago', read: true },
            { id: 'm2', text: 'Sure, use LEFT JOIN when you want all rows from the left table', sender: 'me', time: '2d ago', read: true },
            { id: 'm3', text: 'Thanks for the help with that SQL query!', sender: 'them', time: '2d ago', read: true },
        ],
    },
];

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>(DEMO_CONVERSATIONS);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

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
                                {filteredConversations.map(convo => (
                                    <button key={convo.id}
                                        onClick={() => { setActiveChat(convo.id); setConversations(prev => prev.map(c => c.id === convo.id ? { ...c, unread: 0 } : c)); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-slate-50 ${activeChat === convo.id ? 'bg-indigo-50' : 'hover:bg-slate-50'
                                            }`}
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
                                        {activeConvo.messages.map((msg, i) => (
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
