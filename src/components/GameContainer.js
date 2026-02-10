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
  
  // 📸 จำนวนรูปสูงสุดในแต่ละ Folder (เริ่มนับจาก 0.jpg ไปเรื่อยๆ)
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
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
    }
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
      stealth: ["ความเนียนของเธอคือตำนาน แต่ความทรงจำที่มีให้เพื่อน... เนียนลบออกไปไม่ได้จริงๆ", "จอมเนียนที่ทุกคนรัก ขอบคุณที่ทำให้ช่วงเวลาที่ตึงเครียดดูเบาลงเสมอ"],
      chill: ["ขอบคุณที่สอนให้รู้ว่า ความสุขไม่ได้อยู่ที่ความเร็ว แต่อยู่ที่ว่าเราเดินไปกับใคร", "จอมชิลล์แห่งสะพานสูง ขอบคุณที่เป็นพื้นที่ปลอดภัยให้เพื่อนๆ ได้พักผ่อน"],
      friendship: ["ทุกเสียงหัวเราะที่มีเธออยู่ด้วย มันกลายเป็นจิ๊กซอว์ชิ้นสำคัญที่ขาดไม่ได้เลยนะ", "เธอคือหัวใจของกลุ่ม ขอบคุณที่คอยดึงทุกคนเข้าหากันในวันที่เหนื่อยล้า"],
      sport: ["ความมุ่งมั่นของเธอในสนามวันนั้น คือแรงบันดาลใจให้พวกเราก้าวต่อไปในวันนี้", "เหงื่อทุกหยดในสนามโดมกีฬา คือพยานของความพยายามที่แสนงดงาม"],
      student: ["ตำราเล่มไหนก็ไม่ได้สอน วิธีการบอกลาเพื่อนที่ร่วมสู้และเติบโตมาด้วยกัน", "ความตั้งใจของเธอจะเป็นแรงผลักดันให้เพื่อนๆ ก้าวไปสู่ความสำเร็จ"]
    };
    const possibleNotes = notes[topKey] || notes.friendship;
    return possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
  };

  const scene = tunStory[step];

  const renderView = () => {
    if (showFinalFrame) {
      // ✅ แก้จุดนี้: เปลี่ยนชื่อห้อง 6/1 เป็น 6-1 เพื่อหา Folder
      const roomFolder = viewingRoom.replace("/", "-"); 
      const photoSrc = `/images/room${roomFolder}/${photoIndex}.jpg`;

      return (
        <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl w-full p-4 text-center font-sans">
          <div className="bg-white rounded-[3.5rem] shadow-2xl p-6 md:p-10 relative overflow-hidden border-4 border-white">
            <div className="aspect-video relative rounded-[2.5rem] overflow-hidden bg-slate-900 mb-8 shadow-inner group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`${viewingRoom}-${photoIndex}`} 
                  src={photoSrc} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = "/images/group-37.jpg"; }} 
                />
              </AnimatePresence>

              {!isCleanView && (
                <>
                  <button 
                    onClick={() => setPhotoIndex(prev => (prev > 0 ? prev - 1 : maxPhotosPerRoom - 1))} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white z-20 font-bold"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => setPhotoIndex(prev => (prev < maxPhotosPerRoom - 1 ? prev + 1 : 0))} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white z-20 font-bold"
                  >
                    →
                  </button>
                </>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-10 left-10 text-left z-10">
                <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">"ห้อง {viewingRoom} รุ่น 37"</h1>
                <p className="text-pink-300 font-bold tracking-[0.6em] text-[10px] uppercase">Memory {photoIndex + 1} / {maxPhotosPerRoom}</p>
              </div>
            </div>

            {!isCleanView ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-pink-50/50 p-6 rounded-3xl mb-8 border border-pink-100 font-bold text-slate-700 italic">
                    "{blessing}" <br/>
                    <button onClick={randomBlessing} className="mt-2 text-[10px] text-slate-400 underline italic">สุ่มคำอวยพรใหม่ 🎲</button>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center">
                  <button onClick={handleShare} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all">🔗 {shareStatus}</button>
                  <button onClick={() => setIsCleanView(true)} className="px-8 py-4 bg-pink-100 text-pink-600 rounded-2xl font-black text-sm active:scale-95 transition-all">📸 โหมดเตรียมแคปรูป</button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8">
                  {[...Array(14)].map((_, i) => (
                    <button key={i} onClick={() => { setViewingRoom(`6/${i+1}`); setPhotoIndex(0); }} className={`py-3 rounded-xl border font-black text-xs transition-all ${viewingRoom === `6/${i+1}` ? 'bg-pink-500 text-white border-pink-500 shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-pink-50'}`}>6/{i + 1}</button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsCleanView(false)} className="px-10 py-4 bg-pink-500 text-white rounded-full font-black text-sm shadow-xl animate-bounce">กลับสู่โหมดปกติ</motion.button>
            )}
          </div>
          <button onClick={() => window.location.href = '/'} className="mt-12 text-slate-300 font-black text-[10px] uppercase tracking-[0.5em] hover:text-pink-400 transition-colors">Close Memory Archive</button>
        </motion.div>
      );
    }

    if (showResult) {
      const personalNote = getPersonalNote();
      return (
        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl w-full p-6 relative">
          <div className="absolute inset-0 bg-pink-50/30 blur-[120px] rounded-full -z-10" />
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} className="bg-[#fffdfd] backdrop-blur-sm border-t-8 border-pink-200 p-10 md:p-16 rounded-[2rem] shadow-2xl relative overflow-hidden text-left font-sans">
            <div className="absolute top-10 right-10 opacity-[0.03] select-none text-[120px] font-black italic">37</div>
            <div className="mb-12 text-slate-500">
              <p className="text-xs font-black tracking-[0.4em] uppercase mb-2">The Final Page • {userName} ม.{userRoom}</p>
              <div className="h-[1px] w-12 bg-pink-300" />
            </div>
            <div className="space-y-10 relative z-10 text-slate-600">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <h2 className="text-3xl font-[900] text-slate-800 tracking-tighter italic mb-4">แด่... {userName}</h2>
                <p className="text-lg leading-relaxed font-light">ยังจำวันแรกที่เดินผ่านประตูโรงเรียน <span className="text-pink-400 font-bold underline decoration-pink-100 underline-offset-4">เตรียมอุดมศึกษาน้อมเกล้า</span> เข้ามาได้ไหม? จากเด็กใหม่ที่ยังเคอะเขินในวันนั้น สู่พวกเราในวันนี้...</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="space-y-4 border-l-2 border-pink-100 pl-6 font-light italic text-slate-600">ภาพในโรงอาหารที่วุ่นวาย เสียงเฮจากโดมกีฬา หรือความเงียบในห้องสอบ... ทุกอย่างคือจิ๊กซอว์ของคำว่า <span className="text-pink-400 font-bold">"เพื่อน"</span></motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }} className="p-8 bg-pink-50/50 rounded-2xl border-dashed border-2 border-pink-200 text-center shadow-sm">
                <p className="text-xl md:text-2xl font-black text-pink-500 leading-tight italic">"{personalNote}"</p>
              </motion.div>
              <div className="pt-4 text-slate-800">
                <p className="text-2xl font-[900] tracking-tighter leading-tight">ขอบคุณที่เติบโตมาด้วยกันนะ<br/>จะเก็บเธอไว้ใน <span className="text-pink-400 font-bold italic">อภินิหารสะพานสูง</span> ตลอดไป</p>
              </div>
            </div>
            <div className="mt-16 pt-10 border-t border-slate-50 flex justify-between items-end">
              <div className="text-left">
                <p className="text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1 italic">Signed with Love,</p>
                <p className="text-2xl font-black text-slate-800 tracking-tighter italic font-serif">Class 37 Archive</p>
              </div>
              <button onClick={() => { setShowFinalFrame(true); randomBlessing(); }} className="px-12 py-5 bg-pink-500 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-pink-600 active:scale-95 transition-all">เปิดดูภาพสุดท้าย →</button>
            </div>
          </motion.div>
        </motion.div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="max-w-2xl w-full bg-white/90 backdrop-blur-2xl border border-pink-100 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <div className="h-80 bg-pink-50 relative overflow-hidden flex items-center justify-center">
             <motion.img key={step} src={scene.image} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="w-full h-full object-cover" />
             <div className="absolute top-6 right-8 text-pink-500/20 text-7xl font-black italic select-none">{scene.id}</div>
          </div>
          <div className="p-12 text-center md:text-left font-sans">
            <h1 className="text-4xl font-[900] mb-6 text-slate-800 tracking-tighter leading-tight">{scene.title}</h1>
            <p className="text-slate-500 mb-12 text-xl font-light leading-relaxed">{scene.description}</p>
            <div className="grid gap-5">
              {scene.choices.map((choice, i) => (
                <button key={i} onClick={() => handleChoice(choice.score)} className="w-full p-8 rounded-[2.5rem] border-2 border-pink-50 bg-white text-left shadow-sm hover:bg-pink-500 hover:text-white transition-all group">
                  <span className="text-xl font-bold font-sans">{choice.text}</span>
                  <span className="float-right text-pink-400 group-hover:text-white">→</span>
                </button>
              ))}
            </div>
          </div>
          <div className="px-12 pb-8">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-white">
              <motion.div className="h-full bg-pink-500" animate={{ width: `${((step + 1) / tunStory.length) * 100}%` }} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full relative overflow-x-hidden">
      <audio ref={audioRef} src="/audio/bgm-main.mp3" loop preload="auto" />
      {renderView()}
    </div>
  );
}