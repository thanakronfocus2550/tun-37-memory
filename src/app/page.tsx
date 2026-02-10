"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  const rooms = ["6/1", "6/2", "6/3", "6/4", "6/5", "6/6", "6/7", "6/8", "6/9", "6/10", "6/11", "6/12", "6/13", "6/14"];
  const isReady = name.trim() !== '' && room !== '';

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 overflow-hidden relative font-sans text-slate-800">
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-pink-50/50 blur-[150px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center relative max-w-4xl w-full"
      >
        <h1 className="text-[70px] md:text-[120px] font-[900] tracking-[-0.05em] leading-[0.8] mb-12">
          <span className="text-slate-800">อภินิหาร</span><br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-pink-500">สะพานสูง</span>
        </h1>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mb-12 space-y-4 max-w-xs mx-auto"
        >
          <p className="text-slate-400 font-black tracking-[0.2em] uppercase text-[10px]">ระบุตัวตนรุ่น 37</p>
          
          <input 
            type="text" 
            placeholder="ชื่อเล่นของคุณ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-pink-50/50 border-2 border-pink-100 rounded-2xl px-6 py-4 text-center text-lg font-bold focus:outline-none focus:border-pink-400 transition-all placeholder:text-slate-300"
          />

          <select 
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full bg-pink-50/50 border-2 border-pink-100 rounded-2xl px-6 py-4 text-center text-lg font-bold focus:outline-none focus:border-pink-400 transition-all appearance-none cursor-pointer text-slate-600"
          >
            <option value="" disabled>เลือกห้องของคุณ</option>
            {rooms.map((r) => (
              <option key={r} value={r}>ม.{r}</option>
            ))}
          </select>
        </motion.div>

        <Link href={isReady ? `/game?name=${encodeURIComponent(name)}&room=${encodeURIComponent(room)}` : "#"}>
          <motion.button
            whileHover={isReady ? { scale: 1.05 } : {}}
            whileTap={isReady ? { scale: 0.95 } : {}}
            className={`px-12 py-6 rounded-[2rem] font-black text-2xl transition-all shadow-xl ${
              isReady ? 'bg-slate-900 text-white shadow-pink-100 hover:bg-pink-500' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            {isReady ? 'เริ่มบันทึก →' : 'กรอกข้อมูลให้ครบ'}
          </motion.button>
        </Link>
      </motion.div>

      <div className="fixed bottom-10 w-full text-center opacity-[0.05] pointer-events-none">
        <h2 className="text-[200px] font-black italic text-pink-500">37</h2>
      </div>
    </main>
  );
}