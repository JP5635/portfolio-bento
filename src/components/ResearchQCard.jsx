import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Paper layout: lines defined as [rx, ry, rw, rh, type, hlGroup]
// rx/ry/rw/rh are fractions of the paper rect; hl = highlight group (1/2/3 or 0)
const LINES = [
  [.07, .07, .86, .07, 'title', 0],
  [.17, .18, .66, .03, 'sub',   0],
  [.07, .27, .86, .025,'body',  1],   // ← highlight 1
  [.07, .31, .80, .025,'body',  2],   // ← highlight 2
  [.07, .36, .84, .025,'body',  0],
  [.07, .40, .78, .025,'body',  0],
  [.07, .47, .40, .020,'body',  0],
  [.07, .51, .37, .020,'body',  3],   // ← highlight 3
  [.07, .55, .39, .020,'body',  0],
  [.07, .59, .34, .020,'body',  0],
  [.53, .47, .40, .020,'body',  0],
  [.53, .51, .38, .020,'body',  0],
  [.53, .55, .36, .020,'body',  0],
  [.53, .59, .40, .020,'body',  0],
  [.07, .68, .86, .21, 'fig',   0],
];

// Normalised y of highlight lines (used to trigger highlight during scan)
const HL_YS = [.27, .31, .51];

const Q       = 'What is the main finding?';
const EXCERPT = '...94.2% accuracy via hybrid retrieval + LLM synthesis, 2.7K+ queries...';
const ANSWER  = 'RAG pipeline achieves 94.2% accuracy on 2.7K+ queries.';

export default function ResearchQCard() {
  const canvasRef = useRef(null);
  const navigate  = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = canvas.offsetWidth;
    const h   = canvas.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Paper rect (centred, leaves a small margin)
    const DX = w * .07, DY = h * .05;
    const DW = w * .86, DH = h * .89;

    // Timing (ticks ≈ 60fps)
    const T_DOC   = 65;   // plain document
    const T_SCAN  = 125;  // scan sweeps
    const T_PAUSE = 145;  // brief hold (all highlighted)
    const T_FADE  = 165;  // 20-tick hard crossfade
    const T_QA    = 300;  // Q&A fully visible
    const T_LOOP  = 340;

    let tick = 0, animId;

    // ── Document render ───────────────────────────────────────────────────────
    function drawDoc(hlCount, alpha = 1) {
      ctx.globalAlpha = alpha;

      // White paper shadow
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.roundRect(DX+2, DY+2, DW, DH, 7);
      ctx.fill();

      // White paper body (fully opaque so dark CSS bg doesn't bleed through)
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = 'rgba(150,180,230,0.55)';
      ctx.lineWidth = 1;
      ctx.roundRect(DX, DY, DW, DH, 7);
      ctx.fill();
      ctx.stroke();

      LINES.forEach(([rx, ry, rw, rh, type, hlGroup]) => {
        const lx = DX + rx*DW, ly = DY + ry*DH;
        const lw = rw*DW,      lh = rh*DH;
        const lit = hlGroup > 0 && hlGroup <= hlCount;

        if (type === 'title') {
          ctx.fillStyle = 'rgba(20,25,40,0.82)';
          ctx.roundRect(lx, ly, lw, lh, 3);
          ctx.fill();
        } else if (type === 'sub') {
          ctx.fillStyle = 'rgba(80,90,110,0.55)';
          ctx.roundRect(lx, ly, lw, lh, 2);
          ctx.fill();
        } else if (type === 'fig') {
          ctx.fillStyle = 'rgba(200,210,230,0.40)';
          ctx.strokeStyle = 'rgba(160,175,200,0.35)';
          ctx.lineWidth = 0.8;
          ctx.roundRect(lx, ly, lw, lh, 3);
          ctx.fill();
          ctx.stroke();
        } else {
          if (lit) {
            // Highlight background
            ctx.fillStyle = 'rgba(66,133,244,0.15)';
            ctx.roundRect(lx-2, ly-1, lw+4, lh+2, 2);
            ctx.fill();
          }
          ctx.fillStyle = lit
            ? 'rgba(30,80,210,0.88)'   // vivid blue for highlighted
            : 'rgba(60,70,90,0.42)';   // neutral dark gray for normal text
          ctx.roundRect(lx, ly, lw, lh, 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
    }

    // ── Scan line ─────────────────────────────────────────────────────────────
    function drawScan(progress) {
      const sy = DY + progress * DH;
      const gr = ctx.createLinearGradient(0, sy-10, 0, sy+10);
      gr.addColorStop(0,   'rgba(66,133,244,0)');
      gr.addColorStop(0.5, 'rgba(66,133,244,0.55)');
      gr.addColorStop(1,   'rgba(66,133,244,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(DX, sy-10, DW, 20);
    }

    function countHL(progress) {
      return HL_YS.filter(yf => progress > yf).length;
    }

    // ── Q&A interface ─────────────────────────────────────────────────────────
    function drawQA(alpha, typedChars) {
      ctx.globalAlpha = alpha;
      const px = 10, pw = w - px*2;
      let cy = 9;

      // ── Q bubble
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.roundRect(px, cy, pw, 19, 5);
      ctx.fill();
      ctx.stroke();
      ctx.font = '700 7px Nunito, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(147,197,253,0.92)';
      ctx.fillText('Q', px+6, cy+13);
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.font = '600 7px Nunito, sans-serif';
      ctx.fillText(Q, px+18, cy+13);
      cy += 25;

      // ── Retrieved context
      ctx.fillStyle = 'rgba(66,133,244,0.12)';
      ctx.strokeStyle = 'rgba(99,163,255,0.28)';
      ctx.lineWidth = 1;
      ctx.roundRect(px, cy, pw, 34, 5);
      ctx.fill();
      ctx.stroke();
      ctx.font = '500 6px Nunito, sans-serif';
      ctx.fillStyle = 'rgba(147,197,253,0.55)';
      ctx.fillText('↳  retrieved context', px+7, cy+10);
      ctx.font = '500 6.5px Nunito, sans-serif';
      ctx.fillStyle = 'rgba(200,220,255,0.72)';
      const half = Math.ceil(EXCERPT.length / 2);
      ctx.fillText(EXCERPT.slice(0, half),  px+7, cy+22);
      ctx.fillText(EXCERPT.slice(half), px+7, cy+31);
      cy += 42;

      // ── A bubble
      ctx.fillStyle = 'rgba(66,133,244,0.18)';
      ctx.strokeStyle = 'rgba(99,163,255,0.28)';
      ctx.lineWidth = 1;
      ctx.roundRect(px, cy, pw, 28, 5);
      ctx.fill();
      ctx.stroke();
      ctx.font = '700 7px Nunito, sans-serif';
      ctx.fillStyle = 'rgba(52,211,153,0.92)';
      ctx.fillText('A', px+6, cy+12);
      const shown = ANSWER.slice(0, typedChars);
      ctx.font = '600 7px Nunito, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.90)';
      ctx.fillText(shown.slice(0, 42),  px+18, cy+12);
      if (shown.length > 42) ctx.fillText(shown.slice(42), px+18, cy+21);

      // Cursor blink
      if (typedChars < ANSWER.length && Math.floor(Date.now()/380) % 2 === 0) {
        const lineText = shown.length > 42 ? shown.slice(42) : shown;
        const tw  = ctx.measureText(lineText).width;
        const cly = shown.length > 42 ? cy+21 : cy+12;
        ctx.fillStyle = 'rgba(52,211,153,0.85)';
        ctx.fillRect(px+18+tw+1, cly-7, 1.5, 9);
      }

      ctx.globalAlpha = 1;
    }

    // ── Main loop ─────────────────────────────────────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, w, h);

      if (tick < T_DOC) {
        drawDoc(0);

      } else if (tick < T_SCAN) {
        const prog = (tick - T_DOC) / (T_SCAN - T_DOC);
        drawDoc(countHL(prog));
        drawScan(prog);

      } else if (tick < T_PAUSE) {
        drawDoc(3);

      } else if (tick < T_FADE) {
        // Fast 20-tick crossfade
        const p       = (tick - T_PAUSE) / (T_FADE - T_PAUSE);
        const docFade = Math.max(0, 1 - p * 2);
        const qaFade  = Math.min(1, Math.max(0, p * 2 - 0.5));
        if (docFade > 0.01) drawDoc(3, docFade);
        if (qaFade  > 0.01) drawQA(qaFade, 0);

      } else if (tick < T_QA) {
        const p       = (tick - T_FADE) / (T_QA - T_FADE);
        const typed   = Math.floor(Math.max(0, (p - 0.05) / 0.95) * ANSWER.length);
        drawQA(1, typed);

      } else {
        drawQA(1, ANSWER.length);
      }

      tick++;
      if (tick >= T_LOOP) tick = 0;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div id="rq" className="featured-card" onClick={() => navigate('/researchq')}>
      <div className="featured-thumb">
        <canvas ref={canvasRef} className="fill-canvas" aria-hidden="true" />
      </div>
      <div className="featured-details">
        <span className="featured-meta">ML/NLP</span>
        <h3 className="featured-title">ResearchQ</h3>
        <p className="featured-desc">LLM-powered research platform serving 2.7K+ users with custom RAG pipeline.</p>
      </div>
    </div>
  );
}
