import { useEffect, useRef } from 'react';

const C = {
  src:    '#FF9900',   // AWS orange – data sources
  engine: '#8B5CF6',   // violet    – AI processor
  out:    '#10B981',   // emerald   – output
};

// Cubic bezier point evaluation
function cubicAt(t, p0, p1, p2, p3) {
  const m = 1 - t;
  return m*m*m*p0 + 3*m*m*t*p1 + 3*m*t*t*p2 + t*t*t*p3;
}

export default function YoungRichCard() {
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

    const BW = 38, BH = 32; // service box size
    const srcX = Math.round(w * 0.14);
    const engX = Math.round(w * 0.52);
    const outX = Math.round(w * 0.85);
    const midY = Math.round(h * 0.50);

    const sources = [
      { y: Math.round(h * 0.21), label: 'Market Data', icon: 'chart' },
      { y: midY,                 label: 'News Feed',   icon: 'feed'  },
      { y: Math.round(h * 0.79), label: 'Econ Data',   icon: 'econ'  },
    ];

    // ── Minimal AWS-style icons ───────────────────────────────────────────────
    function icon_chart(cx, cy, s) {
      [[-.38,.42],[0,.70],[.38,1.0]].forEach(([dx, fh]) => {
        ctx.fillRect(cx + dx*s - s*.1, cy + s*.45 - fh*s, s*.22, fh*s);
      });
    }

    function icon_feed(cx, cy, s) {
      ctx.lineWidth = 1.2;
      [[s*.80, -.24],[s*.56, .10],[s*.56, .44]].forEach(([lw, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx - lw/2, cy + dy*s);
        ctx.lineTo(cx + lw/2, cy + dy*s);
        ctx.stroke();
      });
    }

    function icon_econ(cx, cy, s) {
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx - s*.5, cy + s*.30);
      ctx.lineTo(cx - s*.12,cy - s*.06);
      ctx.lineTo(cx + s*.20,cy + s*.14);
      ctx.lineTo(cx + s*.50,cy - s*.40);
      ctx.stroke();
      // arrowhead tip
      ctx.beginPath();
      ctx.moveTo(cx + s*.50, cy - s*.40);
      ctx.lineTo(cx + s*.28, cy - s*.52);
      ctx.lineTo(cx + s*.32, cy - s*.18);
      ctx.closePath();
      ctx.fill();
    }

    function icon_brain(cx, cy, s) {
      const pts = [[0,-s*.52],[-s*.46,s*.26],[s*.46,s*.26]];
      ctx.lineWidth = 1;
      // edges
      for (let i = 0; i < 3; i++)
        for (let j = i+1; j < 3; j++) {
          ctx.beginPath();
          ctx.moveTo(cx+pts[i][0], cy+pts[i][1]);
          ctx.lineTo(cx+pts[j][0], cy+pts[j][1]);
          ctx.stroke();
        }
      // nodes
      pts.forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(cx+dx, cy+dy, s*.155, 0, Math.PI*2);
        ctx.fill();
      });
    }

    function icon_doc(cx, cy, s) {
      const x=cx-s*.40, y=cy-s*.58, fw=s*.80, fh=s*1.16, fold=s*.22;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x+fold,y); ctx.lineTo(x+fw,y);
      ctx.lineTo(x+fw,y+fh); ctx.lineTo(x,y+fh);
      ctx.lineTo(x,y+fold); ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x,y+fold); ctx.lineTo(x+fold,y+fold); ctx.lineTo(x+fold,y);
      ctx.stroke();
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x+s*.14, y+s*.44+i*s*.27);
        ctx.lineTo(x+fw-s*.10, y+s*.44+i*s*.27);
        ctx.stroke();
      }
    }

    const ICONS = { chart: icon_chart, feed: icon_feed, econ: icon_econ, brain: icon_brain, doc: icon_doc };

    // ── Service box ───────────────────────────────────────────────────────────
    function drawBox(cx, cy, label, bg, iconKey, glow = 0) {
      const bx = cx - BW/2, by = cy - BH/2;

      // Glow ring
      if (glow > 0.01) {
        ctx.beginPath();
        ctx.arc(cx, cy, BW/2 + 4 + glow*5, 0, Math.PI*2);
        ctx.strokeStyle = bg + Math.round(glow * 60).toString(16).padStart(2,'0');
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Box fill
      ctx.fillStyle = bg + 'CC';
      ctx.roundRect(bx, by, BW, BH, 6);
      ctx.fill();

      // Box border
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 1;
      ctx.roundRect(bx, by, BW, BH, 6);
      ctx.stroke();

      // Icon
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      ctx.strokeStyle = 'rgba(255,255,255,0.94)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ICONS[iconKey](cx, cy, BW * 0.27);
      ctx.restore();

      // Label
      ctx.font = '600 6.5px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.60)';
      ctx.fillText(label, cx, by + BH + 9);
    }

    // ── Bezier control points: src → engine ──────────────────────────────────
    function getCPs(srcY) {
      const x0 = srcX + BW/2,  y0 = srcY;
      const x3 = engX - BW/2,  y3 = midY;
      const cpx = (x0 + x3) / 2;
      return [x0, y0, cpx, y0, cpx, y3, x3, y3];
    }

    // ── Dashed path line ──────────────────────────────────────────────────────
    function drawPipe(x0, y0, x1, y1, x2, y2, x3, y3) {
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Small arrowhead pointing right at (tx, ty)
    function arrowRight(tx, ty, color) {
      const s = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(tx,     ty);
      ctx.lineTo(tx - s, ty - s*.5);
      ctx.lineTo(tx - s, ty + s*.5);
      ctx.closePath();
      ctx.fill();
    }

    // ── Packet system ─────────────────────────────────────────────────────────
    const packets = [];
    let reportCount = 0;
    let outGlow = 0;
    let engGlow = 0;

    function spawnSrc() {
      const src = sources[Math.floor(Math.random() * sources.length)];
      packets.push({
        phase: 'src',
        color: C.src,
        CPs: getCPs(src.y),
        t: 0,
        speed: 0.010 + Math.random() * 0.007,
      });
    }

    const intervalId = setInterval(spawnSrc, 680);
    spawnSrc();

    let animId;
    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Background pipes
      sources.forEach(src => {
        const [x0,y0,x1,y1,x2,y2,x3,y3] = getCPs(src.y);
        drawPipe(x0,y0,x1,y1,x2,y2,x3,y3);
      });
      drawPipe(engX+BW/2, midY, (engX+outX)/2, midY, (engX+outX)/2, midY, outX-BW/2, midY);

      // Arrowheads at destinations
      arrowRight(engX - BW/2, midY, 'rgba(255,255,255,0.20)');
      arrowRight(outX - BW/2, midY, 'rgba(255,255,255,0.20)');

      // Glow decay
      engGlow = Math.max(0, engGlow - 0.025);
      outGlow = Math.max(0, outGlow - 0.020);

      // Service boxes
      sources.forEach(src => drawBox(srcX, src.y, src.label, C.src, src.icon));
      drawBox(engX, midY, 'AI Engine', C.engine, 'brain', engGlow);
      drawBox(outX, midY, 'Reports',   C.out,    'doc',   outGlow);

      // Report counter
      ctx.font = '700 8px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = outGlow > 0.1
        ? `rgba(16,185,129,${0.65 + outGlow * 0.35})`
        : 'rgba(255,255,255,0.36)';
      ctx.fillText(`#${reportCount}`, outX, midY + BH/2 + 18);

      // Update & draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t = Math.min(1, p.t + p.speed);

        let px, py;
        if (p.phase === 'src') {
          const [x0,y0,x1,y1,x2,y2,x3,y3] = p.CPs;
          px = cubicAt(p.t, x0, x1, x2, x3);
          py = cubicAt(p.t, y0, y1, y2, y3);
        } else {
          px = (engX+BW/2) + ((outX-BW/2)-(engX+BW/2)) * p.t;
          py = midY;
        }

        // Glowing square packet
        const ps = 3.5;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 9;
        ctx.fillRect(px - ps/2, py - ps/2, ps, ps);
        ctx.shadowBlur = 0;

        if (p.t >= 1) {
          if (p.phase === 'src') {
            engGlow = 1;
            if (Math.random() < 0.40) {
              packets.push({ phase: 'out', color: C.out, t: 0, speed: 0.013 + Math.random()*0.007 });
            }
          } else {
            outGlow = 1;
            reportCount = Math.min(999, reportCount + 1);
          }
          packets.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div id="yr" className="featured-card">
      <div className="featured-thumb">
        <canvas ref={canvasRef} className="fill-canvas" aria-hidden="true" />
      </div>
      <div className="featured-details">
        <span className="featured-meta">Algorithmic Trading</span>
        <h3 className="featured-title">Young &amp; Rich Report</h3>
        <p className="featured-desc">Regime-switching asset allocation model on 20+ years of equity data.</p>
      </div>
    </div>
  );
}
