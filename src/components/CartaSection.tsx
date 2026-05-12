'use client'

import { useState, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { supabase, BUCKET, FOLDER, getPublicUrl } from '@/lib/supabase'

async function uploadToSupabase(file: File): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg'
  const path = `${FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return getPublicUrl(path)
}

export default function CartaSection() {
  const { content, isOwner, setContent } = useApp()
  const [editingFoto, setEditingFoto]   = useState(-1)
  const [uploading,   setUploading]     = useState(-1)
  // Una ref por foto para el input de archivo oculto
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // ── helpers de carta ─────────────────────────────────────────
  function setParrafo(i: number, value: string) {
    setContent(p => {
      const parrafos = [...p.carta.parrafos]
      parrafos[i] = value
      return { ...p, carta: { ...p.carta, parrafos } }
    })
  }

  function addParrafo() {
    setContent(p => ({
      ...p,
      carta: { ...p.carta, parrafos: [...p.carta.parrafos, 'Escribí aquí tu párrafo...'] },
    }))
  }

  function removeParrafo(i: number) {
    setContent(p => ({
      ...p,
      carta: { ...p.carta, parrafos: p.carta.parrafos.filter((_, idx) => idx !== i) },
    }))
  }

  function setFirma(v: string) {
    setContent(p => ({ ...p, carta: { ...p.carta, firma: v } }))
  }

  // ── helpers de fotos ─────────────────────────────────────────
  function setFotoField(i: number, field: 'src' | 'caption', value: string) {
    setContent(p => ({
      ...p,
      fotos: p.fotos.map((f, idx) => idx === i ? { ...f, [field]: value } : f),
    }))
  }

  async function handleFileUpload(i: number, file: File) {
    setUploading(i)
    try {
      const url = await uploadToSupabase(file)
      setFotoField(i, 'src', url)
    } catch {
      alert('No se pudo subir la imagen. Verificá que el bucket exista y sea público.')
    } finally {
      setUploading(-1)
    }
  }

  function addFoto() {
    setContent(p => ({
      ...p,
      fotos: [...p.fotos, { src: '', caption: '💕 Nuevo momento' }],
    }))
    setEditingFoto(content.fotos.length)
  }

  function removeFoto(i: number) {
    setContent(p => ({ ...p, fotos: p.fotos.filter((_, idx) => idx !== i) }))
    setEditingFoto(-1)
  }

  return (
    <section className="section">

      {/* ── CARTA ─────────────────────────────────────────────── */}
      <div className="section-heading">💌 MI CARTA PARA TI</div>

      <div className={`letter-box${isOwner ? ' letter-box--edit' : ''}`}>
        <div className="letter-deco">♥ · ♥ · ♥ · ♥ · ♥</div>

        <p className="letter-open">Mi amor,</p>

        {content.carta.parrafos.map((parrafo, i) => (
          <div key={i} className="para-wrapper">
            {isOwner ? (
              <>
                <textarea
                  className="edit-textarea"
                  value={parrafo}
                  onChange={e => setParrafo(i, e.target.value)}
                  rows={4}
                />
                <div className="para-actions">
                  {content.carta.parrafos.length > 1 && (
                    <button className="para-btn danger" onClick={() => removeParrafo(i)}>
                      × ELIMINAR
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p>{parrafo}</p>
            )}
          </div>
        ))}

        {isOwner && (
          <button className="add-para-btn" onClick={addParrafo}>
            + AGREGAR PÁRRAFO
          </button>
        )}

        <p className="letter-close">
          Con todo mi amor, ♥<br />
          {isOwner ? (
            <input
              className="edit-input firma-input"
              value={content.carta.firma}
              onChange={e => setFirma(e.target.value)}
              placeholder="Tu nombre"
            />
          ) : (
            <span className="letter-signature">{content.carta.firma}</span>
          )}
        </p>

        <div className="letter-deco bottom">♥ · ♥ · ♥ · ♥ · ♥</div>
      </div>

      {/* ── GALERÍA ───────────────────────────────────────────── */}
      <div className="section-heading photos-heading">📸 NUESTROS MOMENTOS</div>

      <div className="photo-grid">
        {content.fotos.map((foto, i) => (
          <div key={i} className="photo-frame">

            {/* Inputs de archivo ocultos (uno por foto) */}
            {isOwner && (
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={el => { fileInputRefs.current[i] = el }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(i, file)
                  e.target.value = '' // reset para poder subir la misma imagen de nuevo
                }}
              />
            )}

            <div className="photo-img-wrap">
              {/* Placeholder (se tapa con la foto si carga bien) */}
              <div className="photo-placeholder">
                {uploading === i ? '⏳' : '📷'}
              </div>

              {foto.src && (
                <img
                  src={foto.src}
                  alt={`Foto ${i + 1}`}
                  onLoad={e => { (e.target as HTMLImageElement).style.opacity = '1' }}
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                />
              )}

              {/* Botón editar foto */}
              {isOwner && (
                <button
                  className="foto-edit-btn"
                  onClick={() => setEditingFoto(editingFoto === i ? -1 : i)}
                  title="Editar foto"
                >
                  {editingFoto === i ? '✕' : '✏️'}
                </button>
              )}
            </div>

            {/* Panel de edición de foto */}
            {isOwner && editingFoto === i && (
              <div className="foto-edit-panel">

                {/* — Subir desde dispositivo — */}
                <label className="edit-label">📁 SUBIR DESDE EL DISPOSITIVO</label>
                <button
                  className="file-upload-btn"
                  onClick={() => fileInputRefs.current[i]?.click()}
                  disabled={uploading === i}
                >
                  {uploading === i ? '⏳ PROCESANDO...' : '📷 ELEGIR FOTO'}
                </button>

                {/* Indicador de foto subida */}
                {foto.src.includes('supabase') && (
                  <p className="upload-ok">✓ Foto subida a Supabase</p>
                )}

                {/* — O usar URL — */}
                <label className="edit-label" style={{ marginTop: 8 }}>
                  🔗 O PEGAR URL DE IMAGEN
                </label>
                <input
                  className="edit-input"
                  value={foto.src}
                  onChange={e => setFotoField(i, 'src', e.target.value)}
                  placeholder="/fotos/foto1.jpg  o  https://i.imgur.com/..."
                />

                {/* — Caption — */}
                <label className="edit-label" style={{ marginTop: 8 }}>💬 CAPTION</label>
                <input
                  className="edit-input"
                  value={foto.caption}
                  onChange={e => setFotoField(i, 'caption', e.target.value)}
                  placeholder="Frase especial..."
                />

                <button
                  className="para-btn danger"
                  style={{ marginTop: 8 }}
                  onClick={() => removeFoto(i)}
                >
                  × ELIMINAR FOTO
                </button>
              </div>
            )}

            {/* Caption visible o editable inline */}
            {isOwner && editingFoto !== i ? (
              <input
                className="edit-input caption-inline"
                value={foto.caption}
                onChange={e => setFotoField(i, 'caption', e.target.value)}
              />
            ) : (
              !isOwner && <p className="photo-caption">{foto.caption}</p>
            )}

          </div>
        ))}

        {/* Botón agregar foto */}
        {isOwner && (
          <button className="add-foto-btn" onClick={addFoto}>
            <span>+</span>
            <span>AGREGAR FOTO</span>
          </button>
        )}
      </div>

    </section>
  )
}
