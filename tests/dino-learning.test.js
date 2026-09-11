import test from 'node:test';
import assert from 'node:assert/strict';
import { ALPHA, GAMMA, START_POSITION, DinoLearner, initialState, observe, randomObstacleLayout, seededRandom, stateKey, transition, updateQ } from '../src/components/dino-learning.js';

const state = (position = 6, direction = 1) => ({ position, direction, goal: 23, steps: 0 });

test('sensor sees only three cells in the facing direction, including walls', () => {
  assert.deepEqual(observe(state()), ['obstacle', 'clear', 'clear']);
  assert.deepEqual(observe(state(6, -1)), ['clear', 'clear', 'clear']);
  assert.deepEqual(observe(state(22)), ['goal', 'wall', 'wall']);
  assert.deepEqual(observe(state(0, -1)), ['wall', 'wall', 'wall']);
  assert.equal(stateKey(state(2)), stateKey(state(10)));
  assert.equal(stateKey(state(2), [7, 16]), stateKey(state(2), [8, 18]));
  assert.equal(stateKey({ position: 12, direction: 1, goal: 0, steps: 0 }, []), stateKey({ position: 12, direction: 1, goal: 23, steps: 0 }, []));
});

test('forward collides, turn changes facing only, jump clears one obstacle', () => {
  const forward = transition(state(), 0);
  assert.equal(forward.collisionType, 'obstacle');
  assert.equal(forward.next.position, 6);
  assert.equal(forward.terminal, true);
  assert.equal(forward.reward, -3.02);
  const turn = transition(state(), 1);
  assert.equal(turn.next.position, 6);
  assert.equal(turn.next.direction, -1);
  assert.equal(turn.reward, -0.08);
  const jump = transition(state(), 2);
  assert.equal(jump.next.position, 8);
  assert.equal(jump.collision, false);
  assert.equal(jump.reward, -0.12);
  assert.equal(transition({ position: 12, direction: 1, goal: 23, steps: 0 }, 0, []).reward,
    transition({ position: 12, direction: 1, goal: 0, steps: 0 }, 0, []).reward);
});

test('jump landing on an obstacle or beyond a wall collides, in either direction', () => {
  assert.equal(transition(state(5), 2).collisionType, 'obstacle');
  assert.equal(transition(state(9, -1), 2).collisionType, 'obstacle');
  assert.equal(transition(state(1, -1), 2).collisionType, 'wall');
  assert.equal(transition(state(22), 2).collisionType, 'wall');
  assert.equal(transition(state(8, -1), 2).next.position, 6);
});

test('goal completion and collision are terminal; time limits only truncate', () => {
  const goal = transition(state(22), 0);
  assert.equal(goal.complete, true);
  assert.equal(goal.reward, 4.98);
  const timeout = transition({ ...state(2), steps: 99 }, 1);
  assert.equal(timeout.truncated, true);
  assert.equal(timeout.terminal, false);
});

test('Q-learning applies Bellman update, without bootstrapping terminal states', () => {
  assert.equal(updateQ([1, 2, 3], 0, 0.5, [2, 4, 6], false), 1 + ALPHA * (0.5 + GAMMA * 6 - 1));
  assert.equal(updateQ([1, 2, 3], 1, -3, [100, 100, 100], true), 2 + ALPHA * (-3 - 2));
});

test('episodes start in the middle with endpoint goals and independent initial directions', () => {
  const random = seededRandom(90826);
  const starts = Array.from({ length: 100 }, () => initialState(random));
  assert.ok(starts.every(entry => entry.position === START_POSITION));
  assert.ok(starts.every(entry => entry.goal === 0 || entry.goal === 23));
  assert.deepEqual(new Set(starts.map(entry => entry.goal)), new Set([0, 23]));
  assert.deepEqual(new Set(starts.map(entry => entry.direction)), new Set([-1, 1]));
  assert.ok(starts.some(entry => Math.sign(entry.goal - entry.position) === entry.direction));
  assert.ok(starts.some(entry => Math.sign(entry.goal - entry.position) !== entry.direction));
  const challenge = new DinoLearner();
  challenge.resetEpisode({ facingAway: true });
  assert.notEqual(Math.sign(challenge.state.goal - challenge.state.position), challenge.state.direction);
});

test('each episode gets one to three separated, solvable obstacles', () => {
  const random = seededRandom(90826);
  const layouts = Array.from({ length: 80 }, () => randomObstacleLayout(random));
  assert.ok(new Set(layouts.map(layout => layout.join(','))).size > 20);
  for (const layout of layouts) {
    assert.ok(layout.length >= 1 && layout.length <= 3);
    assert.deepEqual(layout, [...layout].sort((a, b) => a - b));
    assert.ok(layout.every(cell => cell >= 2 && cell <= 21));
    assert.ok(layout.every((cell, index) => index === 0 || cell - layout[index - 1] > 1));
  }
});

test('the live model changes layouts by episode while an explicit test layout stays fixed', () => {
  const model = new DinoLearner();
  const seen = new Set([model.obstacles.join(',')]);
  for (let episode = 0; episode < 20; episode++) {
    assert.ok(!model.obstacles.includes(model.state.position));
    assert.ok(!model.obstacles.includes(model.state.goal));
    model.resetEpisode();
    seen.add(model.obstacles.join(','));
  }
  assert.ok(seen.size > 10);
  const fixed = new DinoLearner([5, 12]);
  fixed.resetEpisode();
  assert.deepEqual(fixed.obstacles, [5, 12]);
});

test('500 episodes learn a better policy than random; evaluation and run mode never update Q', () => {
  const model = new DinoLearner();
  assert.equal(model.q.size, 0);
  const baseline = model.evaluate(true);
  while (model.episodes < 500) model.step(true);
  const snapshot = JSON.stringify([...model.q]);
  const updates = model.updates;
  const result = model.evaluate();
  assert.ok(result.success > 0.85);
  assert.ok(result.success > baseline.success + 0.75);
  assert.ok(result.collisions < baseline.collisions);
  assert.ok(result.reward > baseline.reward);
  assert.equal(JSON.stringify([...model.q]), snapshot);
  assert.equal(model.updates, updates);
  for (let i = 0; i < 200; i++) model.step(false);
  assert.equal(JSON.stringify([...model.q]), snapshot);
  assert.equal(model.updates, updates);
});

test('training is reproducible and a fresh model removes learned values', () => {
  const a = new DinoLearner(), b = new DinoLearner();
  for (let i = 0; i < 300; i++) {
    a.step(); b.step();
    assert.deepEqual(a.obstacles, b.obstacles);
  }
  assert.deepEqual([...a.q], [...b.q]);
  assert.ok(a.epsilon < 0.6 && a.epsilon >= 0.05);
  assert.ok(a.history.length <= 60);
  assert.equal(new DinoLearner().q.size, 0);
});

test('episode reward resets while cumulative score continues across episodes', () => {
  const model = new DinoLearner();
  assert.equal(model.snapshot().totalReward, 0);
  assert.equal(model.snapshot().score, 0);
  let total = 0;
  while (model.episodes === 0) {
    total += model.step().reward;
    assert.equal(model.snapshot().totalReward, total);
  }
  assert.equal(model.snapshot().totalReward, model.history.at(-1).reward);
  assert.equal(model.history.at(-1).steps, model.state.steps);
  const nextAction = model.step();
  assert.equal(model.state.steps, 1);
  assert.equal(model.snapshot().totalReward, nextAction.reward);
  assert.equal(model.snapshot().score, total + nextAction.reward);
  model.resetEpisode();
  assert.equal(model.snapshot().totalReward, 0);
  assert.equal(model.snapshot().score, total + nextAction.reward);
});
