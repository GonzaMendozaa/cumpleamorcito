// ============================================================
//  PERSONALIZACIÓN — edita este archivo para customizar la app
// ============================================================

export const CONFIG = {
  // ✏️ Nombre de tu novia (aparece en el título y en el hero)
  nombre: 'Luana',

  // ─── Contraseña de administrador ────────────────────────────
  // ✏️ Cambia esto por tu propia contraseña secreta.
  //    NOTA: esta contraseña queda visible en el código del sitio.
  //    Solo sirve para edición casual — no la uses para datos sensibles.
  ownerPassword: '12345671',

  // ─── Carta de amor ──────────────────────────────────────────
  carta: {
    // ✏️ Escribe los párrafos de tu carta aquí
    parrafos: [
      `Hoy es tu día especial y quería que supieras cuánto
      significas para mí. Cada momento a tu lado es un regalo
      que no cambiaría por nada en el mundo.`,

      `Tu sonrisa ilumina cada uno de mis días y tu forma de ver
      la vida me hace querer ser mejor persona. Eres lo más
      bonito que me ha pasado.`,

      `En este día tan especial, quiero que sepas que te amo más
      de lo que las palabras pueden expresar. Gracias por estar
      en mi vida.`,

      `Que este cumpleaños sea tan maravilloso como lo eres tú
      para mí cada día. ¡Feliz cumpleaños, amor!`,
    ],
    // ✏️ Tu nombre para la firma
    firma: 'Gonzaa',
  },

  // ─── Galería de fotos ───────────────────────────────────────
  // ✏️ Guarda tus fotos en public/fotos/ y actualiza los nombres.
  //    Si una foto no existe, se muestra automáticamente un ícono.
  fotos: [
    { src: '', caption: '✨ Momento especial ✨' },
    { src: '', caption: '💕 Mi favorita' },
    { src: '', caption: '🌟 Para siempre' },
    { src: '', caption: '💖 Te quiero' },
    { src: '', caption: '🎀 Nuestra historia' },
    { src: '', caption: '💝 Siempre juntos' },
  ],

  // ─── Regalo sorpresa ────────────────────────────────────────
  regalo: {
    // ✏️ Título del regalo
    titulo: '¡Tu Regalo Especial!',

    // ✏️ Foto del regalo (opcional).
    //    Guarda la imagen en public/fotos/regalo.jpg.
    //    Pon null si no quieres mostrar foto.
    fotoSrc: null as string | null,

    // ✏️ Descripción del regalo
    texto: `¡Aquí va la descripción de tu increíble regalo sorpresa!
    Puedes escribir todo lo que quieras sobre él y hacer esta
    revelación tan especial como mereces.`,
  },
}
