'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '@/context/AppContext'

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = e => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const MAX = 640
        const scale   = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas  = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.72))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

interface Props {
  opened: boolean
  onOpen: () => void
}

export default function GiftBox({ opened, onOpen }: Props) {
  const { content, isOwner, setContent } = useApp()
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const giftRef        = useRef<HTMLDivElement>(null)
  const regaloFileRef  = useRef<HTMLInputElement>(null)
  const [showReveal,   setShowReveal]   = useState(false)
  const [animReveal,   setAnimReveal]   = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)

  async function handleRegaloFile(file: File) {
    setUploadingImg(true)
    try {
      const base64 = await compressImage(file)
      setContent(p => ({ ...p, regalo: { ...p.regalo, fotoSrc: base64 } }))
    } catch {
      alert('No se pudo procesar la imagen.')
    } finally {
      setUploadingImg(false)
    }
  }

  // En modo owner, siempre mostrar el contenido sin necesidad de clic
  const effectivelyOpened = isOwner || opened

  const spawnConfetti = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.style.display = 'block'
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#ff6eb4', '#c77dff', '#ffd700', '#00ffff', '#ff1493', '#ffffff']
    const rect   = giftRef.current?.getBoundingClientRect()
    const cx     = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2
    const cy     = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2

    const particles: Array<{
      x: number; y: number; vx: number; vy: number
      size: number; color: string; alpha: number; rot: number; rspeed: number
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
        alpha:  1, rot: Math.random() * 360,
        rspeed: (Math.random() - 0.5) * 10,
      })
    }

    function loop() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.vy += 0.38
        p.rot += p.rspeed; p.alpha -= 0.013
        if (p.alpha <= 0.02) { particles.splice(i, 1); continue }
        ctx!.save()
        ctx!.globalAlpha = Math.max(0, p.alpha)
        ctx!.translate(p.x, p.y)
        ctx!.rotate(p.rot * Math.PI / 180)
        ctx!.fillStyle = p.color
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx!.restore()
      }
      if (particles.length > 0) requestAnimationFrame(loop)
      else canvas!.style.display = 'none'
    }
    requestAnimationFrame(loop)
  }, [])

  // Mostrar reveal cuando se abre (por clic real, no owner mode)
  useEffect(() => {
    if (!opened) return
    const t1 = setTimeout(() => setShowReveal(true),  650)
    const t2 = setTimeout(() => setAnimReveal(true),  720)
    const t3 = setTimeout(() => spawnConfetti(),       720)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [opened, spawnConfetti])

  // En owner mode, mostrar reveal inmediatamente
  useEffect(() => {
    if (isOwner) { setShowReveal(true); setAnimReveal(true) }
  }, [isOwner])

  const revealVisible = showReveal || isOwner

  return (
    <section className="section">

      <div className="section-heading">🎁 TU REGALO SORPRESA</div>

      {!effectivelyOpened && (
        <p className="gift-hint">¡Haz clic en la caja para descubrir tu regalo!</p>
      )}

      <div className="gift-scene">

        {/* Caja animada — oculta en owner mode para ir directo al contenido */}
        {!isOwner && (
          <div
            ref={giftRef}
            className={`gift-box${effectivelyOpened ? ' opened' : ''}`}
            onClick={() => { if (!effectivelyOpened) onOpen() }}
          >
            <div className="gift-lid">
              <span className="gift-bow">🎀</span>
            </div>
            <div className="gift-body">
              <div className="gift-ribbon-v" />
              <div className="gift-ribbon-h" />
            </div>
          </div>
        )}

        {/* Revelación del regalo */}
        {revealVisible && (
          <div
            className="gift-reveal"
            style={{
              opacity:    animReveal ? 1 : 0,
              transform:  animReveal ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity .65s ease, transform .65s ease',
            }}
          >
            <div className="reveal-icon">🌟</div>

            {isOwner ? (
              <input
                className="edit-input reveal-title-input"
                value={content.regalo.titulo}
                onChange={e =>
                  setContent(p => ({ ...p, regalo: { ...p.regalo, titulo: e.target.value } }))
                }
                placeholder="Título del regalo"
              />
            ) : (
              <h3 className="reveal-title">{content.regalo.titulo}</h3>
            )}

            {/* Foto del regalo */}
            {isOwner ? (
              <div className="reveal-foto-edit">
                {/* Input de archivo oculto */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={regaloFileRef}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleRegaloFile(file)
                    e.target.value = ''
                  }}
                />

                <label className="edit-label">📁 FOTO DEL REGALO (OPCIONAL)</label>
                <button
                  className="file-upload-btn"
                  onClick={() => regaloFileRef.current?.click()}
                  disabled={uploadingImg}
                >
                  {uploadingImg ? '⏳ PROCESANDO...' : '📷 SUBIR FOTO DEL REGALO'}
                </button>

                {content.regalo.fotoSrc?.startsWith('data:') && (
                  <p className="upload-ok">✓ Foto local cargada</p>
                )}

                <label className="edit-label" style={{ marginTop: 8 }}>
                  🔗 O PEGAR URL
                </label>
                <input
                  className="edit-input"
                  value={content.regalo.fotoSrc?.startsWith('data:') ? '' : (content.regalo.fotoSrc ?? '')}
                  onChange={e =>
                    setContent(p => ({
                      ...p,
                      regalo: { ...p.regalo, fotoSrc: e.target.value || null },
                    }))
                  }
                  placeholder="/fotos/regalo.jpg  o  https://..."
                />

                {content.regalo.fotoSrc && (
                  <img
                    src={content.regalo.fotoSrc}
                    alt="Regalo"
                    className="reveal-photo"
                    onLoad={e => { (e.target as HTMLImageElement).style.opacity = '1' }}
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                  />
                )}
              </div>
            ) : (
              content.regalo.fotoSrc && (
                <img
                  src={content.regalo.fotoSrc}
                  alt="Tu regalo"
                  className="reveal-photo"
                  onLoad={e => { (e.target as HTMLImageElement).style.opacity = '1' }}
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                />
              )
            )}

            {/* Texto del regalo */}
            {isOwner ? (
              <textarea
                className="edit-textarea reveal-text-input"
                value={content.regalo.texto}
                onChange={e =>
                  setContent(p => ({ ...p, regalo: { ...p.regalo, texto: e.target.value } }))
                }
                rows={5}
                placeholder="Descripción del regalo..."
              />
            ) : (
              <p className="reveal-text">{content.regalo.texto}</p>
            )}

            <div className="reveal-deco">✨ 💖 ✨</div>
          </div>
        )}

      </div>

      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999, display: 'none' }}
      />

    </section>
  )
}
