import { useEffect, useRef, useState } from 'react';
import './VationoAnimation.css';

export default function VationoAnimation({ detail = false }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const replayRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const trigger = stage.closest('a') || stage;
    let model, disposed = false, loading = false, visible = false;
    let frame = 0, previous = 0, drawn = 0, elapsed = 0, remaining = 4500;

    function stop() { cancelAnimationFrame(frame); frame = 0; previous = 0; }
    function tick(now) {
      frame = 0;
      if (disposed || !visible || document.hidden || motion.matches || remaining <= 0) return;
      const delta = previous ? Math.min(now - previous, 100) : 0;
      previous = now;
      elapsed += delta;
      remaining -= delta;
      if (now - drawn >= 1000 / 24) { model.draw(elapsed / 1000); drawn = now; }
      if (remaining > 0) frame = requestAnimationFrame(tick);
    }
    function sync() {
      stop();
      if (model && visible && !document.hidden && !motion.matches && remaining > 0) frame = requestAnimationFrame(tick);
    }
    function play() { remaining = 4500; sync(); }
    replayRef.current = play;
    function resize() {
      if (!model || disposed) return;
      const { width, height } = stage.getBoundingClientRect();
      if (width && height) { model.resize(width, height); model.draw(elapsed / 1000); }
    }
    async function load() {
      if (model || loading || disposed) return;
      loading = true;
      try {
        const { mountVationoScene } = await import('./vationo-scene');
        if (disposed) return;
        model = mountVationoScene(canvas);
        resize();
        setReady(true);
        sync();
      } catch {
        // Keep the readable brand fallback when WebGL or the lazy chunk is unavailable.
        model?.dispose();
        model = undefined;
      } finally { loading = false; }
    }
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) void load();
      sync();
    });
    const sizeObserver = new ResizeObserver(resize);
    intersection.observe(stage);
    sizeObserver.observe(stage);
    trigger.addEventListener('pointerenter', play);
    trigger.addEventListener('focusin', play);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => {
      disposed = true;
      stop();
      intersection.disconnect();
      sizeObserver.disconnect();
      trigger.removeEventListener('pointerenter', play);
      trigger.removeEventListener('focusin', play);
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
      replayRef.current = null;
      model?.dispose();
    };
  }, []);

  return <div className={`vationo-animation${detail ? ' vationo-animation-detail' : ''}`}>
    <div className="vationo-stage" ref={stageRef}>
      <span className="vationo-brand">Vationo</span>
      <canvas ref={canvasRef} className={ready ? 'is-ready' : ''} role="img" aria-label="Vationo’s learning engine: nine tapered layers of black cells with changing gold connections." />
      {!ready && <span className="vationo-fallback">The learning engine</span>}
    </div>
    <div className="vationo-caption"><span>Learning engine · Vationo</span>{detail && ready && <button className="vationo-replay" type="button" onClick={() => replayRef.current?.()}>Replay animation ↻</button>}</div>
  </div>;
}
