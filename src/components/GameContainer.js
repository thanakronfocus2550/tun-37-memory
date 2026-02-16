"use client";
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { tunStory } from '../data/story';
import MusicControl from './MusicControl';
import ShareCard from './ShareCard';

export default function GameContainer() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('name') || 'เพื่อน';
  const userRoom = searchParams.get('room') || '37';

  // --- States สำหรับ Version 1.2 ---
  const [currentStage, setCurrentStage] = useState('intro');
  const [secretStep, setSecretStep] = useState(0);
  const [secrets, setSecrets] = useState({ q1: "", q2: "", q3: "" });

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ stealth: 0, chill: 0, friendship: 0, sport: 0, student: 0 });
  const [showFinalFrame, setShowFinalFrame] = useState(false);

  const [viewingRoom, setViewingRoom] = useState(userRoom);
  const [photoIndex, setPhotoIndex] = useState(0);
  const maxPhotosPerRoom = 5;

  const [blessing, setBlessing] = useState("");
  const [isCleanView, setIsCleanView] = useState(false);
  const [shareStatus, setShareStatus] = useState("แชร์ความทรงจำ");
  const [showShareCard, setShowShareCard] = useState(false);

  const blessings = [
    "ขอให้แกได้เข้าคณะที่ฝันนะ มารีวิวชีวิตมหาลัยให้ฟังด้วย!",
    "โชคดีในโลกของคนโตนะ อย่าลืมรอยยิ้มตอนอยู่เตรียมฯ น้อมล่ะ",
    "คิดถึงวันปั่นงานวินาทีสุดท้ายกับพวกมึงว่ะ โชคดีนะทุกคน",
    "ถ้าเหนื่อยก็แค่แวะกลับมาเจกันที่ร้านหมูกระทะหน้าโรงเรียนนะ",
    "ดีใจที่ได้เป็นเพื่อนร่วมรุ่น 37 กับแกนะ",
    "ขอให้แกเติบโตไปเป็นผู้ใหญ่ที่มีความสุขที่สุดนะ"
  ];

  const secretQuestions = [
    { id: "q1", title: "มีอะไรจะบอกแต่ไม่กล้าบอกมั้ย?", placeholder: "ระบายออกมาได้เลย..." },
    { id: "q2", title: "ถ้าพรุ่งนี้ตื่นมาแล้วยังอยู่ ม.4 คุณจะทำอะไร?", placeholder: "อยากแก้ไขอะไรมั้ย..." },
    { id: "q3", title: "ฝากข้อความถึง 'ใครบางคน' ในรุ่น 37 หน่อย", placeholder: "บอกผ่านท้องฟ้าสะพานสูงไป..." }
  ];

  const randomBlessing = () => {
    const nextBlessing = blessings[Math.floor(Math.random() * blessings.length)];
    setBlessing(nextBlessing);
  };

  const handleChoice = (scoreKey) => {
    setScores(prev => ({ ...prev, [scoreKey]: prev[scoreKey] + 1 }));
    if (step < tunStory.length - 1) {
      setStep(step + 1);
    } else {
      setCurrentStage('secret');
    }
  };

  const handleSecretSubmit = () => {
    if (secretStep < secretQuestions.length - 1) {
      setSecretStep(secretStep + 1);
    } else {
      setCurrentStage('result');
    }
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
    // 🌸 1. หน้าบรรยายวันสุดท้าย (ตัวตรง)
    if (currentStage === 'intro') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm px-6 text-center font-sans">
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-pink-100">
            <h1 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">วันสุดท้ายที่... ต.อ.น.</h1>
            <p className="text-slate-500 leading-relaxed font-light mb-10">
              "ท้องฟ้าที่สะพานสูงวันนี้ดูแปลกไปกว่าทุกวัน... <br />
              เสียงกระดิ่งเลิกเรียนครั้งสุดท้ายกำลังจะดังขึ้น <br />
              เก็บความทรงจำของแกใส่กระเป๋า แล้วเดินไปด้วยกันนะ"
            </p>
            <button onClick={() => setCurrentStage('credits')} className="w-full py-4 bg-pink-500 text-white rounded-2xl font-black shadow-lg active:scale-95 transition-all">ถัดไป</button>
          </div>
        </motion.div>
      );
    }

    // 👤 2. หน้าจัดทำโดย (ปรับเป็น 2 คน + ตัวตรง)
    if (currentStage === 'credits') {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm px-6 text-center font-sans">
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-pink-100">
            <div className="flex justify-center gap-4 mb-6">
              {/* รูปมึง */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-200 shadow-md">
                <img src="/images/me.jpg" className="w-full h-full object-cover" onError={(e) => e.target.src = "/images/group-37.jpg"} />
              </div>
              {/* รูปเพื่อน (ถ้ามีไฟล์ me2.jpg) */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-200 shadow-md">
                <img src="/images/me2.jpg" className="w-full h-full object-cover" onError={(e) => e.target.src = "/images/group-37.jpg"} />
              </div>
            </div>
            <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2">Developed By</p>
            <h2 className="text-xl font-black text-slate-800 mb-2 leading-tight">ธนกร และ ธนกฤต</h2>
            <p className="text-slate-500 font-light mb-10 text-sm"><br /> รุ่น 37 ต.อ.น.</p>
            <button onClick={() => setCurrentStage('game')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg active:scale-95 transition-all">เริ่มบันทึกความทรงจำ</button>
          </div>
        </motion.div>
      );
    }

    // 📸 3. หน้าแกลเลอรี (ตัวตรง)
    if (showFinalFrame) {
      const roomFolder = viewingRoom.replace("/", "-");
      const photoSrc = `/images/room${roomFolder}/${photoIndex}.jpg`;
      return (
        <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md mx-auto px-4 py-6 font-sans">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 relative">
            <div className="aspect-[4/5] relative bg-slate-900">
              <AnimatePresence mode="wait">
                <motion.img key={`${viewingRoom}-${photoIndex}`} src={photoSrc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full object-cover" onError={(e) => { e.target.src = "/images/group-37.jpg"; }} />
              </AnimatePresence>
              {!isCleanView && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20">
                  <button onClick={() => setPhotoIndex(prev => (prev > 0 ? prev - 1 : maxPhotosPerRoom - 1))} className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center">←</button>
                  <button onClick={() => setPhotoIndex(prev => (prev < maxPhotosPerRoom - 1 ? prev + 1 : 0))} className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center">→</button>
                </div>
              )}
              <div className="absolute bottom-6 left-6 text-left">
                <h1 className="text-2xl font-black text-white">"ห้อง {viewingRoom} รุ่น 37"</h1>
                <p className="text-pink-400 text-[10px] font-bold uppercase tracking-widest">Memory {photoIndex + 1} / {maxPhotosPerRoom}</p>
              </div>
            </div>
            {!isCleanView && (
              <div className="p-6 space-y-6">
                <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-sm text-slate-600 text-center relative">"{blessing}"<button onClick={randomBlessing} className="block w-full mt-2 text-[9px] text-slate-400 underline uppercase">Random Blessing 🎲</button></div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleShare} className="py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all">🔗 {shareStatus}</button>
                  <button onClick={() => setIsCleanView(true)} className="py-3 bg-pink-100 text-pink-600 rounded-xl text-xs font-bold active:scale-95 transition-all">📸 Capture Mode</button>
                </div>
                <div className="pt-4 border-t border-slate-50">
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(14)].map((_, i) => (
                      <button key={i} onClick={() => { setViewingRoom(`6/${i + 1}`); setPhotoIndex(0); }} className={`py-2 rounded-lg text-[10px] font-bold transition-all ${viewingRoom === `6/${i + 1}` ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}>6/{i + 1}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {isCleanView && <button onClick={() => setIsCleanView(false)} className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-pink-500 text-white rounded-full text-xs font-bold shadow-2xl animate-bounce">Back to Normal</button>}
          </div>
        </motion.div>
      );
    }

    // 💬 4. หน้าคำถามความลับ (ตัวตรง)
    if (currentStage === 'secret') {
      const q = secretQuestions[secretStep];
      return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-sm px-6 font-sans">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border-t-8 border-pink-400">
            <p className="text-pink-300 text-[10px] font-black uppercase mb-4 tracking-widest">Secret Question {secretStep + 1}/3</p>
            <h2 className="text-xl font-black text-slate-800 mb-6">{q.title}</h2>
            <textarea
              className="w-full p-5 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-pink-300 mb-8 transition-all"
              placeholder={q.placeholder}
              rows="4"
              onChange={(e) => setSecrets({ ...secrets, [q.id]: e.target.value })}
            />
            <button onClick={handleSecretSubmit} className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all">ถัดไป →</button>
          </div>
        </motion.div>
      );
    }

    // 💌 5. หน้าจดหมาย (ตัวตรง)
    if (currentStage === 'result') {
      const personalNote = getPersonalNote();
      return (
        <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-auto px-6 py-10 font-sans">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border-t-[6px] border-pink-200 relative overflow-hidden">
            <div className="absolute top-6 right-6 opacity-[0.05] text-7xl font-black">37</div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Final Page • {userName} ม.{userRoom}</p>
            <div className="space-y-6 text-slate-600">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">แด่... {userName}</h2>
              <p className="text-sm leading-relaxed font-light">ยังจำวันแรกที่เดินผ่านรั้ว <span className="text-pink-400 font-bold">ต.อ.น.</span> ได้ไหม? จากคนแปลกหน้า สู่ความทรงจำที่จะอยู่กับเราตลอดไป...</p>
              <div className="p-5 bg-pink-50/50 rounded-2xl border-2 border-dashed border-pink-100 text-center">
                <p className="text-base font-bold text-pink-500">"{personalNote}"</p>
              </div>
              <p className="text-lg font-black text-slate-800 leading-tight">ขอบคุณที่เติบโตมาด้วยกันนะ <br /><span className="text-pink-400 font-bold">อภินิหารสะพานสูง</span> ตลอดไป</p>
            </div>
            <div className="mt-10 pt-6 border-t border-slate-50 space-y-3">
              <div className="flex justify-between items-center mb-4">
                <div><p className="text-[8px] font-bold text-pink-300 uppercase tracking-widest">Signed,</p><p className="text-sm font-black text-slate-800">Class 37 Archive</p></div>
                <button onClick={() => { setShowFinalFrame(true); randomBlessing(); }} className="px-6 py-3 bg-pink-500 text-white rounded-xl text-xs font-bold shadow-lg">เปิดภาพสุดท้าย →</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setShowShareCard(true)} className="py-3 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all">📸 สร้าง Share Card</button>
                <a href="/board" className="py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg text-center active:scale-95 transition-all block">💬 กระดานข้อความ</a>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // 🎮 6. หน้าเล่นเกม (ตัวตรง)
    const scene = tunStory[step];
    return (
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-sm mx-auto px-6 py-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-pink-50">
            <div className="h-52 relative overflow-hidden bg-pink-50">
              <motion.img key={step} src={scene?.image} className="w-full h-full object-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} />
              <div className="absolute top-4 right-6 text-pink-500/20 text-5xl font-black">{scene?.id}</div>
            </div>
            <div className="p-8">
              <h1 className="text-2xl font-black text-slate-800 mb-4 tracking-tighter uppercase">{scene?.title}</h1>
              <p className="text-slate-400 text-sm mb-8 font-light leading-relaxed">{scene?.description}</p>
              <div className="space-y-3">
                {scene?.choices.map((choice, i) => (
                  <button key={i} onClick={() => handleChoice(choice.score)} className="w-full p-4 rounded-2xl border border-slate-100 text-left text-xs font-bold text-slate-600 hover:bg-pink-500 hover:text-white transition-all group">
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
      <MusicControl />
      {showShareCard && (
        <ShareCard
          userName={userName}
          userRoom={userRoom}
          scores={scores}
          personalNote={getPersonalNote()}
          onClose={() => setShowShareCard(false)}
        />
      )}
      {renderView()}
    </div>
  );
}