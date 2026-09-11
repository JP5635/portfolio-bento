import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ACTIONS,
  ALPHA,
  CELLS,
  DinoLearner,
  GAMMA,
  MAX_STEPS,
  VISION,
} from '../components/dino-learning';
import HeaderDino from '../components/HeaderDino';
import './DinoQPost.css';

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function signed(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
}

function buildBenchmark() {
  const learner = new DinoLearner(null, 12345);
  while (learner.episodes < 500) learner.step(true);
  const learned = learner.evaluate(false, 80);
  const random = learner.evaluate(true, 80);
  const snapshot = learner.snapshot();
  return { learned, random, states: snapshot.states, updates: snapshot.updates, epsilon: snapshot.epsilon };
}

const rewardRows = [
  ['Forward', '−0.02 action cost', 'No direction hint', '−0.02'],
  ['Turn', '−0.08 action cost', 'No direction hint', '−0.08'],
  ['Jump', '−0.12 action cost', 'No direction hint', '−0.12'],
  ['Collision', '−3.00 additional penalty', 'Ends the episode', 'Strong negative signal'],
  ['Goal', '+5.00 bonus', 'Ends the episode', 'Strong positive signal'],
];

const interfaceRows = [
  ['Ep.', 'Completed episodes. A new random layout starts after success, collision or the step limit.'],
  ['Score', 'Cumulative reward across episodes; unlike episode reward, it does not reset each round.'],
  ['Q [F · T · J]', 'The three learned action values for the state the dinosaur currently observes.'],
  ['Learning', 'Uses an ε-greedy policy and updates the Q-table after every action.'],
  ['Forward / Turn / Jump', 'The action selected at the latest step.'],
  ['Reward', 'Immediate feedback from the latest action, not the cumulative score.'],
  ['Vision', 'Three cells ahead classified as clear, obstacle, wall or goal.'],
];

export default function DinoQPost() {
  const benchmark = useMemo(() => buildBenchmark(), []);

  return <main className="dino-article">
    <Link className="explorer-back dino-article-back" to="/">← Back to work</Link>
    <article>
      <header className="dino-article-hero">
        <p className="dino-article-eyebrow">Interactive note · Reinforcement learning</p>
        <h1>Teaching a Pixel Dinosaur with Q-learning</h1>
        <p className="dino-article-dek">A deliberately small agent learns when to move, turn and jump. It sees only three cells ahead, receives a number after every action, and gradually replaces trial-and-error with a reusable policy.</p>
        <div className="dino-article-facts" aria-label="Environment summary">
          <span><strong>{CELLS}</strong> cells</span>
          <span><strong>{VISION}</strong>-cell vision</span>
          <span><strong>{ACTIONS.length}</strong> actions</span>
          <span><strong>{MAX_STEPS}</strong>-step limit</span>
        </div>
      </header>

      <section className="dino-article-live" aria-labelledby="live-lab-title">
        <div className="dino-article-live-heading">
          <div><p className="dino-article-kicker">Live learning lab</p><h2 id="live-lab-title">Watch every decision update the model.</h2></div>
          <p>Use +500 to train quickly, switch to Policy mode, then compare the learned agent with random actions.</p>
        </div>
        <HeaderDino active detailed />
      </section>

      <section className="dino-article-section">
        <p className="dino-article-kicker">The idea</p>
        <h2>Learn the value of an action in a situation.</h2>
        <p>Q-learning stores one number for every state–action pair. A larger number means the action has led to better long-term outcomes from similar observations. The dinosaur does not receive a route or a rule such as “jump at triangles.” It discovers that behaviour by repeatedly acting and updating those numbers.</p>
        <div className="dino-equation" aria-label="Q-learning update equation">
          <span>Q(s, a)</span><b>←</b><span>Q(s, a) + α [r + γ max Q(s′, ·) − Q(s, a)]</span>
        </div>
        <dl className="dino-symbols">
          <div><dt>α = {ALPHA}</dt><dd>Learning rate: how strongly one new result changes an old estimate.</dd></div>
          <div><dt>γ = {GAMMA}</dt><dd>Discount: how much the agent values rewards that arrive later.</dd></div>
          <div><dt>ε</dt><dd>Exploration rate: starts at 0.60, decays with updates and never falls below 0.05.</dd></div>
        </dl>
      </section>

      <section className="dino-article-section">
        <p className="dino-article-kicker">State and action</p>
        <h2>What the dinosaur knows and what it does not.</h2>
        <div className="dino-two-col">
          <div className="dino-note-card">
            <h3>Observation</h3>
            <p>Only the next three cells are observed. Each is described as <code>clear</code>, <code>obstacle</code>, <code>wall</code> or <code>goal</code>. The goal direction is not provided.</p>
            <code className="dino-state-example">clear, obstacle, clear</code>
          </div>
          <div className="dino-note-card">
            <h3>Actions</h3>
            <p><strong>Forward</strong> moves one cell. <strong>Turn</strong> reverses direction. <strong>Jump</strong> lands two cells ahead and can clear one intermediate obstacle.</p>
            <code className="dino-state-example">Q [F +0.18 · T −0.04 · J +0.47]</code>
          </div>
        </div>
        <p className="dino-article-aside">Absolute position, goal direction and the full obstacle map are hidden. The agent must search one side, turn at a wall when necessary and continue until the goal enters its local vision.</p>
      </section>

      <section className="dino-article-section">
        <p className="dino-article-kicker">One learning step</p>
        <h2>Observe → choose → act → reward → update.</h2>
        <ol className="dino-process">
          <li><span>01</span><div><strong>Observe</strong><p>Encode only the three cells in front.</p></div></li>
          <li><span>02</span><div><strong>Choose</strong><p>Usually take the highest-Q action; sometimes explore a random one.</p></div></li>
          <li><span>03</span><div><strong>Act</strong><p>Move, turn or jump in the 24-cell environment.</p></div></li>
          <li><span>04</span><div><strong>Reward</strong><p>Combine action cost, collision and goal signals without revealing direction.</p></div></li>
          <li><span>05</span><div><strong>Update</strong><p>Move the chosen Q-value toward the Bellman target.</p></div></li>
        </ol>
      </section>

      <section className="dino-article-section">
        <p className="dino-article-kicker">Reward design</p>
        <h2>Useful moves still pay a small search cost.</h2>
        <p>The number is the immediate reward for one action. Forward, turn and jump have small costs, but moving closer to an unseen goal earns no directional bonus. The agent receives a large positive signal only when it reaches the meat and a large negative signal when it collides.</p>
        <div className="dino-table-wrap">
          <table className="dino-article-table">
            <thead><tr><th>Event</th><th>Base signal</th><th>Adjustment</th><th>Typical result</th></tr></thead>
            <tbody>{rewardRows.map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="dino-article-section">
        <p className="dino-article-kicker">Reading the interface</p>
        <h2>The numbers describe different time scales.</h2>
        <div className="dino-definition-list">
          {interfaceRows.map(([term, description]) => <div key={term}><strong>{term}</strong><p>{description}</p></div>)}
        </div>
      </section>

      <section className="dino-article-section">
        <p className="dino-article-kicker">Reproducible check</p>
        <h2>Learned policy versus random actions.</h2>
        <p>The figures below are computed in the page from a seeded 500-episode training run. Evaluation uses a separate random stream, runs 80 episodes per policy and never updates the Q-table.</p>
        <div className="dino-benchmark">
          <div><span>Learned success</span><strong>{percent(benchmark.learned.success)}</strong></div>
          <div><span>Random success</span><strong>{percent(benchmark.random.success)}</strong></div>
          <div><span>Learned reward / episode</span><strong>{signed(benchmark.learned.reward)}</strong></div>
          <div><span>Random reward / episode</span><strong>{signed(benchmark.random.reward)}</strong></div>
          <div><span>Learned collisions / episode</span><strong>{benchmark.learned.collisions.toFixed(2)}</strong></div>
          <div><span>Random collisions / episode</span><strong>{benchmark.random.collisions.toFixed(2)}</strong></div>
        </div>
        <p className="dino-benchmark-meta">Training produced {benchmark.updates.toLocaleString()} updates across {benchmark.states} observed states; ε ended at {benchmark.epsilon.toFixed(2)}.</p>
      </section>

      <section className="dino-article-section">
        <p className="dino-article-kicker">What to notice</p>
        <h2>Useful insights and the limits of the demo.</h2>
        <div className="dino-insights">
          <article><span>01</span><h3>Q-values are local.</h3><p>The three values describe the current observation, not overall model quality. They change when the dinosaur faces a different situation.</p></article>
          <article><span>02</span><h3>Exploration must fade, not vanish.</h3><p>Decay shifts behaviour toward the learned policy; the 0.05 floor keeps testing alternatives that might reveal a better response.</p></article>
          <article><span>03</span><h3>Reward design shapes behaviour.</h3><p>Large terminal signals teach safety and completion. Small action costs discourage spinning or jumping forever.</p></article>
          <article><span>04</span><h3>Compression creates ambiguity.</h3><p>Local vision generalises well, but two globally different layouts can look identical. More memory would resolve cases this table cannot.</p></article>
        </div>
      </section>
    </article>
  </main>;
}
