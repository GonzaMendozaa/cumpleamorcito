'use client'

import { useState } from 'react'
import StarBackground from '@/components/StarBackground'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import CartaSection from '@/components/CartaSection'
import GiftBox from '@/components/GiftBox'

type ActiveSection = 'carta' | 'regalo'

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('carta')
  // El estado del regalo vive aquí para que no se reinicie al cambiar de sección
  const [giftOpened, setGiftOpened] = useState(false)

  function switchSection(section: ActiveSection) {
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <StarBackground />
      <div className="scanlines" />
      <Nav activeSection={activeSection} onSwitch={switchSection} />
      <Hero />
      <main>
        {activeSection === 'carta' && <CartaSection />}
        {activeSection === 'regalo' && (
          <GiftBox
            opened={giftOpened}
            onOpen={() => setGiftOpened(true)}
          />
        )}
      </main>
      <footer className="pixel-footer">
        hecho con ♥ para el día más especial del año
      </footer>
    </>
  )
}
