'use client'

import { useApp } from '@/context/AppContext'

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function CartaPage({ onNext, onBack }: Props) {
  const { content, isOwner, setContent } = useApp()

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

  return (
    <div className="carta-page">
      <button className="page-back-btn" onClick={onBack}>◀ VOLVER</button>
      <div className="page-badge">💌 MI CARTA PARA TI</div>

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

      <button className="page-next-btn" onClick={onNext}>
        📸 VER NUESTROS MOMENTOS ▶
      </button>
    </div>
  )
}
