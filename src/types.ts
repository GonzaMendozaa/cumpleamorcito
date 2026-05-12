export interface AppContent {
  nombre: string
  carta: {
    parrafos: string[]
    firma: string
  }
  fotos: Array<{ src: string; caption: string }>
  regalo: {
    titulo: string
    fotoSrc: string | null
    texto: string
  }
}
