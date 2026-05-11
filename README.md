# 💖 Cumpleamorcito — App de Cumpleaños Pixel Art (Next.js)

## ✏️ Cómo personalizar (solo un archivo)

Abre **[src/config.ts](src/config.ts)** — es el único archivo que necesitas editar:

| Campo | Qué es |
|---|---|
| `nombre` | Nombre de tu novia (aparece en el título y el hero) |
| `carta.parrafos` | Párrafos de tu carta de amor |
| `carta.firma` | Tu nombre para la firma |
| `fotos` | Array de fotos con captions |
| `regalo.titulo` | Título del regalo sorpresa |
| `regalo.fotoSrc` | Foto del regalo (o `null` si no tienes) |
| `regalo.texto` | Descripción del regalo |

### Agregar fotos
Guarda tus fotos en `public/fotos/` con los nombres que pusiste en el config:
```
public/fotos/foto1.jpg
public/fotos/foto2.jpg
...
public/fotos/regalo.jpg   ← opcional
```
Si una foto no existe, el marco muestra automáticamente un ícono de cámara.

---

## 🛠️ Desarrollo local

```bash
npm install
npm run dev
```
La app queda en http://localhost:3000

---

## 🚀 Deploy en Netlify

### Opción A — Conectar repositorio GitHub (recomendado)
1. Sube el proyecto a GitHub
2. Ve a [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
3. Conecta el repositorio
4. Netlify detecta el `netlify.toml` automáticamente — no necesitas configurar nada
5. Clic en **Deploy site** ✓

### Opción B — Deploy manual
```bash
npm run build        # genera la carpeta out/
```
Luego arrastra la carpeta `out/` al área de deploy de Netlify.

---

## 📁 Estructura del proyecto
```
cumpleamorcito/
├── src/
│   ├── config.ts              ← ✏️ EDITA AQUÍ
│   ├── app/
│   │   ├── layout.tsx         ← Font + metadata
│   │   ├── page.tsx           ← Página principal
│   │   └── globals.css        ← Estilos pixel art
│   └── components/
│       ├── StarBackground.tsx ← Canvas de estrellas
│       ├── Nav.tsx            ← Navegación
│       ├── Hero.tsx           ← Título + corazón animado
│       ├── CartaSection.tsx   ← Carta + galería de fotos
│       └── GiftBox.tsx        ← Caja regalo + confeti
├── public/
│   └── fotos/                 ← 📷 Pon tus fotos aquí
├── next.config.js
└── netlify.toml
```

> **Nota:** Los archivos `index.html`, `style.css` y `script.js` en la raíz son de la versión anterior y pueden eliminarse — no afectan el deploy.
