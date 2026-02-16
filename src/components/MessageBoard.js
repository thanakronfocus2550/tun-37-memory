"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'messages';
const EMOJI_OPTIONS = ['💖', '🔥', '😭', '🌸', '⭐', '🎓', '🏀', '✨'];
const rooms = ["ทุกห้อง", "6/1", "6/2", "6/3", "6/4", "6/5", "6/6", "6/7", "6/8", "6/9", "6/10", "6/11", "6/12", "6/13", "6/14"];

export default function MessageBoard() {
    const [messages, setMessages] = useState([]);
    const [filterRoom, setFilterRoom] = useState("ทุกห้อง");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', room: '6/1', text: '', emoji: '💖' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Real-time listener จาก Firestore
    useEffect(() => {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                time: doc.data().createdAt?.toDate()?.toLocaleString('th-TH') || 'เมื่อสักครู่',
            }));
            setMessages(msgs);
            setLoading(false);
        }, (error) => {
            console.error('Firestore error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.text.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, COLLECTION_NAME), {
                name: formData.name.trim(),
                room: formData.room,
                text: formData.text.trim(),
                emoji: formData.emoji,
                createdAt: serverTimestamp(),
            });
            setFormData({ name: '', room: '6/1', text: '', emoji: '💖' });
            setShowForm(false);
        } catch (err) {
            console.error('Error posting message:', err);
            alert('ส่งข้อความไม่สำเร็จ กรุณาลองใหม่');
        }
        setIsSubmitting(false);
    };

    const filteredMessages = filterRoom === "ทุกห้อง"
        ? messages
        : messages.filter(m => m.room === filterRoom);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 relative overflow-hidden">
            {/* Floating bg decorations */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl" />
            <div className="fixed bottom-20 right-10 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4 text-xs text-pink-400 font-bold uppercase tracking-widest hover:text-pink-600 transition-colors">
                        ← กลับหน้าแรก
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter mb-2">
                        กระดานข้อความ
                    </h1>
                    <p className="text-slate-400 font-light text-sm">ฝากข้อความถึงเพื่อนๆ รุ่น 37 ต.อ.น.</p>
                    <p className="text-pink-400 text-xs font-bold mt-2">
                        {loading ? '⏳ กำลังโหลด...' : `${messages.length} ข้อความ`}
                    </p>
                </div>

                {/* Room filter */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
                    {rooms.map(r => (
                        <button
                            key={r}
                            onClick={() => setFilterRoom(r)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filterRoom === r
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-200'
                                    : 'bg-white text-slate-400 hover:bg-pink-50 border border-slate-100'
                                }`}
                        >
                            {r === "ทุกห้อง" ? "🌟 ทุกห้อง" : `ม.${r}`}
                        </button>
                    ))}
                </div>

                {/* Write button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-2xl font-black text-sm shadow-xl shadow-pink-200/50 mb-6 flex items-center justify-center gap-2"
                >
                    ✍️ เขียนข้อความ
                </motion.button>

                {/* Form Modal */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        >
                            <motion.form
                                initial={{ scale: 0.8, y: 30 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 30 }}
                                onSubmit={handleSubmit}
                                className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl space-y-4"
                            >
                                <h3 className="text-xl font-black text-slate-800 text-center mb-2">✍️ เขียนข้อความ</h3>

                                <input
                                    type="text"
                                    placeholder="ชื่อเล่นของคุณ"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-pink-300 transition-all font-medium"
                                    required
                                />

                                <select
                                    value={formData.room}
                                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-pink-300 transition-all font-medium appearance-none"
                                >
                                    {rooms.filter(r => r !== "ทุกห้อง").map(r => (
                                        <option key={r} value={r}>ม.{r}</option>
                                    ))}
                                </select>

                                <textarea
                                    placeholder="เขียนข้อความถึงเพื่อนๆ..."
                                    value={formData.text}
                                    onChange={e => setFormData({ ...formData, text: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-pink-300 transition-all font-medium resize-none"
                                    required
                                />

                                {/* Emoji picker */}
                                <div className="flex gap-2 justify-center">
                                    {EMOJI_OPTIONS.map(em => (
                                        <button
                                            key={em}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, emoji: em })}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${formData.emoji === em ? 'bg-pink-100 scale-125 shadow-md' : 'bg-slate-50 hover:bg-pink-50'
                                                }`}
                                        >
                                            {em}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? '⏳ กำลังส่ง...' : 'โพสต์ข้อความ'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold active:scale-95 transition-all"
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            </motion.form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Message Cards */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {loading ? (
                            <div className="text-center py-16">
                                <div className="text-5xl mb-4 animate-bounce">⏳</div>
                                <p className="text-slate-300 font-bold">กำลังโหลดข้อความ...</p>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="text-5xl mb-4">💭</div>
                                <p className="text-slate-300 font-bold">ยังไม่มีข้อความในห้องนี้</p>
                                <p className="text-slate-300 text-xs mt-1">เป็นคนแรกที่ฝากข้อความสิ!</p>
                            </motion.div>
                        ) : (
                            filteredMessages.map((msg, i) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                                            {msg.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-black text-slate-800 text-sm">{msg.name}</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-400 font-bold">ม.{msg.room}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed break-words">{msg.text}</p>
                                            <p className="text-[10px] text-slate-300 mt-2 font-medium">{msg.time}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom spacing */}
                <div className="h-20" />
            </div>
        </div>
    );
}
