'use client'

import { useApp } from '@/context/AppContext'

export default function Hero() {
  const { content, isOwner, setContent } = useApp()

  return (
    <header className="hero">
      <div className="hero-heart">♥</div>

      <h1 className="hero-title">
        ¡FELIZ<br />CUMPLEAÑOS!<br />

        {isOwner ? (
          <input
            className="hero-name-input"
            value={content.nombre}
            onChange={e =>
              setContent(p => ({ ...p, nombre: e.target.value }))
            }
            placeholder="Nombre de ella"
          />
        ) : (
          <span className="hero-name">{content.nombre}</span>
        )}
      </h1>

      <div className="hero-stars">✦ ✦ ✦ ✦ ✦</div>
    </header>
  )
}
