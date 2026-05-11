/* ============================================================
   PIXEL ART BIRTHDAY — script.js
   ============================================================ */

// ── FONDO ANIMADO (estrellas + corazones flotantes) ───────────
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx    = bgCanvas.getContext('2d');

let stars     = [];
let hearts    = [];
let lastHeart = 0;

function resizeBG() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  const count = Math.floor((bgCanvas.width * bgCanvas.height) / 5000);
  stars = Array.from({ length: count }, () => ({
    x:     Math.random() * bgCanvas.width,
    y:     Math.random() * bgCanvas.height,
    size:  Math.random() < .7 ? 1 : 2,
    phase: Math.random() * Math.PI * 2,
    speed: .4 + Math.random() * .8,
  }));
}

function drawPixelHeart(x, y, size, alpha) {
  const u = Math.max(1, Math.round(size / 6));
  bgCtx.fillStyle = `rgba(255,110,180,${alpha})`;
  // Forma de corazón en píxeles (cuadrícula 8×10)
  const r = (dx, dy, w, h) => bgCtx.fillRect(
    Math.round(x + dx * u), Math.round(y + dy * u), w * u, h * u
  );
  r(-3, -2, 2, 2); r(1, -2, 2, 2);
  r(-4,  0, 3, 2); r(-1, -2, 2, 2); r(1, 0, 3, 2);
  r(-4,  2, 8, 2);
  r(-3,  4, 6, 2);
  r(-2,  6, 4, 2);
  r(-1,  8, 2, 2);
}

function animateBG(ts) {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  // Estrellas titilantes
  stars.forEach(st => {
    const a = .2 + .8 * Math.abs(Math.sin(st.phase + ts * .001 * st.speed));
    bgCtx.fillStyle = `rgba(240,230,255,${a})`;
    bgCtx.fillRect(Math.round(st.x), Math.round(st.y), st.size, st.size);
  });

  // Spawn corazón flotante cada 3s
  if (ts - lastHeart > 3000) {
    hearts.push({
      x:    Math.random() * bgCanvas.width,
      y:    bgCanvas.height + 20,
      size: 8 + Math.random() * 14,
      vy:   .6 + Math.random() * 1.2,
      vx:   (Math.random() - .5) * .5,
      a:    .25 + Math.random() * .3,
    });
    lastHeart = ts;
  }

  // Actualizar y dibujar corazones flotantes
  hearts = hearts.filter(h => h.y > -60);
  hearts.forEach(h => {
    h.y -= h.vy;
    h.x += h.vx;
    drawPixelHeart(h.x, h.y, h.size, h.a);
  });

  requestAnimationFrame(animateBG);
}

window.addEventListener('resize', resizeBG);
resizeBG();
requestAnimationFrame(animateBG);


// ── CAMBIO DE SECCIÓN ─────────────────────────────────────────
function switchSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(name).classList.add('active');
  document.querySelector(`[data-section="${name}"]`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ── CAJA DE REGALO ────────────────────────────────────────────
let giftOpened = false;

function openGift() {
  if (giftOpened) return;
  giftOpened = true;

  const box    = document.getElementById('gift-box');
  const reveal = document.getElementById('gift-reveal');

  // Animación de apertura de la tapa
  box.classList.add('opened');

  // Mostrar revelación con transición suave
  setTimeout(() => {
    reveal.style.display = 'block';
    reveal.getBoundingClientRect(); // forzar reflow para activar la transición
    reveal.style.transition = 'opacity .65s ease, transform .65s ease';
    reveal.style.opacity    = '1';
    reveal.style.transform  = 'translateY(0)';
    spawnConfetti();
  }, 650);
}


// ── CONFETI ───────────────────────────────────────────────────
const cfCanvas = document.getElementById('confetti-canvas');
const cfCtx    = cfCanvas.getContext('2d');
let particles  = [];

function spawnConfetti() {
  cfCanvas.width  = window.innerWidth;
  cfCanvas.height = window.innerHeight;
  cfCanvas.style.display = 'block';

  const colors  = ['#ff6eb4', '#c77dff', '#ffd700', '#00ffff', '#ff1493', '#ffffff', '#7b2d8b'];
  const boxRect = document.getElementById('gift-box').getBoundingClientRect();
  const cx      = boxRect.left + boxRect.width  / 2;
  const cy      = boxRect.top  + boxRect.height / 2;

  for (let i = 0; i < 150; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 12;
    particles.push({
      x:      cx,
      y:      cy,
      vx:     Math.cos(angle) * speed,
      vy:     Math.sin(angle) * speed - 6,
      size:   4 + Math.floor(Math.random() * 3) * 4,
      color:  colors[Math.floor(Math.random() * colors.length)],
      alpha:  1,
      rot:    Math.random() * 360,
      rspeed: (Math.random() - .5) * 10,
    });
  }

  animateConfetti();
}

function animateConfetti() {
  cfCtx.clearRect(0, 0, cfCanvas.width, cfCanvas.height);

  particles = particles.filter(p => p.alpha > .02);

  particles.forEach(p => {
    p.x     += p.vx;
    p.y     += p.vy;
    p.vy    += .38; // gravedad
    p.rot   += p.rspeed;
    p.alpha -= .013;

    cfCtx.save();
    cfCtx.globalAlpha = Math.max(0, p.alpha);
    cfCtx.translate(p.x, p.y);
    cfCtx.rotate(p.rot * Math.PI / 180);
    cfCtx.fillStyle = p.color;
    cfCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    cfCtx.restore();
  });

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    cfCanvas.style.display = 'none';
  }
}
