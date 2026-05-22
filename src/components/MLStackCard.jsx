import React, { useEffect, useRef } from 'react';

export default function MLStackCard() {
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

    // Layout configuration
    const xInput = w * 0.15;
    const xHidden = w * 0.50;
    const xOutput = w * 0.85;

    const inputNodes = [];
    const hiddenNodes = [];
    const outputNodes = [];

    const numInput = 4;
    const numHidden = 5;
    const numOutput = 3;

    // Initialize nodes
    for (let i = 0; i < numInput; i++) {
      inputNodes.push({
        x: xInput,
        y: h * 0.2 + (i / (numInput - 1)) * (h * 0.55),
        glow: 0,
        type: 'input'
      });
    }

    for (let i = 0; i < numHidden; i++) {
      hiddenNodes.push({
        x: xHidden,
        y: h * 0.15 + (i / (numHidden - 1)) * (h * 0.65),
        glow: 0,
        type: 'hidden'
      });
    }

    for (let i = 0; i < numOutput; i++) {
      outputNodes.push({
        x: xOutput,
        y: h * 0.22 + (i / (numOutput - 1)) * (h * 0.5),
        glow: 0,
        type: 'output'
      });
    }

    const allNodes = [...inputNodes, ...hiddenNodes, ...outputNodes];
    const synapses = [];

    // Fully connect Input -> Hidden
    inputNodes.forEach(input => {
      hiddenNodes.forEach(hidden => {
        synapses.push({ from: input, to: hidden });
      });
    });

    // Fully connect Hidden -> Output
    hiddenNodes.forEach(hidden => {
      outputNodes.forEach(output => {
        synapses.push({ from: hidden, to: output });
      });
    });

    const particles = [];

    function spawnSignal() {
      // Trigger a random input node to glow and start propagating signals
      const sourceNode = inputNodes[Math.floor(Math.random() * inputNodes.length)];
      sourceNode.glow = 1.0;

      hiddenNodes.forEach(targetNode => {
        // Propagate to a subset of hidden nodes for visual variance
        if (Math.random() < 0.75) {
          particles.push({
            from: sourceNode,
            to: targetNode,
            t: 0,
            speed: 0.012 + Math.random() * 0.008,
            color: '#a78bfa'
          });
        }
      });
    }

    const intervalId = setInterval(spawnSignal, 1500);
    spawnSignal();
    
    // Spawn a second wave slightly offset
    const initialTimeoutId = setTimeout(spawnSignal, 750);

    let animationFrameId;
    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Decelerate node glow states
      allNodes.forEach(node => {
        if (node.glow > 0) {
          node.glow -= 0.035;
          if (node.glow < 0) node.glow = 0;
        }
      });

      // Draw connections (synapses) with responsive opacity
      ctx.lineWidth = 1;
      synapses.forEach(syn => {
        ctx.beginPath();
        ctx.moveTo(syn.from.x, syn.from.y);
        ctx.lineTo(syn.to.x, syn.to.y);
        const intensity = 0.04 + (syn.from.glow + syn.to.glow) * 0.08;
        ctx.strokeStyle = `rgba(167, 139, 250, ${intensity})`;
        ctx.stroke();
      });

      // Update and draw signal particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t += p.speed;

        if (p.t >= 1) {
          p.to.glow = 1.0;

          // If reached hidden layer, forward signals to the output layer
          if (p.to.type === 'hidden') {
            outputNodes.forEach(outNode => {
              if (Math.random() < 0.6) {
                particles.push({
                  from: p.to,
                  to: outNode,
                  t: 0,
                  speed: 0.015 + Math.random() * 0.01,
                  color: '#f472b6'
                });
              }
            });
          }

          particles.splice(i, 1);
          continue;
        }

        const px = p.from.x + (p.to.x - p.from.x) * p.t;
        const py = p.from.y + (p.to.y - p.from.y) * p.t;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // Draw nodes
      allNodes.forEach(node => {
        // Outer halo glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7 + node.glow * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${0.05 + node.glow * 0.22})`;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = node.glow > 0.35 ? '#ffffff' : '#a78bfa';
        ctx.strokeStyle = '#08051c';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
      clearTimeout(initialTimeoutId);
    };
  }, []);

  return (
    <div id="ml" className="pebble">
      <canvas ref={canvasRef} className="fill-canvas" aria-hidden="true"></canvas>
      <div className="card-content bottom-overlay">
        <h2 className="card-title">Machine Learning Stack</h2>
        <p className="card-sub">Core architecture and deep learning frameworks</p>
        <div className="ml-pills">
          <span>PyTorch</span>
          <span>TensorFlow</span>
          <span>Transformers</span>
          <span>CUDA</span>
          <span>scikit-learn</span>
        </div>
      </div>
    </div>
  );
}
