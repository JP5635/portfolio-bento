import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix4, Vector3, Box3 } from 'three';
import { createVationoScene, GRID, LAYERS, CONNECTIONS, layerScale } from '../src/components/vationo-scene.js';

test('Vationo preserves the source layer geometry and gold connections', () => {
  const model = createVationoScene();
  const group = model.scene.children[0];
  const [boxes, links] = group.children;
  assert.equal(boxes.count, 1296);
  assert.equal(GRID * GRID * LAYERS, boxes.count);
  assert.equal(links.count, CONNECTIONS);
  assert.equal(links.material.color.getHexString(), 'ffd700');
  assert.equal(layerScale(4), 0.2);
  assert.equal(layerScale(0), layerScale(8));
  assert.equal(group.rotation.x, -Math.PI / 3);
  assert.equal(group.rotation.y, Math.PI / 4);
  const matrix = new Matrix4();
  boxes.getMatrixAt(8 * GRID * GRID, matrix);
  assert.equal(matrix.elements[14], 16);
  model.update(0.2);
  assert.ok([...boxes.instanceMatrix.array, ...links.instanceMatrix.array].every(Number.isFinite));
  model.dispose();
  assert.equal(model.scene.children.length, 0);
});

test('camera frames every layer on wide and narrow covers', () => {
  const model = createVationoScene();
  const boxes = model.scene.children[0].children[0];
  for (const aspect of [1, 480 / 286, 2.5]) {
    model.resize(aspect);
    model.camera.updateMatrixWorld(true);
    const bounds = new Box3().copy(boxes.boundingBox).applyMatrix4(boxes.matrixWorld);
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      const point = new Vector3(x, y, z).project(model.camera);
      assert.ok(Math.abs(point.x) <= 1 && Math.abs(point.y) <= 1);
      assert.ok(point.z >= -1 && point.z <= 1);
    }
  }
  model.dispose();
});
