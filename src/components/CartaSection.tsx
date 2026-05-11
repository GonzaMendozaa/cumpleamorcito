'use client'

import { CONFIG } from '@/config'

export default function CartaSection() {
  return (
    <section className="section">

      <div className="section-heading">💌 MI CARTA PARA TI</div>

      <div className="letter-box">
        <div className="letter-deco">♥ · ♥ · ♥ · ♥ · ♥</div>

        <p className="letter-open">Mi amor,</p>

        {CONFIG.carta.parrafos.map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}

        <p className="letter-close">
          Con todo mi amor, ♥<br />
          <span className="letter-signature">{CONFIG.carta.firma}</span>
        </p>

        <div className="letter-deco bottom">♥ · ♥ · ♥ · ♥ · ♥</div>
      </div>

      <div className="section-heading photos-heading">📸 NUESTROS MOMENTOS</div>

      <div className="photo-grid">
        {CONFIG.fotos.map((foto, i) => (
          <div key={i} className="photo-frame">
            <div className="photo-img-wrap">
              <div className="photo-placeholder">📷</div>
              <img
                src={foto.src}
                alt={`Foto ${i + 1}`}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.opacity = '0'
                }}
              />
            </div>
            <p className="photo-caption">{foto.caption}</p>
          </div>
        ))}
      </div>

    </section>
  )
}
