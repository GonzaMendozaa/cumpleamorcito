'use client'

import { useState, useEffect, useRef } from 'react'

const TOTAL = 15
const EMOJIS = ['💖', '💕', '💗', '💓', '💝']

interface HeartItem {
  id:       number
  x:        number
  duration: number
  size:     number
  emoji:    string
}

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function MinijuegoPage({ onNext, onBack }: Props) {
  const [hearts,  setHearts]  = useState<HeartItem[]>([])
  const [caught,  setCaught]  = useState(0)
  const [done,    setDone]    = useState(false)
  const [showWin, setShowWin] = useState(false)

  const doneRef    = useRef(false)
  const counterRef = useRef(0)
  const idRef      = useRef(0)
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (doneRef.current) return
      const heart: HeartItem = {
        id:       idRef.current++,
        x:        5 + Math.random() * 88,
        duration: 2200 + Math.random() * 1800,
        size:     24 + Math.floor(Math.random() * 3) * 8,
        emoji:    EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      }
      setHearts(prev => [...prev, heart])
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== heart.id))
      }, heart.duration + 100)
    }, 750)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  function catchHeart(id: number) {
    if (doneRef.current) return
    setHearts(prev => prev.filter(h => h.id !== id))
    counterRef.current++
    setCaught(counterRef.current)
    if (counterRef.current >= TOTAL) {
      doneRef.current = true
      if (timerRef.current) clearInterval(timerRef.current)
      setHearts([])
      setDone(true)
      setTimeout(() => setShowWin(true), 300)
    }
  }

  return (
    <div className="minijuego-page">
      <button className="page-back-btn" onClick={onBack}>◀ VOLVER</button>

      {!done ? (
        <>
          <div className="page-badge page-badge--purple">🎮 MINI-JUEGO</div>
          <p className="minijuego-hint">
            ¡Atrapá los corazones para desbloquear tu regalo! 🎁
          </p>

          <div className="minijuego-counter">
            <span className="minijuego-count">{caught}</span>
            <span className="minijuego-sep"> / </span>
            <span className="minijuego-total">{TOTAL}</span>
            <span> 💖</span>
          </div>

          <div className="minijuego-bar-wrap">
            <div
              className="minijuego-bar-fill"
              style={{ width: `${(caught / TOTAL) * 100}%` }}
            />
          </div>

          <div className="minijuego-area">
            {hearts.map(h => (
              <button
                key={h.id}
                className="minijuego-heart"
                style={{
                  left:              `${h.x}%`,
                  fontSize:          `${h.size}px`,
                  animationDuration: `${h.duration}ms`,
                }}
                onClick={() => catchHeart(h.id)}
              >
                {h.emoji}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div
          className="minijuego-win"
          style={{
            opacity:    showWin ? 1 : 0,
            transform:  showWin ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity .5s ease, transform .5s ease',
          }}
        >
          <div className="reveal-icon" style={{ marginBottom: 8 }}>🎉</div>
          <div className="page-badge page-badge--gold">¡LO LOGRASTE!</div>
          <p className="minijuego-win-text">
            ¡Atrapaste todos los corazones!<br />
            Tu regalo te espera... 🎁
          </p>
          <button className="page-next-btn page-next-btn--gold" onClick={onNext}>
            VER MI REGALO ▶
          </button>
        </div>
      )}
    </div>
  )
}
