// Ambient "Chroma" background — small glowing file-format icons (PDF, DOCX,
// XLSX, PPTX, JPG) drift across the page, colored to match each tool
// category. They react to the cursor (repel gently) and to scrolling (slow
// parallax drift), and occasionally "link" to a nearby icon with a soft
// light beam — a nod to what this site actually does: converting between
// formats. Sits fixed behind all content on every page.
//
// Performance note: this entire effect is purely decorative, so its setup
// (canvas sizing, icon creation, starting the animation loop) is deferred
// until after the page's 'load' event. Running it immediately was
// competing with the browser's initial paint on throttled/mobile CPUs,
// visibly delaying LCP (the hero heading) — deferring it removes that
// contention entirely without changing how the effect looks once running.

function initChromaBackground() {
  const canvas = document.getElementById('chromaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  const FORMATS = [
    { label: 'PDF', color: '#ff5b5b' },
    { label: 'DOCX', color: '#5b9dff' },
    { label: 'XLSX', color: '#4ade80' },
    { label: 'PPTX', color: '#fbbf5b' },
    { label: 'JPG', color: '#b18cfa' },
  ];

  let W, H, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = window.innerWidth < 700 ? 12 : 22;
  const icons = Array.from({ length: COUNT }, () => {
    const f = FORMATS[Math.floor(Math.random() * FORMATS.length)];
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
      size: 22 + Math.random() * 14,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.0018,
      label: f.label, color: f.color,
      bob: Math.random() * Math.PI * 2,
      parallax: 0.05 + Math.random() * 0.12
    };
  });

  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  let mx = -9999, my = -9999, tmx = -9999, tmy = -9999;
  if (isFinePointer) {
    window.addEventListener('mousemove', (e) => { tmx = e.clientX; tmy = e.clientY; }, { passive: true });
  }

  function hexToRgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function drawFileIcon(icon, t) {
    const s = icon.size;
    ctx.save();
    ctx.translate(icon.x, icon.y + Math.sin(t * 0.0011 + icon.bob) * 5 - scrollY * icon.parallax * 0.06);
    ctx.rotate(icon.rot);
    ctx.shadowColor = icon.color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = hexToRgba(icon.color, 0.15);
    ctx.strokeStyle = hexToRgba(icon.color, 0.85);
    ctx.lineWidth = 1.3;
    const w = s * 0.72, h = s, fold = s * 0.22;
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 2 - fold, -h / 2);
    ctx.lineTo(w / 2, -h / 2 + fold);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2 - fold, -h / 2);
    ctx.lineTo(w / 2 - fold, -h / 2 + fold);
    ctx.lineTo(w / 2, -h / 2 + fold);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = hexToRgba(icon.color, 0.9);
    ctx.font = `700 ${s * 0.22}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon.label, 0, h * 0.1);
    ctx.restore();
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    mx += (tmx - mx) * 0.08;
    my += (tmy - my) * 0.08;

    icons.forEach((icon) => {
      icon.x += icon.vx; icon.y += icon.vy; icon.rot += icon.rotSpeed;
      if (icon.x < -30) icon.x = W + 30; if (icon.x > W + 30) icon.x = -30;
      if (icon.y < -30) icon.y = H + 30; if (icon.y > H + 30) icon.y = -30;

      const d = Math.hypot(icon.x - mx, icon.y - my);
      if (d < 100) {
        const force = (1 - d / 100) * 0.8;
        icon.x += (icon.x - mx) / Math.max(d, 1) * force;
        icon.y += (icon.y - my) / Math.max(d, 1) * force;
      }
    });

    for (let i = 0; i < icons.length; i++) {
      for (let j = i + 1; j < icons.length; j++) {
        const a = icons[i], b = icons[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          const alpha = (1 - d / 130) * 0.16;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, hexToRgba(a.color, alpha));
          grad.addColorStop(1, hexToRgba(b.color, alpha));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    icons.forEach((icon) => drawFileIcon(icon, t));
  }

  let raf;
  function loop(t) {
    draw(t);
    raf = requestAnimationFrame(loop);
  }

  if (reduceMotion) {
    draw(0);
  } else {
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(loop);
    });
  }
}

// Defer all of the above until the page has fully loaded, so canvas setup
// and the animation loop never compete with initial render/LCP.
if (document.readyState === 'complete') {
  initChromaBackground();
} else {
  window.addEventListener('load', initChromaBackground);
}
