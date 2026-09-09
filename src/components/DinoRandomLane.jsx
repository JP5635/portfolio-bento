import { CELLS, VISION } from './dino-learning';

const percent = number => `${Math.round(number * 100)}%`;

export default function DinoRandomLane({ view, width, evaluation, paused }) {
  if (!view) return <div className="header-dino-lane header-dino-lane--random"><span className="dino-random-label">Random baseline</span></div>;
  const state = view.state;
  const stride = Math.max(0, width - 42) / (CELLS - 1);
  const episode = Math.max(1, view.episodes + (view.last?.terminal || view.last?.truncated ? 0 : 1));
  const lookingFrom = Math.max(0, Math.min(CELLS - 1, state.position + state.direction));
  const lookingTo = Math.max(0, Math.min(CELLS - 1, state.position + state.direction * VISION));
  const walking = !paused && view.last?.action !== 1 && !view.last?.collision;
  const jumping = walking && view.last?.action === 2;
  const score = view.score || 0;
  const newEpisode = view.last?.before?.steps === 0;

  return <div className="header-dino-lane header-dino-lane--random" data-sleeping={!walking} data-collision={view.last?.collision || false}>
    <span className="dino-episode">Ep. {episode}</span>
    <span className="dino-live-label">Random baseline</span>
    <span className="dino-q-values" title="Each random action has an equal probability">P [F .33 · T .33 · J .33]</span>
    <span className="dino-score">Score {score >= 0 ? '+' : ''}{score.toFixed(2)}</span>
    {evaluation && <span className="dino-random-evaluation">80 runs · Learned {percent(evaluation.learned.success)} · Random {percent(evaluation.random.success)}</span>}
    <span className="dino-ground" aria-hidden="true" />
    <span className="dino-vision" aria-hidden="true" style={{ left: Math.min(lookingFrom, lookingTo) * stride + 10, width: Math.abs(lookingTo - lookingFrom) * stride + 22 }} />
    {view.obstacles.map(cell => <span key={cell} className="dino-obstacle" aria-hidden="true" style={{ left: cell * stride + 15 }} />)}
    <span className="dino-goal" aria-hidden="true" style={{ left: state.goal * stride + 9 }}><img src={`${import.meta.env.BASE_URL}media/dino-meat-goal.png`} alt="" /></span>
    <span className="header-dino dino-random-runner" style={{ transform: `translateX(${state.position * stride}px)`, transition: newEpisode || paused ? 'none' : undefined }} aria-hidden="true">
      <span key={`${view.episodes}-${state.steps}`} className={jumping ? 'dino-hop is-jumping' : 'dino-hop'}>
        <span className="dino-random-name">RANDOM</span>
        <span className="header-dino-sprite" style={{ transform: `scaleX(${state.direction})` }}>
          <span className="header-dino-frames">
            <img className="header-dino-frame frame-1" src={`${import.meta.env.BASE_URL}media/dino-walk-a.png`} alt="" />
            <img className="header-dino-frame frame-2" src={`${import.meta.env.BASE_URL}media/dino-walk-pass-a.png`} alt="" />
            <img className="header-dino-frame frame-3" src={`${import.meta.env.BASE_URL}media/dino-walk-b.png`} alt="" />
            <img className="header-dino-frame frame-4" src={`${import.meta.env.BASE_URL}media/dino-walk-pass-b.png`} alt="" />
          </span>
        </span>
      </span>
    </span>
  </div>;
}
