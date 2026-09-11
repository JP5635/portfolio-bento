export const CELLS = 24;
export const ACTIONS = ['Forward', 'Turn', 'Jump'];
export const ALPHA = 0.25;
export const GAMMA = 0.95;
export const MAX_STEPS = 100;

export function seededRandom(seed = 12345) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export const OBSTACLES = [7, 16];
export const VISION = 3;
export const START_POSITION = Math.floor(CELLS / 2);

export function stateKey(state, obstacles = OBSTACLES) {
  return observe(state, obstacles).join(',');
}

export function initialState(random) {
  const goal = random() < 0.5 ? 0 : CELLS - 1;
  const direction = random() < 0.5 ? -1 : 1;
  return {
    position: START_POSITION,
    goal,
    direction,
    steps: 0,
  };
}

export function randomObstacleLayout(random, reserved = []) {
  const reservedCells = new Set(reserved);
  const target = 1 + Math.floor(random() * 3);
  const candidates = Array.from({ length: CELLS - 4 }, (_, index) => index + 2)
    .filter(cell => !reservedCells.has(cell));
  for (let index = candidates.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [candidates[index], candidates[swap]] = [candidates[swap], candidates[index]];
  }
  return candidates
    .reduce((chosen, cell) => {
      if (chosen.length < target && chosen.every(existing => Math.abs(existing - cell) > 1)) chosen.push(cell);
      return chosen;
    }, [])
    .sort((a, b) => a - b);
}

// The policy sees only three cells ahead—not its position, the complete map,
// or which direction contains the goal. The simulator knows the map for collisions.
export function observe(state, obstacles = OBSTACLES) {
  return Array.from({ length: VISION }, (_, index) => {
    const cell = state.position + state.direction * (index + 1);
    return cell < 0 || cell >= CELLS ? 'wall' : obstacles.includes(cell) ? 'obstacle' : cell === state.goal ? 'goal' : 'clear';
  });
}

export function transition(state, action, obstacles = OBSTACLES) {
  const next = { ...state, steps: state.steps + 1 };
  let reward = [-0.02, -0.08, -0.12][action];
  let collision = false;
  let collisionType = null;
  if (action === 1) next.direction *= -1;
  else {
    // Jump clears exactly one intermediate cell and lands two cells ahead.
    const candidate = next.position + next.direction * (action === 2 ? 2 : 1);
    collisionType = candidate < 0 || candidate >= CELLS ? 'wall' : obstacles.includes(candidate) ? 'obstacle' : null;
    collision = collisionType !== null;
    if (collision) reward -= 3;
    else next.position = candidate;
  }
  const complete = next.position === next.goal;
  if (complete) reward += 5;
  return { next, reward, collision, collisionType, complete, terminal: complete || collision,
    truncated: !complete && !collision && next.steps >= MAX_STEPS };
}

export function updateQ(values, action, reward, nextValues, terminal) {
  const target = reward + (terminal ? 0 : GAMMA * Math.max(...nextValues));
  return values[action] + ALPHA * (target - values[action]);
}

function selectAction(values, epsilon, random) {
  const exploratory = random() < epsilon;
  const best = Math.max(...values);
  const candidates = exploratory ? [0, 1, 2] : values.flatMap((value, index) => value === best ? [index] : []);
  const action = candidates[Math.floor(random() * candidates.length)];
  return { action, exploratory };
}

export class DinoLearner {
  constructor(obstacles = null, seed = 12345) {
    this.fixedObstacles = Array.isArray(obstacles) ? [...obstacles] : null;
    this.obstacles = [];
    this.random = seededRandom(seed);
    this.q = new Map();
    this.episodes = 0;
    this.updates = 0;
    this.score = 0;
    this.history = [];
    this.logs = [];
    this.resetEpisode();
  }

  get epsilon() { return Math.max(0.05, 0.6 * Math.exp(-this.updates / 4000)); }
  values(state, obstacles = this.obstacles) { return this.q.get(stateKey(state, obstacles)) || [0, 0, 0]; }

  resetEpisode({ facingAway = false } = {}) {
    this.last = null;
    this.state = initialState(this.random);
    if (facingAway) this.state.direction = -Math.sign(this.state.goal - this.state.position);
    this.episodeStart = { ...this.state };
    this.obstacles = this.fixedObstacles ? [...this.fixedObstacles] : randomObstacleLayout(this.random, [this.state.position, this.state.goal]);
    this.totalReward = 0;
    this.collisions = 0;
    this.finished = false;
  }

  step(learn = true) {
    if (this.finished) this.resetEpisode();
    const before = { ...this.state };
    const values = [...this.values(before)];
    const { action, exploratory } = selectAction(values, learn ? this.epsilon : 0, this.random);
    const result = transition(before, action, this.obstacles);
    const oldValue = values[action];
    // Goal/collision end the task. Time limits truncate, so bootstrap.
    if (learn) {
      values[action] = updateQ(values, action, result.reward, this.values(result.next), result.terminal);
      this.q.set(stateKey(before, this.obstacles), values);
      this.updates++;
    }
    this.state = result.next;
    this.totalReward += result.reward;
    this.score += result.reward;
    this.collisions += Number(result.collision);
    this.finished = result.terminal || result.truncated;
    const event = result.collision ? (result.collisionType === 'wall' ? 'Wall hit' : 'Obstacle hit')
      : result.complete ? 'Goal reached' : result.truncated ? 'Time limit' : ACTIONS[action];
    this.last = { action, exploratory, reward: result.reward, event, oldValue, newValue: values[action], before, learn, ...result };
    this.logs = [{ event, reward: result.reward, action, step: this.state.steps }, ...this.logs].slice(0, 4);
    if (this.finished) {
      this.episodes++;
      this.history = [...this.history, { episode: this.episodes, steps: this.state.steps, reward: this.totalReward, collisions: this.collisions, success: result.complete, learn }].slice(-60);
    }
    return this.last;
  }

  snapshot() {
    return { state: { ...this.state }, episodeStart: { ...this.episodeStart }, q: [...this.values(this.state)], epsilon: this.epsilon,
      episodes: this.episodes, updates: this.updates, totalReward: this.totalReward, score: this.score,
      collisions: this.collisions, history: [...this.history], logs: [...this.logs],
      last: this.last, obstacles: this.obstacles, states: this.q.size, vision: observe(this.state, this.obstacles) };
  }

  // Independent RNG and read-only Q access: evaluating never trains the model.
  evaluate(randomPolicy = false, episodes = 80) {
    const random = seededRandom(90826);
    const starts = seededRandom(2026);
    let collisions = 0, successes = 0, reward = 0;
    for (let episode = 0; episode < episodes; episode++) {
      let state = initialState(starts);
      const obstacles = this.fixedObstacles ? this.fixedObstacles : randomObstacleLayout(starts, [state.position, state.goal]);
      for (let i = 0; i < MAX_STEPS; i++) {
        const { action } = selectAction(this.values(state, obstacles), randomPolicy ? 1 : 0, random);
        const result = transition(state, action, obstacles);
        state = result.next;
        collisions += Number(result.collision);
        reward += result.reward;
        if (result.complete) { successes++; break; }
        if (result.collision) break;
      }
    }
    return { collisions: collisions / episodes, success: successes / episodes, reward: reward / episodes, episodes };
  }

}
