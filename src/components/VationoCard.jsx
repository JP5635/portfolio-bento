import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VationoCard() {
  const canvasRef = useRef(null);
  const priceRef = useRef(null);
  const deltaRef = useRef(null);
  const navigate = useNavigate();

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

    // Generate smooth random walk price series
    const series = [100];
    for (let i = 1; i < 200; i++) {
      const drift = 0.02;
      const vol = 1.8;
      series.push(series[i - 1] + drift + (Math.random() - 0.5) * vol);
    }
    // Smooth via simple MA
    const smooth = series.map((v, i, a) => {
      const sl = a.slice(Math.max(0, i - 4), i + 1);
      return sl.reduce((s, x) => s + x, 0) / sl.length;
    });

    let offset = 0;
    const visLen = 50;

    let animationFrameId;
    function draw() {
      ctx.clearRect(0, 0, w, h);

      const start = Math.floor(offset) % smooth.length;
      const data = Array.from({ length: visLen }, (_, i) => smooth[(start + i) % smooth.length]);

      const minV = Math.min(...data);
      const maxV = Math.max(...data);
      const range = maxV - minV || 1;
      const pad = { t: 28, b: 28, l: 8, r: 8 };
      const cw = w - pad.l - pad.r;
      const ch = h - pad.t - pad.b;

      const toX = i => pad.l + (i / (visLen - 1)) * cw;
      const toY = v => pad.t + (1 - (v - minV) / range) * ch;

      // Gradient fill
      const grd = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
      grd.addColorStop(0, 'rgba(16,185,129,0.25)');
      grd.addColorStop(1, 'rgba(16,185,129,0.01)');

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
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Moving average overlay
      const ma = data.map((_, i, a) => {
        const sl = a.slice(Math.max(0, i - 7), i + 1);
        return sl.reduce((s, x) => s + x, 0) / sl.length;
      });
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(ma[0]));
      ma.forEach((v, i) => i > 0 && ctx.lineTo(toX(i), toY(v)));
      ctx.strokeStyle = 'rgba(217,119,6,0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Live dot
      const lastX = toX(visLen - 1);
      const lastY = toY(data[visLen - 1]);
      ctx.save();
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.restore();

      // HUD update
      const cur = data[visLen - 1];
      const delta = cur - data[0];
      const pct = ((delta / data[0]) * 100).toFixed(2);
      
      if (priceRef.current) priceRef.current.textContent = cur.toFixed(2);
      if (deltaRef.current) {
        deltaRef.current.textContent = `${pct >= 0 ? '+' : ''}${pct}%`;
        deltaRef.current.style.color = delta >= 0 ? '#059669' : '#dc2626';
        deltaRef.current.style.background = delta >= 0 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)';
      }

      offset += 0.1;
      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="vat" className="featured-card" onClick={() => navigate('/vationo')}>
      <div className="featured-thumb">
        <canvas ref={canvasRef} id="chart-canvas" className="fill-canvas" aria-hidden="true"></canvas>
        <div className="price-hud" aria-live="polite">
          <span ref={priceRef} id="price-val">—</span>
          <span ref={deltaRef} id="price-delta" className="price-delta">+0.00%</span>
        </div>
        <div className="featured-gradient" aria-hidden="true"></div>
      </div>
      <div className="featured-details">
        <span className="featured-meta">Quant</span>
        <h3 className="featured-title">Vationo</h3>
        <p className="featured-desc">Systematic trading research and regime-switching portfolio allocation framework.</p>
      </div>
    </div>
  );
}
