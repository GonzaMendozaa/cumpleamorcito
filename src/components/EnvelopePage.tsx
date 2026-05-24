'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'

// 24/08/2025 16:00 ART (UTC-3) = 19:00 UTC
const START = new Date('2025-08-24T19:00:00Z')

function pad(n: number) { return String(n).padStart(2, '0') }

function useTimeTogether() {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    setElapsed(Date.now() - START.getTime())
    const id = setInterval(() => setElapsed(Date.now() - START.getTime()), 1000)
    return () => clearInterval(id)
  }, [])
  const secs    = Math.max(0, Math.floor(elapsed / 1000))
  const days    = Math.floor(secs / 86400)
  const hours   = Math.floor((secs % 86400) / 3600)
  const minutes = Math.floor((secs % 3600) / 60)
  const seconds = secs % 60
  return { days, hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) }
}

interface Props {
  onAbrir: () => void
  onSeguir: () => void
}

export default function EnvelopePage({ onAbrir, onSeguir }: Props) {
  const { content } = useApp()
  const [opening, setOpening] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { days, hours, minutes, seconds } = useTimeTogether()

  function handleAbrir() {
    if (opening) return
    setOpening(true)
    setTimeout(onAbrir, 820)
  }

  return (
    <div className="env-page">
      <p className="env-greeting">¡Feliz Cumpleaños!</p>
      <h1 className="env-name">{content.nombre} 🎀</h1>
      <p className="env-stars">★ ★ ★ ★ ★</p>

      <div className="env-counter">
        <p className="env-counter-label">💑 LLEVAMOS JUNTOS</p>
        <div className="env-counter-row">
          <div className="env-counter-unit">
            <span className="env-counter-num">{days}</span>
            <span className="env-counter-sub">días</span>
          </div>
          <span className="env-counter-colon">:</span>
          <div className="env-counter-unit">
            <span className="env-counter-num">{hours}</span>
            <span className="env-counter-sub">hs</span>
          </div>
          <span className="env-counter-colon">:</span>
          <div className="env-counter-unit">
            <span className="env-counter-num">{minutes}</span>
            <span className="env-counter-sub">min</span>
          </div>
          <span className="env-counter-colon">:</span>
          <div className="env-counter-unit">
            <span className="env-counter-num">{seconds}</span>
            <span className="env-counter-sub">seg</span>
          </div>
        </div>
      </div>

      {/* ── Sobre pixel art ──────────────────────────────── */}
      <div className={`env-letter${opening ? ' env-letter--opening' : ''}`}>

        {/* Cuerpo del sobre */}
        <div className="env-body">

          {/* Líneas de doblez (V desde esquinas superiores) */}
          <div className="env-fold-tl" />
          <div className="env-fold-tr" />

          {/* Doblez inferior izquierdo */}
          <div className="env-fold-bl" />
          <div className="env-fold-br" />

          {/* Sello pixel art — esquina superior derecha */}
          <div className="env-stamp">
            <span>💖</span>
          </div>

          {/* Icono principal */}
          <span className="env-icon">💌</span>

          {/* Línea de cierre decorativa */}
          <div className="env-seal" />
        </div>
      </div>

      <p className="env-hint">✨ Tienes un mensaje muy especial... ✨</p>

      <div className="env-btns">
        <button
          className="env-btn env-btn--open"
          onClick={handleAbrir}
          disabled={opening}
        >
          ABRIR 💌
        </button>
        <button
          className="env-btn env-btn--skip"
          onClick={() => setShowConfirm(true)}
          disabled={opening}
        >
          SEGUIR ▶
        </button>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-box confirm-modal" onClick={e => e.stopPropagation()}>
            <p className="confirm-text">
              ¿Segura que querés perderte mi cartita que te escribí para vos? 😢
            </p>
            <div className="confirm-btns">
              <button
                className="env-btn env-btn--open"
                onClick={() => setShowConfirm(false)}
              >
                Mejor la abro 💌
              </button>
              <button
                className="env-btn env-btn--skip"
                onClick={() => { setShowConfirm(false); onSeguir() }}
              >
                Seguir igual ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
