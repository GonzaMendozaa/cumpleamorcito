'use client'

import { AppProvider } from '@/context/AppContext'
import StarBackground  from '@/components/StarBackground'
import LoginModal      from '@/components/LoginModal'
import OwnerBar        from '@/components/OwnerBar'
import StageRouter     from '@/components/StageRouter'

export default function Home() {
  return (
    <AppProvider>
      <StarBackground />
      <div className="scanlines" />
      <StageRouter />
      <LoginModal />
      <OwnerBar />
    </AppProvider>
  )
}
