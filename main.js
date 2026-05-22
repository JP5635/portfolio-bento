/* =====================================================
   main.js — Animated Components
   Portfolio · Jongho Park
   ===================================================== */

// ─────────────────────────────────────────────
// Utility: Init canvas with DPR scaling
// ─────────────────────────────────────────────
function setupCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  const dpr = window.devicePixelRatio || 1;
  const w   = canvas.offsetWidth;
  const h   = canvas.offsetHeight;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w, h };
}

// ─────────────────────────────────────────────
// ② ResearchQ — Network Graph
//    Animated nodes + data packets travelling edges
// ─────────────────────────────────────────────
function initNetworkGraph() {
  const c = setupCanvas('network-canvas');
  if (!c) return;
  const { ctx, w, h } = c;

  // Define paper boundaries
  const paperW = w * 0.65;
  const paperH = h * 0.62;
  const paperX = (w - paperW) / 2;
  const paperY = (h - paperH) / 2 - 5;

  // Generate points for paper
  const paperPoints = [];
  function addLine(xs, xe, y, spacing = 5) {
    for (let x = xs; x <= xe; x += spacing) {
      paperPoints.push({ x, y });
    }
  }

  // Draw a standard scientific paper layout with sampled points
  // Title
  addLine(paperX + 12, paperX + paperW - 12, paperY + 12, 5);
  // Authors/Info
  addLine(paperX + 12, paperX + 45, paperY + 20, 4);
  addLine(paperX + 52, paperX + 85, paperY + 20, 4);
  // Column 1
  addLine(paperX + 12, paperX + paperW/2 - 6, paperY + 30, 4);
  addLine(paperX + 12, paperX + paperW/2 - 12, paperY + 37, 4);
  addLine(paperX + 12, paperX + paperW/2 - 6, paperY + 44, 4);
  addLine(paperX + 12, paperX + paperW/2 - 18, paperY + 51, 4);
  // Column 2
  addLine(paperX + paperW/2 + 6, paperX + paperW - 12, paperY + 30, 4);
  addLine(paperX + paperW/2 + 6, paperX + paperW - 18, paperY + 37, 4);
  addLine(paperX + paperW/2 + 6, paperX + paperW - 12, paperY + 44, 4);
  addLine(paperX + paperW/2 + 6, paperX + paperW - 24, paperY + 51, 4);

  // Figure/Chart Box outline at bottom left
  addLine(paperX + 12, paperX + 38, paperY + 62, 4);
  addLine(paperX + 12, paperX + 38, paperY + 84, 4);
  for (let y = paperY + 66; y <= paperY + 80; y += 4) {
    paperPoints.push({ x: paperX + 12, y });
    paperPoints.push({ x: paperX + 38, y });
  }

  // Column 2 Bottom lines
  addLine(paperX + 46, paperX + paperW - 12, paperY + 62, 4);
  addLine(paperX + 46, paperX + paperW - 18, paperY + 69, 4);
  addLine(paperX + 46, paperX + paperW - 12, paperY + 76, 4);
  addLine(paperX + 46, paperX + paperW - 24, paperY + 83, 4);

  const numParticles = paperPoints.length;

  // Define network nodes (5 nodes)
  const nodes = [
    { label: 'ResearchQ Hub', cx: w * 0.5,  cy: h * 0.48, r: 8,  color: '#818cf8' },
    { label: 'PDF Parser',    cx: w * 0.22, cy: h * 0.25, r: 5,  color: '#a78bfa' },
    { label: 'Embeddings',    cx: w * 0.78, cy: h * 0.25, r: 5,  color: '#f472b6' },
    { label: 'Vector DB',     cx: w * 0.22, cy: h * 0.73, r: 5,  color: '#34d399' },
    { label: 'AI Synthesis',  cx: w * 0.78, cy: h * 0.73, r: 5,  color: '#fbbf24' }
  ];

  // Define connections
  const edges = [
    [1, 0], [2, 0], [3, 0], [4, 0],
    [1, 2], [3, 4]
  ];

  // Distribute particles into network targets
  const particles = [];
  paperPoints.forEach((pt, idx) => {
    let tx, ty, nodeIdx = -1, edgeIdx = -1;
    const isNode = idx < numParticles * 0.55;

    if (isNode) {
      nodeIdx = idx % nodes.length;
      const node = nodes[nodeIdx];
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * node.r * 1.5;
      tx = node.cx + Math.cos(theta) * r;
      ty = node.cy + Math.sin(theta) * r;
    } else {
      edgeIdx = idx % edges.length;
      const edge = edges[edgeIdx];
      const nodeA = nodes[edge[0]];
      const nodeB = nodes[edge[1]];
      const f = Math.random();
      tx = nodeA.cx + (nodeB.cx - nodeA.cx) * f + (Math.random() - 0.5) * 2;
      ty = nodeA.cy + (nodeB.cy - nodeA.cy) * f + (Math.random() - 0.5) * 2;
    }

    const floatSpeed = 0.01 + Math.random() * 0.02;
    const floatRange = 1.5 + Math.random() * 2.5;

    particles.push({
      px: pt.x,
      py: pt.y,
      nx: tx,
      ny: ty,
      nodeIdx,
      edgeIdx,
      x: pt.x,
      y: pt.y,
      t: 0,
      targetT: 0,
      speed: 0.02 + Math.random() * 0.025,
      size: 1.2 + Math.random() * 1.4,
      angle: Math.random() * Math.PI * 2,
      floatSpeed,
      floatRange
    });
  });

  let state = 'paper';
  let stateTimer = 0;
  let sweepY = -50;
  let activeLabelsAlpha = 0;

  function switchState(newState) {
    state = newState;
    stateTimer = 0;
    if (state === 'scan_to_net') {
      sweepY = -20;
    } else if (state === 'scan_to_paper') {
      sweepY = -20;
    }
  }

  const packets = [];
  function spawnPacket() {
    if (state !== 'network') return;
    const edge = edges[Math.floor(Math.random() * edges.length)];
    const nodeA = nodes[edge[0]];
    const nodeB = nodes[edge[1]];
    packets.push({
      fromX: nodeA.cx, fromY: nodeA.cy,
      toX: nodeB.cx, toY: nodeB.cy,
      t: 0,
      speed: 0.012 + Math.random() * 0.016,
      color: nodeB.color
    });
  }
  setInterval(spawnPacket, 750);

  (function draw() {
    ctx.clearRect(0, 0, w, h);
    stateTimer += 16.7;

    // 1. STATE HANDLING
    if (state === 'paper') {
      if (stateTimer > 3200) {
        switchState('scan_to_net');
      }
    } else if (state === 'scan_to_net') {
      sweepY += (h + 40) / 70;
      if (sweepY >= h + 20) {
        switchState('network');
      }
    } else if (state === 'network') {
      if (stateTimer > 4800) {
        switchState('scan_to_paper');
      }
    } else if (state === 'scan_to_paper') {
      sweepY += (h + 40) / 70;
      if (sweepY >= h + 20) {
        switchState('paper');
      }
    }

    // 2. BACKGROUND DRAWING
    let paperBorderAlpha = 0;
    if (state === 'paper') {
      paperBorderAlpha = 0.12;
    } else if (state === 'scan_to_net') {
      paperBorderAlpha = Math.max(0, 0.12 * (1 - (sweepY - paperY) / paperH));
    } else if (state === 'scan_to_paper') {
      paperBorderAlpha = Math.min(0.12, 0.12 * ((sweepY - paperY) / paperH));
    }
    if (paperBorderAlpha > 0.005) {
      ctx.beginPath();
      ctx.roundRect(paperX, paperY, paperW, paperH, 8);
      ctx.strokeStyle = `rgba(255, 255, 255, ${paperBorderAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 3. DRAW CONNECTIONS
    let edgeAlpha = 0;
    if (state === 'network') {
      edgeAlpha = Math.min(0.18, activeLabelsAlpha * 0.18);
    } else if (state === 'scan_to_net') {
      edgeAlpha = Math.min(0.18, Math.max(0, (sweepY - (h / 2)) / (h / 2)) * 0.18);
    } else if (state === 'scan_to_paper') {
      edgeAlpha = Math.min(0.18, Math.max(0, (1 - sweepY / h)) * 0.18);
    }

    if (edgeAlpha > 0.005) {
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[a].cx, nodes[a].cy);
        ctx.lineTo(nodes[b].cx, nodes[b].cy);
        ctx.strokeStyle = `rgba(129, 140, 248, ${edgeAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
    }

    // 4. PACKETS
    if (state === 'network') {
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed;
        if (p.t >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const px = p.fromX + (p.toX - p.fromX) * p.t;
        const py = p.fromY + (p.toY - p.fromY) * p.t;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    } else {
      packets.length = 0;
    }

    // 5. UPDATE AND DRAW PARTICLES
    particles.forEach(p => {
      if (state === 'scan_to_net') {
        if (sweepY > p.py) {
          p.t = Math.min(1, p.t + p.speed);
        }
      } else if (state === 'scan_to_paper') {
        if (sweepY > p.ny) {
          p.t = Math.max(0, p.t - p.speed);
        }
      } else if (state === 'network') {
        p.t = 1;
      } else if (state === 'paper') {
        p.t = 0;
      }

      const easeT = p.t * p.t * (3 - 2 * p.t);

      let targetX = p.px + (p.nx - p.px) * easeT;
      let targetY = p.py + (p.ny - p.py) * easeT;

      if (p.t > 0.01) {
        p.angle += p.floatSpeed;
        const floatOffset = Math.sin(p.angle) * p.floatRange * easeT;
        targetX += floatOffset * 0.4;
        targetY += floatOffset * 0.8;
      }

      p.x = targetX;
      p.y = targetY;

      let r = 255, g = 255, b = 255, alpha = 0.4;
      if (p.t > 0.05) {
        let targetColor = '#818cf8';
        if (p.nodeIdx !== -1) {
          targetColor = nodes[p.nodeIdx].color;
        } else if (p.edgeIdx !== -1) {
          targetColor = nodes[edges[p.edgeIdx][1]].color;
        }
        const hex = targetColor.replace('#', '');
        const tr = parseInt(hex.substring(0, 2), 16);
        const tg = parseInt(hex.substring(2, 4), 16);
        const tb = parseInt(hex.substring(4, 6), 16);

        r = Math.round(255 + (tr - 255) * easeT);
        g = Math.round(255 + (tg - 255) * easeT);
        b = Math.round(255 + (tb - 255) * easeT);
        alpha = 0.4 + 0.45 * easeT;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();
    });

    // 6. DRAW SCAN LINE
    if (state === 'scan_to_net' || state === 'scan_to_paper') {
      const gradient = ctx.createLinearGradient(0, sweepY - 10, 0, sweepY + 10);
      gradient.addColorStop(0, 'rgba(129, 140, 248, 0)');
      gradient.addColorStop(0.5, 'rgba(129, 140, 248, 0.75)');
      gradient.addColorStop(1, 'rgba(129, 140, 248, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, sweepY - 10, w, 20);
    }

    // 7. DRAW NODE LABELS
    if (state === 'network') {
      activeLabelsAlpha = Math.min(1, activeLabelsAlpha + 0.04);
    } else {
      activeLabelsAlpha = Math.max(0, activeLabelsAlpha - 0.08);
    }

    if (activeLabelsAlpha > 0.01) {
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.cx, n.cy, n.r + 5, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}15`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.cx, n.cy, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * activeLabelsAlpha})`;
        ctx.font = `600 ${n.r === 8 ? 9.5 : 8}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.cx, n.cy - n.r - 4);
      });
    }

    requestAnimationFrame(draw);
  })();
}

// ─────────────────────────────────────────────
// ③ Interview Easy — Looping Chat Bubbles
// ─────────────────────────────────────────────
function initChatDemo() {
  const scene = document.getElementById('chat-scene');
  if (!scene) return;

  const messages = [
    { type: 'user', text: 'Help me prep for my interview 👋' },
    { type: 'typing' },
    { type: 'ai',   text: 'Sure! Share the job description.' },
    { type: 'user', text: "Applying for ML Engineer at a startup" },
    { type: 'typing' },
    { type: 'ai',   text: "Generating STAR-format answers for you ✨" },
    { type: 'ai',   text: '"What is your biggest strength?" — 17 questions ready' },
  ];

  let els = [];

  function runChat() {
    // Clear old bubbles
    els.forEach(el => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    });
    els = [];

    let delay = 300;

    messages.forEach(msg => {
      const el = document.createElement('div');

      if (msg.type === 'typing') {
        el.className = 'typing-dots';
        el.innerHTML = '<span></span><span></span><span></span>';
      } else {
        el.className = `chat-bbl ${msg.type}`;
        el.textContent = msg.text;
      }
      scene.appendChild(el);
      els.push(el);

      setTimeout(() => el.classList.add('show'), delay);
      delay += msg.type === 'typing' ? 600 : 900;

      // Hide typing dots after brief show
      if (msg.type === 'typing') {
        const hideDelay = delay - 300;
        setTimeout(() => el.classList.remove('show'), hideDelay);
      }
    });

    // Loop
    setTimeout(runChat, delay + 2000);
  }

  runChat();
}

// ─────────────────────────────────────────────
// ④ Vationo — Scrolling Price Chart
// ─────────────────────────────────────────────
function initPriceChart() {
  const c = setupCanvas('chart-canvas');
  if (!c) return;
  const { ctx, w, h } = c;

  // Generate smooth random walk price series
  const series = [100];
  for (let i = 1; i < 200; i++) {
    const drift = 0.02;
    const vol   = 1.8;
    series.push(series[i - 1] + drift + (Math.random() - 0.5) * vol);
  }
  // Smooth via simple MA
  const smooth = series.map((v, i, a) => {
    const sl = a.slice(Math.max(0, i - 4), i + 1);
    return sl.reduce((s, x) => s + x, 0) / sl.length;
  });

  let offset = 0;
  const visLen = 50;

  const priceEl = document.getElementById('price-val');
  const deltaEl = document.getElementById('price-delta');

  (function draw() {
    ctx.clearRect(0, 0, w, h);

    const start = Math.floor(offset) % smooth.length;
    const data  = Array.from({ length: visLen }, (_, i) => smooth[(start + i) % smooth.length]);

    const minV  = Math.min(...data);
    const maxV  = Math.max(...data);
    const range = maxV - minV || 1;
    const pad   = { t: 28, b: 28, l: 8, r: 8 };
    const cw    = w - pad.l - pad.r;
    const ch    = h - pad.t - pad.b;

    const toX = i => pad.l + (i / (visLen - 1)) * cw;
    const toY = v => pad.t + (1 - (v - minV) / range) * ch;

    // Gradient fill
    const grd = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
    grd.addColorStop(0, 'rgba(52,211,153,0.35)');
    grd.addColorStop(1, 'rgba(52,211,153,0.01)');

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(data[0]));
    data.forEach((v, i) => i > 0 && ctx.lineTo(toX(i), toY(v)));
    ctx.lineTo(toX(visLen - 1), h - pad.b);
    ctx.lineTo(toX(0), h - pad.b);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(data[0]));
    data.forEach((v, i) => i > 0 && ctx.lineTo(toX(i), toY(v)));
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth   = 2;
    ctx.lineJoin    = 'round';
    ctx.stroke();

    // Moving average overlay
    const ma = data.map((_, i, a) => {
      const sl = a.slice(Math.max(0, i - 7), i + 1);
      return sl.reduce((s, x) => s + x, 0) / sl.length;
    });
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(ma[0]));
    ma.forEach((v, i) => i > 0 && ctx.lineTo(toX(i), toY(v)));
    ctx.strokeStyle = 'rgba(251,191,36,0.5)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live dot
    const lastX = toX(visLen - 1);
    const lastY = toY(data[visLen - 1]);
    ctx.save();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle   = '#34d399';
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur  = 14;
    ctx.fill();
    ctx.restore();

    // HUD update
    const cur   = data[visLen - 1];
    const delta = cur - data[0];
    const pct   = (delta / data[0] * 100).toFixed(2);
    if (priceEl) priceEl.textContent = cur.toFixed(2);
    if (deltaEl) {
      deltaEl.textContent = `${pct >= 0 ? '+' : ''}${pct}%`;
      deltaEl.style.color = delta >= 0 ? '#34d399' : '#f87171';
      deltaEl.style.background = delta >= 0 ? 'rgba(52,211,153,.15)' : 'rgba(248,113,113,.15)';
    }

    offset += 0.1;
    requestAnimationFrame(draw);
  })();
}

// ─────────────────────────────────────────────
// ⑤ Young & Rich Report — Data Pipeline Animation
//    Market / News / Econ  →  AI Process  →  Report
// ─────────────────────────────────────────────
function initPipeline() {
  const c = setupCanvas('bar-canvas');
  if (!c) return;
  const { ctx, w, h } = c;

  // Layout anchors
  const srcX   = w * 0.16;
  const procX  = w * 0.50;
  const outX   = w * 0.84;
  const midY   = h * 0.50;

  // Data sources: y position + label + color
  const sources = [
    { y: h * 0.22, label: 'Markets',  color: '#fbbf24' },
    { y: h * 0.50, label: 'News',     color: '#f87171' },
    { y: h * 0.78, label: 'Econ',     color: '#34d399' },
  ];

  // Bezier cubic helper: point on curve at t
  function bezier(t, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
    const mt = 1 - t;
    return {
      x: mt*mt*mt*p0x + 3*mt*mt*t*p1x + 3*mt*t*t*p2x + t*t*t*p3x,
      y: mt*mt*mt*p0y + 3*mt*mt*t*p1y + 3*mt*t*t*p2y + t*t*t*p3y,
    };
  }

  // Packets travelling the pipeline
  const packets = [];
  let outGlow = 0;   // 0→1 burst when a report is emitted
  let reportCount = 0;
  let landingAnim = 0; // 0 to 1 progress for landing report page

  function spawnSourcePacket() {
    const src = sources[Math.floor(Math.random() * sources.length)];
    packets.push({
      phase : 'src→proc',
      color : src.color,
      srcY  : src.y,
      t     : 0,
      speed : 0.010 + Math.random() * 0.007,
    });
  }
  setInterval(spawnSourcePacket, 720);
  spawnSourcePacket();
  setTimeout(spawnSourcePacket, 360); // stagger first packets

  // ── Draw symbols for Sources ──
  function drawSourceSymbol(x, y, type, color, label) {
    ctx.beginPath();
    ctx.roundRect(x - 22, y - 18, 44, 36, 6);
    ctx.fillStyle = `${color}18`;
    ctx.strokeStyle = `${color}66`;
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (type === 'Markets') {
      ctx.beginPath();
      ctx.moveTo(x - 12, y + 8);
      ctx.lineTo(x - 5, y - 2);
      ctx.lineTo(x + 2, y + 3);
      ctx.lineTo(x + 12, y - 7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 7, y - 7);
      ctx.lineTo(x + 12, y - 7);
      ctx.lineTo(x + 12, y - 2);
      ctx.stroke();
    } else if (type === 'News') {
      ctx.fillStyle = `${color}cc`;
      ctx.fillRect(x - 13, y - 10, 26, 4);
      ctx.fillStyle = `${color}aa`;
      ctx.fillRect(x - 13, y - 2, 11, 2);
      ctx.fillRect(x - 13, y + 2, 11, 2);
      ctx.fillRect(x - 13, y + 6, 26, 2);
      ctx.fillRect(x + 2, y - 2, 11, 6);
    } else if (type === 'Econ') {
      ctx.fillStyle = `${color}cc`;
      ctx.fillRect(x - 12, y + 8 - 8, 6, 8);
      ctx.fillRect(x - 3, y + 8 - 14, 6, 14);
      ctx.fillRect(x + 6, y + 8 - 20, 6, 20);
    }
    ctx.restore();

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '700 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y + 30);
  }

  // ── Draw Processor core ──
  function drawProcessorSymbol(x, y) {
    const procPulse = 0.5 + 0.5 * Math.sin(Date.now() / 600);
    ctx.beginPath();
    ctx.arc(x, y, 26 + procPulse * 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(139,92,246,${0.06 + procPulse * 0.04})`;
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(x - 20, y - 20, 40, 40, 6);
    ctx.fillStyle = 'rgba(109,40,217,0.18)';
    ctx.strokeStyle = 'rgba(167,139,250,0.7)';
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(167,139,250,0.8)';
    for (let i = -12; i <= 12; i += 8) {
      ctx.fillRect(x + i - 1.5, y - 24, 3, 4);
      ctx.fillRect(x + i - 1.5, y + 20, 3, 4);
      ctx.fillRect(x - 24, y + i - 1.5, 4, 3);
      ctx.fillRect(x + 20, y + i - 1.5, 4, 3);
    }

    const rotAngle = Date.now() / 500;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotAngle);
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#c4b5fd';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      ctx.fillRect(Math.cos(a) * 9 - 1.5, Math.sin(a) * 9 - 1.5, 3, 3);
    }
    ctx.restore();

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '700 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AI Engine', x, y + 32);
  }

  // ── Draw Tilted Page (Report Sheet) ──
  function drawReportSheet(sx, sy, isGlow = false) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx - 17, sy - 8);
    ctx.lineTo(sx + 15, sy - 14);
    ctx.lineTo(sx + 17, sy + 10);
    ctx.lineTo(sx - 15, sy + 16);
    ctx.closePath();

    if (isGlow) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.95)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 12;
    } else {
      ctx.fillStyle = 'rgba(24, 12, 0, 0.82)';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
      ctx.lineWidth = 1.5;
    }
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.strokeStyle = isGlow ? 'rgba(251, 191, 36, 0.7)' : 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.2;
    for (let offset = -4; offset <= 8; offset += 4) {
      ctx.moveTo(sx - 10, sy + offset);
      ctx.lineTo(sx + 10, sy + offset - 4);
    }
    ctx.stroke();
    ctx.restore();
  }

  // ── Draw Stack of Reports ──
  function drawReportStack(x, y) {
    if (reportCount === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(x - 17, y + 10 - 8);
      ctx.lineTo(x + 15, y + 10 - 14);
      ctx.lineTo(x + 17, y + 10 + 10);
      ctx.lineTo(x - 15, y + 10 + 16);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '700 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Reports: 0', x, y + 32);
      return;
    }

    const numBaseSheets = Math.min(6, reportCount);
    
    for (let j = 0; j < numBaseSheets; j++) {
      const isTop = (j === numBaseSheets - 1);
      const sx = x - j * 1.8;
      const sy = y + 10 - j * 2.8;

      if (isTop && landingAnim > 0.001) {
        const slideY = sy - landingAnim * 36;
        ctx.save();
        ctx.translate(sx, slideY);
        const squash = 1 + Math.sin(landingAnim * Math.PI) * 0.1;
        const stretch = 1 - Math.sin(landingAnim * Math.PI) * 0.06;
        ctx.scale(squash, stretch);
        drawReportSheet(0, 0, true);
        ctx.restore();
      } else {
        drawReportSheet(sx, sy, isTop && outGlow > 0.1);
      }
    }

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '700 9.5px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Reports: #${reportCount}`, x, y + 32);
  }

  // ── Draw bezier pipe (background tube) ──
  function drawPipe(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y, color) {
    ctx.beginPath();
    ctx.moveTo(p0x, p0y);
    ctx.bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // ── Main draw loop ──
  (function draw() {
    ctx.clearRect(0, 0, w, h);

    if (landingAnim > 0) {
      landingAnim = Math.max(0, landingAnim - 0.04);
    }

    // Background pipe tubes
    sources.forEach(src => {
      const cp = (srcX + procX) / 2;
      drawPipe(
        srcX + 22, src.y,
        cp, src.y,
        cp, midY,
        procX - 22, midY,
        'rgba(255,255,255,0.06)'
      );
    });
    // Proc → Report pipe
    drawPipe(procX + 22, midY, (procX+outX)/2, midY, (procX+outX)/2, midY, outX - 20, midY, 'rgba(255,255,255,0.06)');

    // Source nodes (draw symbols)
    sources.forEach(src => {
      drawSourceSymbol(srcX, src.y, src.label, src.color, src.label);
    });

    // AI Process node (draw chip symbol)
    drawProcessorSymbol(procX, midY);

    // Report output node (draw stack of pages)
    if (outGlow > 0) {
      outGlow = Math.max(0, outGlow - 0.025);
    }
    drawReportStack(outX, midY);

    // ── Update + draw packets ──
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t = Math.min(1, p.t + p.speed);

      let px, py;

      if (p.phase === 'src→proc') {
        const cpx = (srcX + procX) / 2;
        const pt = bezier(p.t, srcX + 22, p.srcY, cpx, p.srcY, cpx, midY, procX - 22, midY);
        px = pt.x; py = pt.y;
      } else {
        px = (procX + 22) + ((outX - 20) - (procX + 22)) * p.t;
        py = midY;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle   = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 14;
      ctx.fill();
      ctx.restore();

      const trailT = Math.max(0, p.t - 0.06);
      let tx, ty;
      if (p.phase === 'src→proc') {
        const cpx = (srcX + procX) / 2;
        const tp = bezier(trailT, srcX + 22, p.srcY, cpx, p.srcY, cpx, midY, procX - 22, midY);
        tx = tp.x; ty = tp.y;
      } else {
        tx = (procX + 22) + ((outX - 20) - (procX + 22)) * trailT;
        ty = midY;
      }
      ctx.beginPath();
      ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}55`;
      ctx.fill();

      if (p.t >= 1) {
        if (p.phase === 'src→proc') {
          // Emit a proc→report packet with 40% probability (batching)
          if (Math.random() < 0.4) {
            packets.push({
              phase : 'proc→report',
              color : '#a78bfa',
              t     : 0,
              speed : 0.014 + Math.random() * 0.006,
            });
          }
        } else {
          outGlow = 1;
          reportCount = Math.min(99, reportCount + 1);
          landingAnim = 1.0;
        }
        packets.splice(i, 1);
      }
    }

    requestAnimationFrame(draw);
  })();
}

// ─────────────────────────────────────────────
// ⑥ Data Stack — Wave pill entrance
// ─────────────────────────────────────────────
function initDataPills() {
  const container = document.getElementById('data-pills');
  if (!container) return;

  const pills = [
    'Python','SQL','BigQuery','Spark','dbt',
    'Airflow','FastAPI','Docker','GCP','Kafka',
  ];
  container.innerHTML = pills.map(p => `<span class="sk-pill">${p}</span>`).join('');
  const els = [...container.querySelectorAll('.sk-pill')];

  function animateIn() {
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('vis'), i * 90);
    });
  }
  function animateOut() {
    els.forEach(el => el.classList.remove('vis'));
  }

  animateIn();
  setInterval(() => {
    animateOut();
    setTimeout(animateIn, 600);
  }, 5000);
}

// ─────────────────────────────────────────────
// ⑦ Roles — Cycling active highlight
// ─────────────────────────────────────────────
function initRoles() {
  const list = document.getElementById('role-list');
  if (!list) return;

  const roles = [
    { label: 'Data Scientist',      color: '#818cf8' },
    { label: 'AI Engineer',         color: '#38bdf8' },
    { label: 'Quant Researcher',    color: '#34d399' },
    { label: 'MLOps Engineer',      color: '#fbbf24' },
    { label: 'Full-stack AI Dev',   color: '#f472b6' },
  ];

  list.innerHTML = roles.map((r, i) => `
    <div class="role-item${i === 0 ? ' active' : ''}">
      <span class="role-dot" style="background:${i === 0 ? r.color : 'rgba(255,255,255,0.15)'};${i === 0 ? `box-shadow:0 0 9px ${r.color}` : ''}"></span>
      <span>${r.label}</span>
    </div>
  `).join('');

  const items = [...list.querySelectorAll('.role-item')];
  let cur = 0;

  setInterval(() => {
    const dot = items[cur].querySelector('.role-dot');
    items[cur].classList.remove('active');
    dot.style.background  = 'rgba(255,255,255,0.15)';
    dot.style.boxShadow   = '';

    cur = (cur + 1) % roles.length;

    items[cur].classList.add('active');
    const ndot = items[cur].querySelector('.role-dot');
    ndot.style.background = roles[cur].color;
    ndot.style.boxShadow  = `0 0 9px ${roles[cur].color}`;
  }, 1800);
}

// ─────────────────────────────────────────────
// ⑨ ML Neural Network — Canvas activation waves
// ─────────────────────────────────────────────
function initNeuralNet() {
  const c = setupCanvas('nn-canvas');
  if (!c) return;
  const { ctx, w, h } = c;

  // Layer sizes
  const layerSizes = [4, 6, 6, 3];
  const layers = layerSizes.map((size, li) => {
    const x = (w * (li + 1)) / (layerSizes.length + 1);
    return Array.from({ length: size }, (_, ni) => ({
      x,
      y: (h * (ni + 1)) / (size + 1),
      act: 0,
    }));
  });

  // Propagate activation wave: layer by layer
  function propagate(li) {
    if (li >= layers.length) {
      setTimeout(() => {
        layers.forEach(l => l.forEach(n => (n.act = 0)));
        setTimeout(() => propagate(0), 500);
      }, 600);
      return;
    }
    layers[li].forEach(n => (n.act = 1));
    setTimeout(() => propagate(li + 1), 320);
  }
  propagate(0);

  (function draw() {
    ctx.clearRect(0, 0, w, h);

    // Edges
    layers.forEach((layer, li) => {
      if (li >= layers.length - 1) return;
      layer.forEach(from => {
        layers[li + 1].forEach(to => {
          const a = Math.max(from.act, to.act);
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = `rgba(139,92,246,${0.05 + a * 0.22})`;
          ctx.lineWidth   = 0.6 + a * 1.5;
          ctx.stroke();
        });
      });
    });

    // Nodes
    layers.forEach(layer => {
      layer.forEach(n => {
        const r = 4.5 + n.act * 4.5;

        // Outer glow
        if (n.act > 0.05) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139,92,246,${n.act * 0.22})`;
          ctx.fill();
        }

        // Core
        const g = ctx.createRadialGradient(n.x - r * .3, n.y - r * .3, 0, n.x, n.y, r);
        g.addColorStop(0, `rgba(220,200,255,${0.35 + n.act * 0.65})`);
        g.addColorStop(1, `rgba(109,40,217,${0.2  + n.act * 0.45})`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Decay
        n.act = Math.max(0, n.act - 0.014);
      });
    });

    requestAnimationFrame(draw);
  })();
}

// ─────────────────────────────────────────────
// Boot — init all after first paint
// ─────────────────────────────────────────────
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    initNetworkGraph();
    initPriceChart();
    initPipeline();
    initNeuralNet();
    initChatDemo();
    initDataPills();
    initRoles();
  });
});
