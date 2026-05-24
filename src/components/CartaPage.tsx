'use client'

import { useRef, useState } from 'react'
import { useApp } from '@/context/AppContext'

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function CartaPage({ onNext, onBack }: Props) {
  const { content, isOwner, setContent } = useApp()
  const letterRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    if (!letterRef.current) return
    setDownloading(true)
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const canvas = await html2canvas(letterRef.current, {
        backgroundColor: '#1a0a2e',
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // A4 en mm: 210 x 297
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = 210
      const pageH = 297
      const margin = 16

      const maxW = pageW - margin * 2
      const maxH = pageH - margin * 2
      const imgRatio = canvas.height / canvas.width

      // Escalar para que quepa completa respetando ambas dimensiones
      let imgW = maxW
      let imgH = imgRatio * imgW
      if (imgH > maxH) {
        imgH = maxH
        imgW = imgH / imgRatio
      }

      // Centrar en la hoja
      const offsetX = (pageW - imgW) / 2
      const offsetY = (pageH - imgH) / 2

      // Fondo oscuro de toda la hoja
      pdf.setFillColor(13, 1, 24)
      pdf.rect(0, 0, pageW, pageH, 'F')

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, offsetY, imgW, imgH)
      pdf.save('carta.pdf')
    } finally {
      setDownloading(false)
    }
  }

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
      <div className="page-badge">💌 MI CARTA PARA VOS</div>

      <div ref={letterRef} className={`letter-box${isOwner ? ' letter-box--edit' : ''}`}>
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

      {!isOwner && (
        <button className="print-btn" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'DESCARGANDO...' : '⬇ DESCARGAR CARTA'}
        </button>
      )}

      <button className="page-next-btn" onClick={onNext}>
        📸 VER NUESTROS MOMENTOS ▶
      </button>
    </div>
  )
}
