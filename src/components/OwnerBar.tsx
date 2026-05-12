'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function OwnerBar() {
  const { isOwner, logout, openLogin, generateShareUrl } = useApp()
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied,   setCopied]   = useState(false)

  if (!isOwner) {
    return (
      <button
        className="lock-btn"
        onClick={openLogin}
        title="Modo edición"
      >
        🔒
      </button>
    )
  }

  function handleShare() {
    const url = generateShareUrl()
    setShareUrl(url)
    setCopied(false)
  }

  async function handleCopy() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* fallback: seleccionar el texto */
      const el = document.getElementById('share-url-text')
      if (el) {
        const range = document.createRange()
        range.selectNodeContents(el)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
      }
    }
  }

  return (
    <div className="owner-bar">

      {/* Panel del link generado */}
      {shareUrl && (
        <div className="share-panel">
          <p className="share-panel-label">✓ Link generado — compartilo con ella:</p>
          <div className="share-url-box">
            <span id="share-url-text">{shareUrl}</span>
          </div>
          <button
            className="owner-bar-btn gold"
            onClick={handleCopy}
          >
            {copied ? '✓ COPIADO!' : '📋 COPIAR LINK'}
          </button>
          <p className="share-note">
            ⚠ Las fotos deben estar en la carpeta /fotos/ del deploy o ser URLs externas.
          </p>
        </div>
      )}

      {/* Controles del propietario */}
      <div className="owner-controls">
        <span className="owner-indicator">✏️ EDITANDO</span>
        <button className="owner-bar-btn gold" onClick={handleShare}>
          🔗 GENERAR LINK
        </button>
        <button className="owner-bar-btn" onClick={() => { logout(); setShareUrl(null) }}>
          🔒 SALIR
        </button>
      </div>

    </div>
  )
}
