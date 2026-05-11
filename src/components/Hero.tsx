import { CONFIG } from '@/config'

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-heart">♥</div>
      <h1 className="hero-title">
        ¡FELIZ<br />CUMPLEAÑOS!<br />
        <span className="hero-name">{CONFIG.nombre}</span>
      </h1>
      <div className="hero-stars">✦ ✦ ✦ ✦ ✦</div>
    </header>
  )
}
