'use client'

import { AppProvider }     from '@/context/AppContext'
import StarBackground      from '@/components/StarBackground'
import LoginModal          from '@/components/LoginModal'
import OwnerBar            from '@/components/OwnerBar'
import StageRouter         from '@/components/StageRouter'
import BackgroundMusic     from '@/components/BackgroundMusic'

export default function Home() {
  return (
    <AppProvider>
      <StarBackground />
      <div className="scanlines" />
      <StageRouter />
      <BackgroundMusic />
      <LoginModal />
      <OwnerBar />
    </AppProvider>
  )
}
