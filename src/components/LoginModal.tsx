'use client'

import { useState, type KeyboardEvent } from 'react'
import { useApp } from '@/context/AppContext'

export default function LoginModal() {
  const { showLogin, closeLogin, login } = useApp()
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(false)
  const [shaking,  setShaking]  = useState(false)

  if (!showLogin) return null

  function handleSubmit() {
    const ok = login(password)
    if (!ok) {
      setError(true)
      setShaking(true)
      setPassword('')
      setTimeout(() => setShaking(false), 400)
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') closeLogin()
  }

  return (
    <div className="modal-overlay" onClick={closeLogin}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <p className="modal-title">🔒 MODO EDICIÓN</p>
        <p className="modal-subtitle">Ingresá la contraseña de administrador</p>

        <input
          className={`modal-input${shaking ? ' shake' : ''}`}
          type="password"
          placeholder="contraseña"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false) }}
          onKeyDown={handleKey}
          autoFocus
        />

        {error && (
          <p className="modal-error">✕ Contraseña incorrecta</p>
        )}

        <div className="modal-actions">
          <button className="modal-btn" onClick={handleSubmit}>
            ENTRAR
          </button>
          <button className="modal-cancel" onClick={closeLogin}>
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  )
}
