import { Link } from 'react-router-dom';
import './DinoLearningPanel.css';

export default function DinoLearningPanel({ view, paused, learning, batch, onPause, onReset, onTrain, onMode, showArticleLink = true }) {
  const reward = view?.last?.reward || 0;
  const pauseLabel = batch ? 'Stop training' : paused ? 'Resume' : 'Pause';
  return <div className="dino-status-line" role="group" aria-label="Learning controls and status" lang="en">
    <button type="button" className="dino-status-icon" onClick={onPause} title={pauseLabel} aria-label={pauseLabel}>
      {batch || !paused ? 'Ⅱ' : '▶'}
    </button>
    <button type="button" onClick={onTrain} disabled={batch} title="Run 500 episodes, then use the learned policy" aria-label="Run 500 episodes">
      {batch ? 'Training…' : '+500'}
    </button>
    <button type="button" className="dino-status-icon" onClick={onReset} title="Reset learning" aria-label="Reset learning">↺</button>
    {learning && <button type="button" className="dino-status-mode" onClick={onMode} disabled={batch}
      title="Run the learned policy" aria-label="Run the learned policy">
      Learning
    </button>}
    <span className="dino-status-reward" title="Reward for the latest action" aria-label={`Current action reward ${reward.toFixed(2)}`}>Reward {reward >= 0 ? '+' : ''}{reward.toFixed(2)}</span>
    {showArticleLink && <Link className="dino-status-article" to="/writing/dino-q-learning" aria-label="More about how the Q-learning agent works">More ↗</Link>}
  </div>;
}
