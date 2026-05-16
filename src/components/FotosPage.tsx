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

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function FotosPage({ onNext, onBack }: Props) {
  const { content, isOwner, setContent } = useApp()
  const [editingFoto, setEditingFoto] = useState(-1)
  const [uploading, setUploading]     = useState(-1)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

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
    <div className="fotos-page">
      <button className="page-back-btn" onClick={onBack}>◀ VOLVER</button>
      <div className="page-badge">📸 NUESTROS MOMENTOS</div>

      <div className="photo-grid">
        {content.fotos.map((foto, i) => (
          <div key={i} className="photo-frame">
            {isOwner && (
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={el => { fileInputRefs.current[i] = el }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(i, file)
                  e.target.value = ''
                }}
              />
            )}

            <div className="photo-img-wrap">
              <div className="photo-placeholder">
                {uploading === i ? '⏳' : '📷'}
              </div>
              {foto.src && (
                <img
                  src={foto.src}
                  alt={`Foto ${i + 1}`}
                  onLoad={e  => { (e.target as HTMLImageElement).style.opacity = '1' }}
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                />
              )}
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

            {isOwner && editingFoto === i && (
              <div className="foto-edit-panel">
                <label className="edit-label">📁 SUBIR DESDE EL DISPOSITIVO</label>
                <button
                  className="file-upload-btn"
                  onClick={() => fileInputRefs.current[i]?.click()}
                  disabled={uploading === i}
                >
                  {uploading === i ? '⏳ PROCESANDO...' : '📷 ELEGIR FOTO'}
                </button>
                {foto.src.includes('supabase') && (
                  <p className="upload-ok">✓ Foto subida a Supabase</p>
                )}
                <label className="edit-label" style={{ marginTop: 8 }}>
                  🔗 O PEGAR URL DE IMAGEN
                </label>
                <input
                  className="edit-input"
                  value={foto.src}
                  onChange={e => setFotoField(i, 'src', e.target.value)}
                  placeholder="/fotos/foto1.jpg  o  https://i.imgur.com/..."
                />
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

        {isOwner && (
          <button className="add-foto-btn" onClick={addFoto}>
            <span>+</span>
            <span>AGREGAR FOTO</span>
          </button>
        )}
      </div>

      <button className="page-next-btn page-next-btn--gold" onClick={onNext}>
        🎵 IR A NUESTRA MIXTAPE ▶
      </button>
    </div>
  )
}
