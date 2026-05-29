import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VationoCard() {
  const canvasRef = useRef(null);
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

    // Regime segments
    const regimes = [
      { from: 0,   to: 90,  type: 'bull' },
      { from: 90,  to: 165, type: 'bear' },
      { from: 165, to: 270, type: 'bull' },
      { from: 270, to: 330, type: 'bear' },
      { from: 330, to: 400, type: 'bull' },
    ];
    const TOTAL = 400;
    const VIS   = 65;

    function getRegime(i) {
      return regimes.find(r => i >= r.from && i < r.to) || regimes[regimes.length - 1];
    }

    // Price series following regimes
    const prices = [100];
    for (let i = 1; i < TOTAL; i++) {
      const r = getRegime(i);
      const drift = r.type === 'bull' ? 0.18 : -0.15;
      const vol   = r.type === 'bull' ? 1.0 : 1.8;
      prices.push(prices[i - 1] + drift + (Math.random() - 0.5) * vol);
    }
    // MA3 smoothing
    const smooth = prices.map((_, i, a) => {
      const sl = a.slice(Math.max(0, i - 3), i + 1);
      return sl.reduce((s, x) => s + x, 0) / sl.length;
    });

    let head = 0;
    let stockAlloc = 0.70;
    let animId;

    const CX = 8;
    const CW = w * 0.60;
    const CY = 16;
    const CH = h - CY - 44;
    const PX = CX + CW + 10;
    const PW = w - PX - 8;

    function draw() {
      ctx.clearRect(0, 0, w, h);

      const idx      = Math.min(Math.floor(head), TOTAL - 1);
      const visStart = Math.max(0, idx - VIS);
      const slice    = smooth.slice(visStart, idx + 1);

      if (slice.length < 2) {
        head += 0.2;
        animId = requestAnimationFrame(draw);
        return;
      }

      const curRegime = getRegime(idx);
      const targetStock = curRegime.type === 'bull' ? 0.70 : 0.20;
      stockAlloc += (targetStock - stockAlloc) * 0.025;

      const minV = Math.min(...slice);
      const maxV = Math.max(...slice);
      const range = (maxV - minV) || 1;
      const toX = i => CX + ((i - visStart) / VIS) * CW;
      const toY = v => CY + (1 - (v - minV) / range) * CH;

      // Chart border
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.strokeRect(CX, CY, CW, CH);

      // Regime background fills
      regimes.forEach(r => {
        const s = Math.max(visStart, r.from);
        const e = Math.min(idx, r.to - 1);
        if (e <= s) return;
        ctx.fillStyle = r.type === 'bull' ? 'rgba(52,168,83,0.10)' : 'rgba(239,68,68,0.10)';
        ctx.fillRect(toX(s), CY, toX(e) - toX(s), CH);
      });

      // Regime switch markers
      regimes.forEach(r => {
        if (r.from <= visStart || r.from > idx) return;
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(toX(r.from), CY);
        ctx.lineTo(toX(r.from), CY + CH);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Price gradient fill
      const lineColor = curRegime.type === 'bull' ? '#34d399' : '#f87171';
      const grd = ctx.createLinearGradient(0, CY, 0, CY + CH);
      grd.addColorStop(0, curRegime.type === 'bull' ? 'rgba(52,168,83,0.22)' : 'rgba(239,68,68,0.18)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.moveTo(toX(visStart), toY(slice[0]));
      slice.forEach((v, i) => i > 0 && ctx.lineTo(toX(visStart + i), toY(v)));
      ctx.lineTo(toX(idx), CY + CH);
      ctx.lineTo(toX(visStart), CY + CH);
      ctx.closePath();
      ctx.fillStyle = grd;
      ctx.fill();

      // Price line
      ctx.beginPath();
      ctx.moveTo(toX(visStart), toY(slice[0]));
      slice.forEach((v, i) => i > 0 && ctx.lineTo(toX(visStart + i), toY(v)));
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.8;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Live dot
      const lx = toX(idx);
      const ly = toY(slice[slice.length - 1]);
      ctx.beginPath();
      ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.shadowColor = lineColor;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Regime label
      ctx.font = '800 8.5px Nunito, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = lineColor;
      ctx.fillText(`${curRegime.type.toUpperCase()} REGIME`, CX + 4, CY + 12);

      // Window return
      const ret = ((slice[slice.length - 1] - slice[0]) / slice[0] * 100).toFixed(1);
      ctx.textAlign = 'right';
      ctx.fillStyle = Number(ret) >= 0 ? '#34d399' : '#f87171';
      ctx.font = '700 8px Nunito, sans-serif';
      ctx.fillText(`${Number(ret) >= 0 ? '+' : ''}${ret}%`, CX + CW - 4, CY + 12);

      // Allocation panel
      ctx.font = '600 7.5px Nunito, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.38)';
      ctx.textAlign = 'left';
      ctx.fillText('ALLOCATION', PX, CY + 10);

      const allocs = [
        { label: 'EQ',   val: stockAlloc,       color: '#60a5fa' },
        { label: 'BOND', val: 1 - stockAlloc,   color: '#a78bfa' },
      ];
      allocs.forEach((a, i) => {
        const bY = CY + 16 + i * 34;
        const bH = 14;
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.roundRect(PX, bY, PW, bH, 4);
        ctx.fill();

        const fw = Math.max(3, a.val * PW);
        ctx.fillStyle = a.color;
        ctx.shadowColor = a.color;
        ctx.shadowBlur = 4;
        ctx.roundRect(PX, bY, fw, bH, 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '700 7.5px Nunito, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.textAlign = 'left';
        ctx.fillText(a.label, PX + 3, bY + bH - 3);
        ctx.textAlign = 'right';
        ctx.fillStyle = a.color;
        ctx.fillText(`${Math.round(a.val * 100)}%`, PX + PW - 3, bY + bH - 3);
      });

      // Portfolio NAV
      ctx.font = '800 10.5px Nunito, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.fillText(smooth[idx].toFixed(2), CX + 4, h - 10);

      ctx.font = '600 7.5px Nunito, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      ctx.fillText('Portfolio NAV', CX + 4, h - 2);

      head += 0.2;
      if (head >= TOTAL + VIS) head = 0;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div id="vat" className="featured-card" onClick={() => navigate('/vationo')}>
      <div className="featured-thumb">
        <canvas ref={canvasRef} className="fill-canvas" aria-hidden="true" />
      </div>
      <div className="featured-details">
        <span className="featured-meta">Quant</span>
        <h3 className="featured-title">Vationo</h3>
        <p className="featured-desc">Systematic trading research and regime-switching portfolio allocation framework.</p>
      </div>
    </div>
  );
}
