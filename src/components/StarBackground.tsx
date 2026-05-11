'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number; y: number
  size: number; phase: number; speed: number
}

interface FloatingHeart {
  x: number; y: number
  size: number; vy: number; vx: number; a: number
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let stars: Star[] = []
    let hearts: FloatingHeart[] = []
    let lastHeart = 0
    let animId: number

    function resize() {
      canvas!.width  = window.innerWidth
      canvas!.height = window.innerHeight
      initStars()
    }

    function initStars() {
      const n = Math.floor((canvas!.width * canvas!.height) / 5000)
      stars = Array.from({ length: n }, () => ({
        x:     Math.random() * canvas!.width,
        y:     Math.random() * canvas!.height,
        size:  Math.random() < 0.7 ? 1 : 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
      }))
    }

    function drawPixelHeart(x: number, y: number, size: number, alpha: number) {
      const u = Math.max(1, Math.round(size / 6))
      ctx!.fillStyle = `rgba(255,110,180,${alpha})`
      const r = (dx: number, dy: number, w: number, h: number) =>
        ctx!.fillRect(Math.round(x + dx * u), Math.round(y + dy * u), w * u, h * u)
      r(-3, -2, 2, 2); r(1, -2, 2, 2)
      r(-4,  0, 3, 2); r(-1, -2, 2, 2); r(1, 0, 3, 2)
      r(-4,  2, 8, 2)
      r(-3,  4, 6, 2)
      r(-2,  6, 4, 2)
      r(-1,  8, 2, 2)
    }

    function animate(ts: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      stars.forEach(st => {
        const a = 0.2 + 0.8 * Math.abs(Math.sin(st.phase + ts * 0.001 * st.speed))
        ctx!.fillStyle = `rgba(240,230,255,${a})`
        ctx!.fillRect(Math.round(st.x), Math.round(st.y), st.size, st.size)
      })

      if (ts - lastHeart > 3000) {
        hearts.push({
          x:    Math.random() * canvas!.width,
          y:    canvas!.height + 20,
          size: 8 + Math.random() * 14,
          vy:   0.6 + Math.random() * 1.2,
          vx:   (Math.random() - 0.5) * 0.5,
          a:    0.25 + Math.random() * 0.3,
        })
        lastHeart = ts
      }

      hearts = hearts.filter(h => h.y > -60)
      hearts.forEach(h => {
        h.y -= h.vy
        h.x += h.vx
        drawPixelHeart(h.x, h.y, h.size, h.a)
      })

      animId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    resize()
    animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
