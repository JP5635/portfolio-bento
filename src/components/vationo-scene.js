import * as THREE from 'three';

// Adapted from vationo.com's public Lt/Ct/At hero scene (2026-09-09).
// Preserve its nine 12×12 layers, taper, palette, box pulses and gold connections.
// Only the camera framing and playback lifecycle change for the portfolio.
export const GRID = 12;
export const LAYERS = 9;
export const CONNECTIONS = 100;
export const layerScale = layer => 0.2 + Math.abs(layer - Math.floor(LAYERS / 2)) * 0.2;

export function createVationoScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#ffffff');
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  const group = new THREE.Group();
  group.rotation.set(-Math.PI / 3, Math.PI / 4, 0);
  scene.add(group);
  const count = GRID * GRID * LAYERS;
  const boxes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.6, 0.6, 0.1), new THREE.MeshBasicMaterial(), count);
  const links = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.01, 0.01, 1, 6), new THREE.MeshBasicMaterial({ color: '#ffd700', transparent: true, opacity: 0.6 }), CONNECTIONS);
  boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  links.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  group.add(boxes, links);
  const dummy = new THREE.Object3D();
  const palette = ['#000000', '#1a1a1a', '#333333', '#4d4d4d'].map(color => new THREE.Color(color));
  const phases = Float32Array.from({ length: count }, () => Math.random() * 1000);
  let connectionTime = -Infinity;

  function update(time) {
    dummy.rotation.set(0, 0, 0);
    for (let index = 0; index < count; index++) {
      const step = Math.floor(time * 2 + phases[index]);
      const noise = Math.sin(step * 12.9898 + phases[index]) * 43758.5453;
      const value = noise - Math.floor(noise);
      const layer = Math.floor(index / (GRID * GRID));
      const within = index % (GRID * GRID);
      const scale = layerScale(layer);
      dummy.position.set((within % GRID - GRID / 2) * 0.8 * scale, (Math.floor(within / GRID) - GRID / 2) * 0.8 * scale, layer * 2);
      dummy.scale.set(scale, scale, 1 + value * 0.3);
      dummy.updateMatrix();
      boxes.setMatrixAt(index, dummy.matrix);
      boxes.setColorAt(index, palette[Math.min(3, Math.floor(value * palette.length))]);
    }
    boxes.instanceMatrix.needsUpdate = true;
    boxes.instanceColor.needsUpdate = true;
    if (time - connectionTime >= 0.15) {
      for (let index = 0; index < CONNECTIONS; index++) {
        const layer = Math.floor(Math.random() * (LAYERS - 1));
        const col = Math.floor(Math.random() * GRID) - GRID / 2;
        const row = Math.floor(Math.random() * GRID) - GRID / 2;
        const start = new THREE.Vector3(col * 0.8 * layerScale(layer), row * 0.8 * layerScale(layer), layer * 2);
        const end = new THREE.Vector3(col * 0.8 * layerScale(layer + 1), row * 0.8 * layerScale(layer + 1), (layer + 1) * 2);
        dummy.position.copy(start).add(end).multiplyScalar(0.5);
        dummy.lookAt(end);
        dummy.rotateX(Math.PI / 2);
        dummy.scale.set(1, start.distanceTo(end), 1);
        dummy.updateMatrix();
        links.setMatrixAt(index, dummy.matrix);
      }
      links.instanceMatrix.needsUpdate = true;
      connectionTime = time;
    }
  }
  update(0);
  boxes.computeBoundingBox();
  group.updateMatrixWorld(true);
  const bounds = boxes.boundingBox.clone().applyMatrix4(boxes.matrixWorld);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  function resize(aspect) {
    camera.aspect = aspect;
    const fit = Math.max(size.x / aspect, size.y) / (2 * Math.tan(THREE.MathUtils.degToRad(22.5)));
    camera.position.set(center.x, center.y, center.z + size.z / 2 + fit * 1.12);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
  }
  resize(480 / 286);
  return { scene, camera, update, resize, dispose() {
    for (const mesh of [boxes, links]) { mesh.geometry.dispose(); mesh.material.dispose(); mesh.dispose(); }
    scene.clear();
  } };
}

export function mountVationoScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const model = createVationoScene();
  return {
    draw(time) { model.update(time); renderer.render(model.scene, model.camera); },
    resize(width, height) { renderer.setSize(width, height, false); model.resize(width / height); },
    dispose() { model.dispose(); renderer.dispose(); renderer.forceContextLoss(); },
  };
}
