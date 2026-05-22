import React, { useEffect, useRef } from 'react';

export default function ResearchQCard() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

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
    addLine(paperX + 12, paperX + paperW - 12, paperY + 12, 5); // Title
    addLine(paperX + 12, paperX + 45, paperY + 20, 4); // Authors/Info
    addLine(paperX + 52, paperX + 85, paperY + 20, 4);
    addLine(paperX + 12, paperX + paperW / 2 - 6, paperY + 30, 4); // Column 1
    addLine(paperX + 12, paperX + paperW / 2 - 12, paperY + 37, 4);
    addLine(paperX + 12, paperX + paperW / 2 - 6, paperY + 44, 4);
    addLine(paperX + 12, paperX + paperW / 2 - 18, paperY + 51, 4);
    addLine(paperX + paperW / 2 + 6, paperX + paperW - 12, paperY + 30, 4); // Column 2
    addLine(paperX + paperW / 2 + 6, paperX + paperW - 18, paperY + 37, 4);
    addLine(paperX + paperW / 2 + 6, paperX + paperW - 12, paperY + 44, 4);
    addLine(paperX + paperW / 2 + 6, paperX + paperW - 24, paperY + 51, 4);

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
      { label: 'ResearchQ Hub', cx: w * 0.5, cy: h * 0.48, r: 8, color: '#818cf8' },
      { label: 'PDF Parser', cx: w * 0.22, cy: h * 0.25, r: 5, color: '#a78bfa' },
      { label: 'Embeddings', cx: w * 0.78, cy: h * 0.25, r: 5, color: '#f472b6' },
      { label: 'Vector DB', cx: w * 0.22, cy: h * 0.73, r: 5, color: '#34d399' },
      { label: 'AI Synthesis', cx: w * 0.78, cy: h * 0.73, r: 5, color: '#fbbf24' }
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
        fromX: nodeA.cx,
        fromY: nodeA.cy,
        toX: nodeB.cx,
        toY: nodeB.cy,
        t: 0,
        speed: 0.012 + Math.random() * 0.016,
        color: nodeB.color
      });
    }

    const intervalId = setInterval(spawnPacket, 750);

    let animationFrameId;
    function draw() {
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
        edgeAlpha = Math.min(0.18, Math.max(0, (sweepY - h / 2) / (h / 2)) * 0.18);
      } else if (state === 'scan_to_paper') {
        edgeAlpha = Math.min(0.18, Math.max(0, 1 - sweepY / h) * 0.18);
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

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div id="rq" className="pebble">
      <canvas ref={canvasRef} id="network-canvas" className="fill-canvas" aria-hidden="true"></canvas>
      <div className="card-content bottom-overlay">
        <h2 className="card-title">ResearchQ</h2>
        <p className="card-sub">AI Data Intelligence Platform</p>
        <div className="card-tags">
          <span>Python</span>
          <span>BigQuery</span>
          <span>FastAPI</span>
          <span>ML</span>
        </div>
      </div>
    </div>
  );
}
