import { Suspense } from 'react'
import GameContainer from '../../components/GameContainer'

export default function GamePage() {
  return (
    // ห่อด้วย Suspense เพื่อแก้ Build Error
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-pink-500 font-bold">กำลังโหลดความทรงจำ...</div>}>
      <GameContainer />
    </Suspense>
  )
}