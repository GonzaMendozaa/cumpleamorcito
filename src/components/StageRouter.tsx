'use client'

import { useState } from 'react'
import EnvelopePage  from '@/components/EnvelopePage'
import CartaPage     from '@/components/CartaPage'
import FotosPage     from '@/components/FotosPage'
import MixtapePage   from '@/components/MixtapePage'
import MinijuegoPage from '@/components/MinijuegoPage'
import SorpresaPage  from '@/components/SorpresaPage'
import MenuPage      from '@/components/MenuPage'
import MenuFab       from '@/components/MenuFab'

type Stage = 'sobre' | 'carta' | 'fotos' | 'mixtape' | 'minijuego' | 'sorpresa' | 'menu'

export default function StageRouter() {
  const [stage,         setStage]         = useState<Stage>('sobre')
  const [cycleComplete, setCycleComplete] = useState(false)

  function goTo(next: Stage) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (next === 'menu') setCycleComplete(true)
    setStage(next)
  }

  return (
    <>
      <main className="stage-main">
        {stage === 'sobre'     && <EnvelopePage  onAbrir={() => goTo('carta')}     onSeguir={() => goTo('fotos')} />}
        {stage === 'carta'     && <CartaPage     onNext={() => goTo('fotos')}       onBack={() => goTo('sobre')} />}
        {stage === 'fotos'     && <FotosPage     onNext={() => goTo('mixtape')}     onBack={() => goTo('carta')} />}
        {stage === 'mixtape'   && <MixtapePage   onNext={() => goTo('minijuego')}   onBack={() => goTo('fotos')} />}
        {stage === 'minijuego' && <MinijuegoPage onNext={() => goTo('sorpresa')}    onBack={() => goTo('mixtape')} />}
        {stage === 'sorpresa'  && <SorpresaPage  onNext={() => goTo('menu')}        onBack={() => goTo('minijuego')} />}
        {stage === 'menu'      && <MenuPage      onGoTo={s => goTo(s as Stage)}     onBack={() => goTo('sorpresa')} />}
      </main>

      {cycleComplete && stage !== 'menu' && (
        <MenuFab onClick={() => goTo('menu')} />
      )}
    </>
  )
}
