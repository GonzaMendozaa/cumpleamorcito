'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import type { Cancion } from '@/types'

const RAINBOW = ['#ff3355', '#ff7700', '#ffdd00', '#33cc55', '#2299ff', '#9933ff', '#ff69b4']

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
  )
  return m ? m[1] : null
}

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function MixtapePage({ onNext, onBack }: Props) {
  const { content, isOwner, setContent } = useApp()
  const canciones = content.canciones ?? []

  const [currentIdx, setCurrentIdx] = useState(0)
  const [isPlaying,  setIsPlaying]  = useState(false)
  const [editingIdx, setEditingIdx] = useState(-1)
  const [draft,      setDraft]      = useState<Cancion>({ titulo: '', artista: '', url: '' })

  const current    = canciones[currentIdx] ?? null
  const youtubeId  = current ? getYouTubeId(current.url) : null
  const total      = canciones.length

  function play() {
    if (!current?.url) return
    setIsPlaying(true)
  }

  function stop() { setIsPlaying(false) }

  function prev() {
    setIsPlaying(false)
    setCurrentIdx(i => (i - 1 + total) % total)
  }

  function next() {
    setIsPlaying(false)
    setCurrentIdx(i => (i + 1) % total)
  }

  function startEdit(i: number) {
    setDraft({ ...canciones[i] })
    setEditingIdx(i)
  }

  function saveEdit(i: number) {
    setContent(p => ({
      ...p,
      canciones: p.canciones.map((c, idx) => idx === i ? { ...draft } : c),
    }))
    setEditingIdx(-1)
  }

  function addCancion() {
    const nueva: Cancion = { titulo: 'Nueva canción', artista: '', url: '' }
    setContent(p => ({ ...p, canciones: [...(p.canciones ?? []), nueva] }))
    const newIdx = canciones.length
    setCurrentIdx(newIdx)
    setDraft({ ...nueva })
    setEditingIdx(newIdx)
  }

  function removeCancion(i: number) {
    setContent(p => ({ ...p, canciones: p.canciones.filter((_, idx) => idx !== i) }))
    setEditingIdx(-1)
    setCurrentIdx(0)
    setIsPlaying(false)
  }

  return (
    <div className="mixtape-page">
      <button className="page-back-btn" onClick={onBack}>◀ VOLVER</button>
      <div className="page-badge page-badge--purple">🎵 NUESTRA MIXTAPE 🎵</div>

      {/* ── CASSETTE PLAYER ─────────────────────────────────── */}
      <div className="cassette-player">

        {/* Cassette tape */}
        <div className={`cassette-tape${isPlaying ? ' cassette-playing' : ''}`}>
          <div className="cassette-label">
            <div className="cassette-label-stars">★ ★ ★</div>
            <div className="cassette-label-title">NUESTRA CINTA</div>
            <div className="cassette-label-sub">{content.nombre}</div>
          </div>

          <div className="cassette-spools-row">
            <div className="cassette-spool">
              <div className="cassette-spool-hub" />
            </div>
            <div className="cassette-window">
              <div className="cassette-tape-line" />
            </div>
            <div className="cassette-spool">
              <div className="cassette-spool-hub" />
            </div>
          </div>

          <div className="cassette-stripes">
            {RAINBOW.map((c, i) => (
              <div key={i} style={{ background: c, flex: 1 }} />
            ))}
          </div>
        </div>

        {/* Track display */}
        <div className="cassette-display">
          <div className="cassette-display-row">
            <div className="cassette-track-label">
              TRACK {total > 0 ? currentIdx + 1 : 0}/{total}
            </div>
            {isPlaying && (
              <div className="cassette-now-playing">♪ REPRODUCIENDO</div>
            )}
          </div>
          {current ? (
            <>
              <div className="cassette-track-title">{current.titulo || '—'}</div>
              {current.artista && (
                <div className="cassette-track-artist">♪ {current.artista}</div>
              )}
            </>
          ) : (
            <div className="cassette-track-title">Sin canciones aún...</div>
          )}
        </div>

        {/* Controls */}
        <div className="cassette-controls">
          <button className="cassette-ctrl" onClick={prev}  disabled={total === 0} title="Anterior">◀◀</button>
          <button
            className={`cassette-ctrl cassette-ctrl--play${isPlaying ? ' cassette-ctrl--active' : ''}`}
            onClick={isPlaying ? stop : play}
            disabled={!current?.url}
            title={isPlaying ? 'Detener' : 'Reproducir'}
          >
            {isPlaying ? '■' : '▶'}
          </button>
          <button className="cassette-ctrl" onClick={next}  disabled={total === 0} title="Siguiente">▶▶</button>
          {current?.url && (
            <a
              className="cassette-ctrl cassette-ctrl--link"
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir en YouTube"
            >
              ↗
            </a>
          )}
        </div>

        {/* Reproductor oculto — solo audio, sin video visible */}
        {isPlaying && youtubeId && (
          <div className="cassette-audio-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              allow="autoplay; encrypted-media"
              title="audio"
              width="1"
              height="1"
            />
          </div>
        )}

        {/* URL no reconocida */}
        {isPlaying && current?.url && !youtubeId && (
          <p className="cassette-warn">
            ⚠ Solo YouTube es compatible.{' '}
            <a href={current.url} target="_blank" rel="noopener noreferrer" className="cassette-ext-link">
              Abrir ↗
            </a>
          </p>
        )}
      </div>

      {/* ── LISTA DE CANCIONES ───────────────────────────────── */}
      <div className="cassette-tracklist">
        {canciones.map((c, i) => (
          <div
            key={i}
            className={`cassette-track-item${i === currentIdx ? ' cassette-track-item--active' : ''}`}
          >
            {isOwner && editingIdx === i ? (
              <div className="cassette-edit-form">
                <label className="edit-label">🎵 TÍTULO</label>
                <input
                  className="edit-input"
                  value={draft.titulo}
                  onChange={e => setDraft(d => ({ ...d, titulo: e.target.value }))}
                  placeholder="Nombre de la canción"
                />
                <label className="edit-label" style={{ marginTop: 6 }}>🎤 ARTISTA</label>
                <input
                  className="edit-input"
                  value={draft.artista}
                  onChange={e => setDraft(d => ({ ...d, artista: e.target.value }))}
                  placeholder="Nombre del artista"
                />
                <label className="edit-label" style={{ marginTop: 6 }}>🔗 URL DE YOUTUBE</label>
                <input
                  className="edit-input"
                  value={draft.url}
                  onChange={e => setDraft(d => ({ ...d, url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <div className="cassette-edit-actions">
                  <button className="para-btn" onClick={() => saveEdit(i)}>✓ GUARDAR</button>
                  <button className="para-btn" onClick={() => setEditingIdx(-1)}>✕ CANCELAR</button>
                  <button className="para-btn danger" onClick={() => removeCancion(i)}>× BORRAR</button>
                </div>
              </div>
            ) : (
              <div className="cassette-track-row">
                <button
                  className="cassette-track-select"
                  onClick={() => { setCurrentIdx(i); setIsPlaying(false) }}
                >
                  <span className="cassette-track-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cassette-track-info">
                    <span className="cassette-track-name">{c.titulo || '—'}</span>
                    {c.artista && <span className="cassette-track-art"> — {c.artista}</span>}
                  </span>
                  {i === currentIdx && <span className="cassette-track-now">♪</span>}
                </button>
                {isOwner && (
                  <button className="cassette-edit-btn" onClick={() => startEdit(i)}>✏</button>
                )}
              </div>
            )}
          </div>
        ))}

        {isOwner && (
          <button className="cassette-add-btn" onClick={addCancion}>
            + AGREGAR CANCIÓN
          </button>
        )}
      </div>

      <button className="page-next-btn page-next-btn--gold" onClick={onNext}>
        🎮 ¿TE ANIMÁS A JUGAR? ▶
      </button>
    </div>
  )
}
