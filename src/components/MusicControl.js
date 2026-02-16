"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicControl({ src = "/audio/bgm-main.mp3" }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseFloat(localStorage.getItem('tun37-volume') || '0.4');
        }
        return 0.4;
    });
    const [isMuted, setIsMuted] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('tun37-muted') === 'true';
        }
        return false;
    });
    const [showVolume, setShowVolume] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        localStorage.setItem('tun37-volume', volume.toString());
        localStorage.setItem('tun37-muted', isMuted.toString());
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <>
            <audio ref={audioRef} src={src} loop preload="auto" />
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
                {/* Volume Slider */}
                <AnimatePresence>
                    {showVolume && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-3 flex flex-col items-center gap-2 border border-pink-100"
                        >
                            {/* Vertical slider */}
                            <div className="h-24 flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setVolume(val);
                                        if (val > 0) setIsMuted(false);
                                    }}
                                    className="w-24 accent-pink-500"
                                    style={{
                                        transform: 'rotate(-90deg)',
                                        transformOrigin: 'center',
                                    }}
                                />
                            </div>
                            {/* Mute button */}
                            <button
                                onClick={toggleMute}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-100 text-red-500' : 'bg-pink-100 text-pink-500'
                                    }`}
                            >
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Play Button */}
                <div className="relative">
                    {/* Pulse ring when playing */}
                    {isPlaying && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-pink-400/30"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        onMouseEnter={() => setShowVolume(true)}
                        onMouseLeave={() => setShowVolume(false)}
                        className={`relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all border-2 ${isPlaying
                                ? 'bg-gradient-to-br from-pink-500 to-pink-600 border-pink-300 text-white'
                                : 'bg-white border-pink-200 text-pink-500'
                            }`}
                    >
                        <Music size={20} />
                    </motion.button>
                    {/* Touch-friendly: tap to toggle volume on mobile */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowVolume(prev => !prev); }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[8px] font-bold flex items-center justify-center shadow-md"
                    >
                        {isMuted ? '✕' : Math.round(volume * 100)}
                    </button>
                </div>
            </div>
        </>
    );
}
