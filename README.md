# 💖 Cumpleamorcito — App de Cumpleaños Pixel Art

## ⚠️ Primer paso — Instalar Node.js

Los errores de TypeScript en el IDE desaparecen solos después de instalar Node.js y correr `npm install`.

1. Descargá Node.js desde **[nodejs.org](https://nodejs.org)** (versión LTS)
2. Instalá normalmente (el instalador agrega Node al PATH)
3. Abrí una **nueva terminal** en la carpeta del proyecto y corré:

```bash
npm install
npm run dev
```

La app queda en http://localhost:3000 — los errores del IDE desaparecen.

---

## ✏️ Personalización

### Opción A — Editar código (permanente)
Abrí **[src/config.ts](src/config.ts)** y cambiá:
- `nombre` — nombre de tu novia
- `ownerPassword` — tu contraseña de administrador
- `carta.parrafos` — párrafos de la carta
- `fotos` — fotos y captions
- `regalo` — descripción del regalo

### Opción B — Editar desde la app (sin tocar código)
1. Abrí la app deployada en Netlify
2. Hacé clic en el 🔒 en la esquina inferior derecha
3. Ingresá la contraseña que pusiste en `ownerPassword`
4. Editá todo desde la interfaz:
   - Nombre en el hero
   - Párrafos de la carta (agregar, editar, eliminar)
   - Fotos (URL y captions, agregar o quitar)
   - Título, foto y descripción del regalo
5. Clic en **🔗 GENERAR LINK** → copiá la URL generada
6. Compartí ESA URL con tu novia — tiene todo el contenido personalizado incrustado

> **Cómo funciona el link:** el contenido editado se codifica en el `#hash` de la URL. Quien abra ese link ve exactamente lo que configuraste, sin necesidad de redeployear.

---

## 🚀 Deploy en Netlify

### Opción A — Conectar repo GitHub (recomendado)
1. Subí el proyecto a GitHub
2. En [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
3. Conectá el repo — Netlify detecta el `netlify.toml` automáticamente
4. Clic en **Deploy site** ✓

### Opción B — Deploy manual
```bash
npm run build   # genera la carpeta out/
```
Arrastrá la carpeta `out/` al área de deploy de Netlify.

---

## 📁 Estructura del proyecto

```
src/
├── config.ts                  ← ✏️ Personalización en código
├── types.ts                   ← Tipos TypeScript
├── context/
│   └── AppContext.tsx          ← Estado global (contenido + auth)
├── app/
│   ├── layout.tsx
│   ├── page.tsx               ← Página principal + AppProvider
│   └── globals.css            ← Estilos pixel art + edición
└── components/
    ├── StarBackground.tsx     ← Canvas de fondo animado
    ├── Nav.tsx                ← Navegación
    ├── Hero.tsx               ← Título (editable en owner mode)
    ├── CartaSection.tsx       ← Carta + fotos (editable)
    ├── GiftBox.tsx            ← Regalo sorpresa (editable)
    ├── LoginModal.tsx         ← Modal de contraseña
    └── OwnerBar.tsx           ← Barra de herramientas del propietario
public/
└── fotos/                     ← 📷 Pon tus fotos aquí
```
