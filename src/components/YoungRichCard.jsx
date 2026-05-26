import React, { useEffect, useRef } from 'react';

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

    // Layout anchors
    const srcX = w * 0.16;
    const procX = w * 0.50;
    const outX = w * 0.84;
    const midY = h * 0.50;

    // Data sources: y position + label + color
    const sources = [
      { y: h * 0.22, label: 'Markets', color: '#fbbf24' },
      { y: h * 0.50, label: 'News', color: '#f87171' },
      { y: h * 0.78, label: 'Econ', color: '#34d399' }
    ];

    // Bezier cubic helper: point on curve at t
    function bezier(t, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
      const mt = 1 - t;
      return {
        x: mt * mt * mt * p0x + 3 * mt * mt * t * p1x + 3 * mt * t * t * p2x + t * t * t * p3x,
        y: mt * mt * mt * p0y + 3 * mt * mt * t * p1y + 3 * mt * t * t * p2y + t * t * t * p3y
      };
    }

    const packets = [];
    let outGlow = 0; // 0->1 burst when a report is emitted
    let reportCount = 0;
    let landingAnim = 0; // 0 to 1 progress for landing report page

    function spawnSourcePacket() {
      const src = sources[Math.floor(Math.random() * sources.length)];
      packets.push({
        phase: 'src→proc',
        color: src.color,
        srcY: src.y,
        t: 0,
        speed: 0.010 + Math.random() * 0.007
      });
    }

    const intervalId = setInterval(spawnSourcePacket, 720);
    spawnSourcePacket();
    
    // Stagger second packet
    const initialT = setTimeout(spawnSourcePacket, 360);

    // Draw symbols for Sources
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

      ctx.fillStyle = 'rgba(18, 18, 18, 0.7)';
      ctx.font = '700 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y + 30);
    }

    // Draw Processor core
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

      ctx.fillStyle = 'rgba(18, 18, 18, 0.7)';
      ctx.font = '700 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AI Engine', x, y + 32);
    }

    // Draw Tilted Page (Report Sheet)
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.65)';
        ctx.lineWidth = 1.5;
      }
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.strokeStyle = isGlow ? 'rgba(251, 191, 36, 0.7)' : 'rgba(217, 119, 6, 0.25)';
      ctx.lineWidth = 1.2;
      for (let offset = -4; offset <= 8; offset += 4) {
        ctx.moveTo(sx - 10, sy + offset);
        ctx.lineTo(sx + 10, sy + offset - 4);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw Stack of Reports
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
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = 'rgba(18, 18, 18, 0.4)';
        ctx.font = '700 9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Reports: 0', x, y + 32);
        return;
      }

      const numBaseSheets = Math.min(6, reportCount);

      for (let j = 0; j < numBaseSheets; j++) {
        const isTop = j === numBaseSheets - 1;
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

      ctx.fillStyle = 'rgba(18, 18, 18, 0.8)';
      ctx.font = '700 9.5px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Reports: #${reportCount}`, x, y + 32);
    }

    // Draw bezier pipe (background tube)
    function drawPipe(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y, color) {
      ctx.beginPath();
      ctx.moveTo(p0x, p0y);
      ctx.bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    let animationFrameId;
    function draw() {
      ctx.clearRect(0, 0, w, h);

      if (landingAnim > 0) {
        landingAnim = Math.max(0, landingAnim - 0.04);
      }

      // Background pipe tubes
      sources.forEach(src => {
        const cp = (srcX + procX) / 2;
        drawPipe(
          srcX + 22,
          src.y,
          cp,
          src.y,
          cp,
          midY,
          procX - 22,
          midY,
          'rgba(232, 80, 83, 0.08)'
        );
      });
      // Proc → Report pipe
      drawPipe(
        procX + 22,
        midY,
        (procX + outX) / 2,
        midY,
        (procX + outX) / 2,
        midY,
        outX - 20,
        midY,
        'rgba(232, 80, 83, 0.08)'
      );

      // Source nodes
      sources.forEach(src => {
        drawSourceSymbol(srcX, src.y, src.label, src.color, src.label);
      });

      // AI Process node
      drawProcessorSymbol(procX, midY);

      // Report output node
      if (outGlow > 0) {
        outGlow = Math.max(0, outGlow - 0.025);
      }
      drawReportStack(outX, midY);

      // Update + draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t = Math.min(1, p.t + p.speed);

        let px, py;

        if (p.phase === 'src→proc') {
          const cpx = (srcX + procX) / 2;
          const pt = bezier(p.t, srcX + 22, p.srcY, cpx, p.srcY, cpx, midY, procX - 22, midY);
          px = pt.x;
          py = pt.y;
        } else {
          px = procX + 22 + (outX - 20 - (procX + 22)) * p.t;
          py = midY;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.restore();

        const trailT = Math.max(0, p.t - 0.06);
        let tx, ty;
        if (p.phase === 'src→proc') {
          const cpx = (srcX + procX) / 2;
          const tp = bezier(trailT, srcX + 22, p.srcY, cpx, p.srcY, cpx, midY, procX - 22, midY);
          tx = tp.x;
          ty = tp.y;
        } else {
          tx = procX + 22 + (outX - 20 - (procX + 22)) * trailT;
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
                phase: 'proc→report',
                color: '#a78bfa',
                t: 0,
                speed: 0.014 + Math.random() * 0.006
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

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
      clearTimeout(initialT);
    };
  }, []);

  return (
    <div id="yr" className="featured-card">
      <div className="featured-thumb">
        <canvas ref={canvasRef} id="yr-canvas" className="fill-canvas" aria-hidden="true"></canvas>
        <div className="featured-gradient" aria-hidden="true"></div>
      </div>
      <div className="featured-details">
        <span className="featured-meta">Algorithmic Trading</span>
        <h3 className="featured-title">Young & Rich Report</h3>
        <p className="featured-desc">Regime-switching asset allocation model on 20+ years of equity data.</p>
      </div>
    </div>
  );
}
