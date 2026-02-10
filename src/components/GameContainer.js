"use client"; 
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { tunStory } from '../data/story'; 

export default function GameContainer() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('name') || 'เพื่อน';
  const userRoom = searchParams.get('room') || '37';

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ stealth: 0, chill: 0, friendship: 0, sport: 0, student: 0 });
  const [showResult, setShowResult] = useState(false);
  const [showFinalFrame, setShowFinalFrame] = useState(false);

  const [viewingRoom, setViewingRoom] = useState(userRoom); 
  const [photoIndex, setPhotoIndex] = useState(0); 
  const maxPhotosPerRoom = 5; 

  const [blessing, setBlessing] = useState("");
  const [isCleanView, setIsCleanView] = useState(false);
  const [shareStatus, setShareStatus] = useState("แชร์ความทรงจำ");
  const audioRef = useRef(null);

  const blessings = [
    "ขอให้แกได้เข้าคณะที่ฝันนะ มารีวิวชีวิตมหาลัยให้ฟังด้วย!",
    "โชคดีในโลกของคนโตนะ อย่าลืมรอยยิ้มตอนอยู่เตรียมฯ น้อมล่ะ",
    "คิดถึงวันปั่นงานวินาทีสุดท้ายกับพวกมึงว่ะ โชคดีนะทุกคน",
    "ถ้าเหนื่อยก็แค่แวะกลับมาเจอกันที่ร้านหมูกระทะหน้าโรงเรียนนะ",
    "ดีใจที่ได้เป็นเพื่อนร่วมรุ่น 37 กับแกนะ",
    "ขอให้แกเติบโตไปเป็นผู้ใหญ่ที่มีความสุขที่สุดนะ"
  ];

  const randomBlessing = () => {
    const nextBlessing = blessings[Math.floor(Math.random() * blessings.length)];
    setBlessing(nextBlessing);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => console.log("Music standby"));
    }
  }, []);

  const handleChoice = (scoreKey) => {
    if (audioRef.current && audioRef.current.paused) audioRef.current.play();
    setScores(prev => ({ ...prev, [scoreKey]: prev[scoreKey] + 1 }));
    if (step < tunStory.length - 1) setStep(step + 1);
    else setShowResult(true);
  };

  const handleShare = () => {
    const shareData = { title: 'อภินิหารสะพานสูง - รุ่น 37', url: window.location.origin };
    if (navigator.share) navigator.share(shareData);
    else {
      navigator.clipboard.writeText(window.location.origin);
      setShareStatus("คัดลอกลิงก์แล้ว! ✅");
      setTimeout(() => setShareStatus("แชร์ความทรงจำ"), 2000);
    }
  };

  const getPersonalNote = () => {
    const maxScore = Math.max(...Object.values(scores));
    const topKey = Object.keys(scores).find(key => scores[key] === maxScore);
    const notes = {
      stealth: ["ความเนียนคือตำนาน แต่ความรักเพื่อน... เนียนลบไม่ได้จริงๆ", "จอมเนียนที่ทุกคนรัก ขอบคุณที่ทำให้ช่วงเวลาที่ตึงเครียดดูเบาลง"],
      chill: ["ความสุขไม่ได้อยู่ที่ความเร็ว แต่อยู่ที่ว่าเราเดินไปกับใคร", "จอมชิลล์แห่งสะพานสูง ขอบคุณที่เป็นพื้นที่ปลอดภัยให้เพื่อนๆ"],
      friendship: ["ทุกเสียงหัวเราะที่มีเธออยู่ด้วย มันคือจิ๊กซอว์ที่ขาดไม่ได้เลยนะ", "เธอคือหัวใจของกลุ่ม ขอบคุณที่คอยดึงทุกคนเข้าหากันในวันที่เหนื่อยล้า"],
      sport: ["ความมุ่งมั่นในสนามวันนั้น คือแรงบันดาลใจให้พวกเราก้าวต่อ", "เหงื่อทุกหยดในสนามโดมกีฬา คือพยานของความพยายามที่แสนงดงาม"],
      student: ["ตำราไม่ได้สอน วิธีบอกลาเพื่อนที่ร่วมสู้และเติบโตมาด้วยกัน", "ความตั้งใจของเธอจะเป็นแรงผลักดันให้เพื่อนๆ ก้าวสู่ความสำเร็จ"]
    };
    return notes[topKey]?.[Math.floor(Math.random() * 2)] || notes.friendship[0];
  };

  const renderView = () => {
    // 📸 หน้าแกลเลอรี (Mobile Optimized)
    if (showFinalFrame) {
      const roomFolder = viewingRoom.replace("/", "-"); 
      const photoSrc = `/images/room${roomFolder}/${photoIndex}.jpg`;

      return (
        <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md mx-auto px-4 py-6 font-sans">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 relative">
            
            {/* Image Section */}
            <div className="aspect-[4/5] relative bg-slate-900 group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`${viewingRoom}-${photoIndex}`} 
                  src={photoSrc} 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = "/images/group-37.jpg"; }} 
                />
              </AnimatePresence>
              
              {!isCleanView && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20">
                  <button onClick={() => setPhotoIndex(prev => (prev > 0 ? prev - 1 : maxPhotosPerRoom - 1))} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center">←</button>
                  <button onClick={() => setPhotoIndex(prev => (prev < maxPhotosPerRoom - 1 ? prev + 1 : 0))} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center">→</button>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-left">
                <h1 className="text-2xl font-black text-white italic">"ห้อง {viewingRoom} รุ่น 37"</h1>
                <p className="text-pink-400 text-[10px] font-bold tracking-widest uppercase">Memory {photoIndex + 1} / {maxPhotosPerRoom}</p>
              </div>
            </div>

            {/* UI Section */}
            {!isCleanView && (
              <div className="p-6 space-y-6">
                <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-sm text-slate-600 italic text-center relative">
                  "{blessing}"
                  <button onClick={randomBlessing} className="block w-full mt-2 text-[9px] text-slate-400 underline uppercase tracking-tighter">Random Blessing 🎲</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleShare} className="py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all">🔗 {shareStatus}</button>
                  <button onClick={() => setIsCleanView(true)} className="py-3 bg-pink-100 text-pink-600 rounded-xl text-xs font-bold active:scale-95 transition-all">📸 Capture Mode</button>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-300 uppercase mb-3 tracking-widest text-center">Select Room</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(14)].map((_, i) => (
                      <button key={i} onClick={() => { setViewingRoom(`6/${i+1}`); setPhotoIndex(0); }} className={`py-2 rounded-lg text-[10px] font-bold transition-all ${viewingRoom === `6/${i+1}` ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}>6/{i + 1}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {isCleanView && (
              <button onClick={() => setIsCleanView(false)} className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-pink-500 text-white rounded-full text-xs font-bold shadow-2xl animate-bounce">Back to Normal</button>
            )}
          </div>
          <button onClick={() => window.location.href = '/'} className="mt-8 text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] block mx-auto opacity-50">Close Archive</button>
        </motion.div>
      );
    }

    // 💌 หน้าจดหมาย (Mobile UI)
    if (showResult) {
      const personalNote = getPersonalNote();
      return (
        <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-auto px-6 py-10 font-sans">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border-t-[6px] border-pink-200 relative overflow-hidden">
            <div className="absolute top-6 right-6 opacity-[0.05] text-7xl font-black italic italic">37</div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Final Page • {userName} ม.{userRoom}</p>
            
            <div className="space-y-6 text-slate-600">
              <h2 className="text-2xl font-black text-slate-800 italic">แด่... {userName}</h2>
              <p className="text-sm leading-relaxed font-light">
                ยังจำวันแรกที่เดินผ่านรั้ว <span className="text-pink-400 font-bold">ต.อ.น.</span> ได้ไหม? จากคนแปลกหน้า สู่ความทรงจำที่จะอยู่กับเราไปตลอดชีวิต...
              </p>
              <div className="p-5 bg-pink-50/50 rounded-2xl border-2 border-dashed border-pink-100 text-center">
                <p className="text-base font-bold text-pink-500 italic">"{personalNote}"</p>
              </div>
              <p className="text-lg font-black text-slate-800 leading-tight">
                ขอบคุณที่เติบโตมาด้วยกันนะ <br/>
                <span className="text-pink-400 italic">อภินิหารสะพานสูง</span> ตลอดไป
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-50 flex justify-between items-center">
              <div>
                <p className="text-[8px] font-bold text-pink-300 uppercase tracking-widest">Signed,</p>
                <p className="text-sm font-black text-slate-800 italic">Class 37 Archive</p>
              </div>
              <button onClick={() => { setShowFinalFrame(true); randomBlessing(); }} className="px-6 py-3 bg-pink-500 text-white rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all">เปิดภาพสุดท้าย →</button>
            </div>
          </div>
        </motion.div>
      );
    }

    // 🎮 หน้าเล่นเกม (Mobile UI)
    return (
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-sm mx-auto px-6 py-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-pink-50">
            <div className="h-52 relative overflow-hidden bg-pink-50">
              <motion.img src={scene.image} className="w-full h-full object-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} />
              <div className="absolute top-4 right-6 text-pink-500/20 text-5xl font-black italic">{scene.id}</div>
            </div>
            <div className="p-8">
              <h1 className="text-2xl font-black text-slate-800 mb-4 tracking-tighter">{scene.title}</h1>
              <p className="text-slate-400 text-sm mb-8 font-light leading-relaxed">{scene.description}</p>
              <div className="space-y-3">
                {scene.choices.map((choice, i) => (
                  <button key={i} onClick={() => handleChoice(choice.score)} className="w-full p-4 rounded-2xl border border-slate-100 text-left text-xs font-bold text-slate-600 hover:bg-pink-500 hover:text-white active:scale-[0.98] transition-all group">
                    {choice.text} <span className="float-right opacity-0 group-hover:opacity-100">→</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                <motion.div className="h-full bg-pink-500" animate={{ width: `${((step + 1) / tunStory.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#fafafa] relative overflow-x-hidden">
      <audio ref={audioRef} src="/audio/bgm-main.mp3" loop preload="auto" />
      {renderView()}
    </div>
  );
}