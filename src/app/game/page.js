import { Suspense } from 'react'
import GameContainer from '../../components/GameContainer' 

export default function GamePage() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <GameContainer />
    </Suspense>
  )
}