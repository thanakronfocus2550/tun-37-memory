import { Suspense } from 'react'
import GameContainer from '../../components/GameContainer'

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">กำลังโหลด...</div>}>
      <GameContainer />
    </Suspense>
  )
}