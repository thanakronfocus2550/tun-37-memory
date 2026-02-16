"use client";
import { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

export default function ShareCard({ userName, userRoom, scores, personalNote, onClose }) {
    const cardRef = useRef(null);

    const getTopPersonality = () => {
        const maxScore = Math.max(...Object.values(scores));
        const topKey = Object.keys(scores).find(key => scores[key] === maxScore);
        const personalities = {
            stealth: { title: "จอมเนียน", emoji: "🥷", color: "#6366f1" },
            chill: { title: "จอมชิลล์", emoji: "😎", color: "#06b6d4" },
            friendship: { title: "หัวใจของกลุ่ม", emoji: "💖", color: "#ec4899" },
            sport: { title: "นักกีฬาตัวเก่ง", emoji: "⚽", color: "#f59e0b" },
            student: { title: "นักเรียนตัวอย่าง", emoji: "📚", color: "#10b981" },
        };
        return personalities[topKey] || personalities.friendship;
    };

    const personality = getTopPersonality();

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
            });
            const link = document.createElement('a');
            link.download = `tun37-${userName}-memory.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Share card error:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-full max-w-sm"
            >
                {/* The card to be captured */}
                <div
                    ref={cardRef}
                    className="rounded-[2rem] overflow-hidden shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 60%, #f9a8d4 100%)' }}
                >
                    {/* Header */}
                    <div className="px-8 pt-8 pb-4">
                        <p className="text-[9px] font-black text-pink-400 uppercase tracking-[0.3em] mb-1">อภินิหารสะพานสูง</p>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">รุ่น 37</h2>
                    </div>

                    {/* Personality */}
                    <div className="px-8 py-6">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-inner border border-white/50">
                            <div className="text-5xl mb-3">{personality.emoji}</div>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: personality.color }}>
                                Your Personality
                            </p>
                            <h3 className="text-2xl font-black text-slate-800 mb-1">{personality.title}</h3>
                            <p className="text-xs text-slate-500 font-light">{userName} • ม.{userRoom}</p>
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="px-8 pb-6">
                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                            <p className="text-xs text-slate-600 leading-relaxed text-center font-medium">
                                "{personalNote}"
                            </p>
                        </div>
                    </div>

                    {/* Score bars */}
                    <div className="px-8 pb-6">
                        <div className="grid grid-cols-5 gap-1.5">
                            {Object.entries(scores).map(([key, val]) => {
                                const icons = { stealth: '🥷', chill: '😎', friendship: '💖', sport: '⚽', student: '📚' };
                                const maxScore = Math.max(...Object.values(scores), 1);
                                return (
                                    <div key={key} className="flex flex-col items-center">
                                        <div className="w-full h-16 bg-white/40 rounded-lg relative overflow-hidden">
                                            <div
                                                className="absolute bottom-0 w-full rounded-lg transition-all"
                                                style={{
                                                    height: `${(val / maxScore) * 100}%`,
                                                    background: personality.color + '80',
                                                }}
                                            />
                                        </div>
                                        <span className="text-[10px] mt-1">{icons[key]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer branding */}
                    <div className="px-8 pb-6 flex justify-between items-end">
                        <div>
                            <p className="text-[8px] text-pink-400 font-bold uppercase tracking-widest">ต.อ.น. • Class of 2026</p>
                        </div>
                        <div className="text-right opacity-10">
                            <p className="text-4xl font-black text-pink-500">37</p>
                        </div>
                    </div>
                </div>

                {/* Action buttons (outside card, not captured) */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleDownload}
                        className="flex-1 py-4 bg-pink-500 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
                    >
                        📥 ดาวน์โหลดรูป
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-4 bg-white/90 text-slate-600 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
                    >
                        ✕
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
