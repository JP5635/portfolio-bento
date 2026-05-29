import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SepsisCard() {
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

    const TOTAL = 300;
    const CRISIS = 150;
    const VIS = 80;

    function makeSeries(baseFn, noise) {
      return Array.from({ length: TOTAL }, (_, i) =>
        baseFn(i) + (Math.random() - 0.5) * noise
      );
    }

    const hrData   = makeSeries(i => i < CRISIS ? 76 : Math.min(130, 76 + (i - CRISIS) * 0.26), 5);
    const spo2Data = makeSeries(i => i < CRISIS ? 98 : Math.max(87, 98 - (i - CRISIS) * 0.065), 1.0);
    const tempData = makeSeries(i => i < CRISIS ? 37.0 : Math.min(39.5, 37.0 + (i - CRISIS) * 0.016), 0.18);

    const tracks = [
      { label: 'HR',   unit: 'bpm', data: hrData,   color: '#f87171', min: 45,   max: 155, midFrac: 0.19, halfH: h * 0.095, warnMax: 100 },
      { label: 'SpO₂', unit: '%',   data: spo2Data, color: '#60a5fa', min: 84,   max: 101, midFrac: 0.50, halfH: h * 0.095, warnMin: 95  },
      { label: 'TEMP', unit: '°C',  data: tempData, color: '#34d399', min: 35.5, max: 40.5, midFrac: 0.81, halfH: h * 0.095, warnMax: 38.3 },
    ];

    let head = 0;
    let riskScore = 0;
    let alertPulse = 0;
    let animId;

    function draw() {
      ctx.clearRect(0, 0, w, h);

      const safeHead = Math.min(Math.floor(head), TOTAL - 1);
      const visStart = Math.max(0, safeHead - VIS);

      const curHR   = hrData[safeHead];
      const curSpo2 = spo2Data[safeHead];
      const curTemp = tempData[safeHead];

      let target = 0;
      if (curHR   > 100)  target += Math.min(0.4, (curHR - 100) / 50 * 0.4);
      if (curSpo2 < 95)   target += Math.min(0.4, (95 - curSpo2) / 8 * 0.4);
      if (curTemp > 38.3) target += Math.min(0.2, (curTemp - 38.3) / 1.5 * 0.2);
      riskScore += (Math.min(1, target) - riskScore) * 0.04;

      const isCritical = riskScore > 0.42;
      alertPulse = Math.max(0, Math.min(1, alertPulse + (isCritical ? 0.06 : -0.04)));

      if (alertPulse > 0.01) {
        ctx.fillStyle = `rgba(239,68,68,${alertPulse * 0.07})`;
        ctx.fillRect(0, 0, w, h);
      }

      tracks.forEach(track => {
        const midY  = track.midFrac * h;
        const curVal = track.data[safeHead];
        const isAbnormal =
          (track.warnMax != null && curVal > track.warnMax) ||
          (track.warnMin != null && curVal < track.warnMin);
        const col = isAbnormal && alertPulse > 0.2 ? '#ef4444' : track.color;

        const toX = i => ((i - visStart) / VIS) * (w - 10) + 5;
        const toY = v => midY - ((v - track.min) / (track.max - track.min) - 0.5) * track.halfH * 2.1;

        ctx.beginPath();
        let first = true;
        for (let i = visStart; i <= safeHead; i++) {
          const x = toX(i);
          const y = toY(track.data[i]);
          if (first) { ctx.moveTo(x, y); first = false; }
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.4;
        ctx.lineJoin = 'round';
        ctx.stroke();

        const dotX = toX(safeHead);
        const dotY = toY(curVal);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 9;
        ctx.fill();
        ctx.shadowBlur = 0;

        const labelY = midY - track.halfH - 2;
        ctx.font = '700 7.5px Nunito, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.38)';
        ctx.fillText(track.label, 5, labelY);

        ctx.font = '800 8px Nunito, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = col;
        const dec = track.label === 'TEMP' ? 1 : 0;
        ctx.fillText(`${curVal.toFixed(dec)} ${track.unit}`, w - 5, labelY);
      });

      // Dividers
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      [0.345, 0.655].forEach(f => {
        ctx.beginPath();
        ctx.moveTo(0, f * h);
        ctx.lineTo(w, f * h);
        ctx.stroke();
      });

      // Risk bar
      const barY = h - 13;
      const bW   = w - 14;
      ctx.font = '600 7px Nunito, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText('SEPSIS RISK', 7, barY - 3);

      const rCol = riskScore < 0.3 ? '#34d399' : riskScore < 0.55 ? '#fbbf24' : '#ef4444';
      ctx.textAlign = 'right';
      ctx.fillStyle = rCol;
      ctx.fillText(`${Math.round(riskScore * 100)}%`, w - 7, barY - 3);

      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.roundRect(7, barY, bW, 5, 3);
      ctx.fill();

      ctx.fillStyle = rCol;
      ctx.shadowColor = rCol;
      ctx.shadowBlur = riskScore > 0.4 ? 6 : 0;
      ctx.roundRect(7, barY, Math.max(3, riskScore * bW), 5, 3);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (alertPulse > 0.28) {
        const pulse = 0.72 + 0.28 * Math.sin(Date.now() / 270);
        ctx.font = '800 8.5px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(239,68,68,${alertPulse * pulse * 0.9})`;
        ctx.fillText('⚠  EARLY WARNING', w / 2, 10);
      }

      head += 0.35;
      if (head >= TOTAL + VIS) { head = 0; riskScore = 0; alertPulse = 0; }
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div id="sep" className="featured-card" onClick={() => navigate('/sepsis')}>
      <div className="featured-thumb">
        <canvas ref={canvasRef} className="fill-canvas" aria-hidden="true" />
      </div>
      <div className="featured-details">
        <span className="featured-meta">Healthcare AI</span>
        <h3 className="featured-title">Sepsis Detection</h3>
        <p className="featured-desc">Interpretable early-warning clinical model built using MIMIC-IV time-series data.</p>
      </div>
    </div>
  );
}
