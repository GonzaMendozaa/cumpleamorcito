'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CONFIG } from '@/config'

interface Props {
  opened: boolean
  onOpen: () => void
}

export default function GiftBox({ opened, onOpen }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const giftRef   = useRef<HTMLDivElement>(null)
  const [showReveal, setShowReveal]   = useState(false)
  const [animReveal, setAnimReveal]   = useState(false)

  const spawnConfetti = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.style.display = 'block'
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const colors    = ['#ff6eb4', '#c77dff', '#ffd700', '#00ffff', '#ff1493', '#ffffff']
    const rect      = giftRef.current?.getBoundingClientRect()
    const cx        = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2
    const cy        = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2

    const particles: Array<{
      x: number; y: number; vx: number; vy: number
      size: number; color: string; alpha: number
      rot: number; rspeed: number
    }> = []

    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 4 + Math.random() * 12
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size:   4 + Math.floor(Math.random() * 3) * 4,
        color:  colors[Math.floor(Math.random() * colors.length)],
        alpha:  1,
        rot:    Math.random() * 360,
        rspeed: (Math.random() - 0.5) * 10,
      })
    }

    function loop() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy    += 0.38
        p.rot   += p.rspeed
        p.alpha -= 0.013

        if (p.alpha <= 0.02) { particles.splice(i, 1); continue }

        ctx!.save()
        ctx!.globalAlpha = Math.max(0, p.alpha)
        ctx!.translate(p.x, p.y)
        ctx!.rotate(p.rot * Math.PI / 180)
        ctx!.fillStyle = p.color
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx!.restore()
      }

      if (particles.length > 0) {
        requestAnimationFrame(loop)
      } else {
        canvas!.style.display = 'none'
      }
    }

    requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    if (!opened) return
    const t1 = setTimeout(() => setShowReveal(true),  650)
    const t2 = setTimeout(() => setAnimReveal(true),  720)
    const t3 = setTimeout(() => spawnConfetti(),       720)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [opened, spawnConfetti])

  return (
    <section className="section">

      <div className="section-heading">🎁 TU REGALO SORPRESA</div>
      <p className="gift-hint">¡Haz clic en la caja para descubrir tu regalo!</p>

      <div className="gift-scene">

        {/* Caja animada */}
        <div
          ref={giftRef}
          className={`gift-box${opened ? ' opened' : ''}`}
          onClick={() => { if (!opened) onOpen() }}
        >
          <div className="gift-lid">
            <span className="gift-bow">🎀</span>
          </div>
          <div className="gift-body">
            <div className="gift-ribbon-v" />
            <div className="gift-ribbon-h" />
          </div>
        </div>

        {/* Revelación (aparece con transición suave tras abrir) */}
        {showReveal && (
          <div
            className="gift-reveal"
            style={{
              opacity:    animReveal ? 1 : 0,
              transform:  animReveal ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity .65s ease, transform .65s ease',
            }}
          >
            <div className="reveal-icon">🌟</div>
            <h3 className="reveal-title">{CONFIG.regalo.titulo}</h3>

            {CONFIG.regalo.fotoSrc && (
              <img
                src={CONFIG.regalo.fotoSrc}
                alt="Tu regalo"
                className="reveal-photo"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}

            <p className="reveal-text">{CONFIG.regalo.texto}</p>
            <div className="reveal-deco">✨ 💖 ✨</div>
          </div>
        )}

      </div>

      {/* Canvas del confeti (posición fixed, gestionado por JS) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 999,
          display: 'none',
        }}
      />

    </section>
  )
}
