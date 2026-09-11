import { ACTIONS, ALPHA, GAMMA } from './dino-learning';

const value = number => `${number >= 0 ? '+' : ''}${number.toFixed(2)}`;
const rate = number => `${Math.round(number * 100)}%`;

function Metric({ label, children }) {
  return <div className="dino-metric"><dt>{label}</dt><dd>{children}</dd></div>;
}

export default function DinoTelemetry({ view, learning, batch }) {
  if (!view) return <div className="dino-telemetry" aria-live="polite">Preparing learning data…</div>;

  const history = view.history || [];
  const recent = history.slice(-5).reverse();
  const successes = history.filter(item => item.success);
  const successRate = history.length ? successes.length / history.length : 0;
  const collisionRate = history.length ? history.filter(item => item.collisions > 0).length / history.length : 0;
  const averageReward = history.length ? history.reduce((sum, item) => sum + item.reward, 0) / history.length : 0;
  const averageSteps = successes.length ? successes.reduce((sum, item) => sum + item.steps, 0) / successes.length : null;
  const state = view.state;
  const action = view.last ? ACTIONS[view.last.action] : 'Ready';
  const decision = !learning ? 'Policy' : view.last?.exploratory ? 'Exploration' : 'Exploitation';
  const goalDirection = state.position === state.goal ? 'Reached' : state.goal > state.position ? 'Right' : 'Left';
  const mode = batch ? 'Training' : learning ? 'Learning' : 'Policy';

  return <div className="dino-telemetry" aria-label="Live Q-learning telemetry">
    <section className="dino-telemetry-card">
      <h3>Learning state</h3>
      <dl>
        <Metric label="Episode">{Math.max(1, view.episodes + (view.last?.terminal || view.last?.truncated ? 0 : 1))}</Metric>
        <Metric label="Current step">{state.steps} / 100</Metric>
        <Metric label="Mode">{mode}</Metric>
        <Metric label="Current action">{action}</Metric>
        <Metric label="Decision">{decision}</Metric>
      </dl>
    </section>

    <section className="dino-telemetry-card">
      <h3>Reward</h3>
      <dl>
        <Metric label="Current reward">{value(view.last?.reward || 0)}</Metric>
        <Metric label="Episode reward">{value(view.totalReward)}</Metric>
        <Metric label="Cumulative score">{value(view.score)}</Metric>
        <Metric label="Average reward">{history.length ? value(averageReward) : 'No completed episodes'}</Metric>
      </dl>
    </section>

    <section className="dino-telemetry-card">
      <h3>Q-learning</h3>
      <dl>
        <Metric label="Learning rate α">{ALPHA.toFixed(2)}</Metric>
        <Metric label="Discount factor γ">{GAMMA.toFixed(2)}</Metric>
        <Metric label="Exploration rate ε">{view.epsilon.toFixed(3)}</Metric>
        <Metric label="Q · Forward">{value(view.q[0])}</Metric>
        <Metric label="Q · Turn">{value(view.q[1])}</Metric>
        <Metric label="Q · Jump">{value(view.q[2])}</Metric>
        <Metric label="Q-table updates">{view.updates.toLocaleString()}</Metric>
        <Metric label="Learned states">{view.states}</Metric>
      </dl>
    </section>

    <section className="dino-telemetry-card">
      <h3>Environment</h3>
      <dl>
        <Metric label="Position">Cell {state.position}</Metric>
        <Metric label="Direction">{state.direction > 0 ? 'Right' : 'Left'}</Metric>
        <Metric label="Vision · next 3">{view.vision.join(' · ')}</Metric>
        <Metric label="Obstacles">{view.obstacles.length ? view.obstacles.join(', ') : 'None'}</Metric>
        <Metric label="Goal · hidden from agent">{goalDirection}</Metric>
        <Metric label="Collision">{view.last?.collision ? `Yes · ${view.last.collisionType}` : 'No'}</Metric>
      </dl>
    </section>

    <section className="dino-telemetry-card dino-telemetry-performance">
      <h3>Performance <small>recent {history.length} episodes</small></h3>
      <div className="dino-performance-grid">
        <dl>
          <Metric label="Success rate">{history.length ? rate(successRate) : '—'}</Metric>
          <Metric label="Collision rate">{history.length ? rate(collisionRate) : '—'}</Metric>
          <Metric label="Average completion">{averageSteps === null ? '—' : `${averageSteps.toFixed(1)} steps`}</Metric>
        </dl>
        <div className="dino-recent">
          <span>Recent episodes</span>
          <div>{recent.length ? recent.map(item => <span className={item.success ? 'is-success' : 'is-failure'} key={item.episode} title={`Episode ${item.episode}: ${value(item.reward)}, ${item.steps} steps`}>
            {item.success ? '✓' : '×'} {item.episode}
          </span>) : <em>Complete an episode to build history.</em>}</div>
        </div>
      </div>
    </section>
  </div>;
}
