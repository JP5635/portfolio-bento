import { useCallback, useEffect, useRef, useState } from 'react';
import { CELLS, DinoLearner, VISION } from './dino-learning';
import { DINO_SIZE } from './dino-motion';
import DinoLearningPanel from './DinoLearningPanel';
import DinoTelemetry from './DinoTelemetry';
import DinoRandomLane from './DinoRandomLane';
import './HeaderDino.css';

export default function HeaderDino({ active = true, detailed = false }) {
  const laneRef = useRef(null);
  const engineRef = useRef(null);
  const randomEngineRef = useRef(null);
  const batchRef = useRef(null);
  const readyUntilRef = useRef(0);
  const controlsRef = useRef({ paused: false, learning: true, active: true });
  const [view, setView] = useState(null);
  const [width, setWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [learning, setLearning] = useState(true);
  const [batch, setBatch] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [randomView, setRandomView] = useState(null);
  const evaluatedEpisodeRef = useRef(-1);

  const publish = useCallback((forceEvaluation = false) => {
    const model = engineRef.current;
    if (!model) return;
    const snapshot = model.snapshot();
    setView(snapshot);
    if (detailed && (forceEvaluation || evaluatedEpisodeRef.current < 0 || snapshot.episodes >= evaluatedEpisodeRef.current + 5)) {
      evaluatedEpisodeRef.current = snapshot.episodes;
      setEvaluation({ learned: model.evaluate(false, 80), random: model.evaluate(true, 80) });
    }
  }, [detailed]);

  useEffect(() => { controlsRef.current = { paused, learning, active }; }, [paused, learning, active]);

  useEffect(() => {
    engineRef.current = new DinoLearner();
    randomEngineRef.current = detailed ? new DinoLearner(null, 90826) : null;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function visibility() { setSleeping(document.hidden || motion.matches); }
    function measure() { setWidth(laneRef.current?.clientWidth || 0); }
    const observer = new ResizeObserver(measure);
    observer.observe(laneRef.current);
    const start = window.setTimeout(() => {
      publish(true);
      if (randomEngineRef.current) setRandomView(randomEngineRef.current.snapshot());
      visibility();
    }, 0);
    const timer = window.setInterval(() => {
      const control = controlsRef.current;
      const model = engineRef.current;
      if (!model || control.paused || !control.active || batchRef.current !== null || document.hidden || motion.matches || Date.now() < readyUntilRef.current) return;
      if (model.finished) {
        model.resetEpisode();
        if (randomEngineRef.current?.finished) {
          randomEngineRef.current.resetEpisode();
          setRandomView(randomEngineRef.current.snapshot());
        }
        publish();
        return;
      }
      model.step(control.learning);
      if (randomEngineRef.current) {
        if (randomEngineRef.current.finished) randomEngineRef.current.resetEpisode();
        else randomEngineRef.current.step(false);
        setRandomView(randomEngineRef.current.snapshot());
      }
      publish();
    }, 350);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', visibility);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
      clearTimeout(batchRef.current);
      batchRef.current = null;
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', visibility);
      engineRef.current = null;
      randomEngineRef.current = null;
    };
  }, [publish, detailed]);
  function stopBatch() {
    clearTimeout(batchRef.current);
    batchRef.current = null;
    setBatch(false);
  }
  function togglePause() {
    if (batchRef.current !== null) { stopBatch(); setPaused(true); }
    else setPaused(value => !value);
  }
  function reset() {
    stopBatch();
    engineRef.current = new DinoLearner();
    randomEngineRef.current = detailed ? new DinoLearner(null, 90826) : null;
    evaluatedEpisodeRef.current = -1;
    setRandomView(randomEngineRef.current?.snapshot() || null);
    setLearning(true);
    setPaused(false);
    publish();
  }
  function fastTrain() {
    if (!engineRef.current || batchRef.current !== null) return;
    const model = engineRef.current;
    const randomModel = randomEngineRef.current;
    const target = model.episodes + 500;
    const randomTarget = randomModel ? randomModel.episodes + 500 : 0;
    setLearning(true);
    setPaused(true);
    setBatch(true);
    function chunk() {
      if (document.hidden || !controlsRef.current.active) { stopBatch(); publish(); return; }
      const until = Math.min(target, model.episodes + 10);
      while (model.episodes < until) model.step(true);
      if (randomModel) {
        const randomUntil = Math.min(randomTarget, randomModel.episodes + 10);
        while (randomModel.episodes < randomUntil) randomModel.step(false);
        setRandomView(randomModel.snapshot());
      }
      publish();
      if (model.episodes < target) batchRef.current = window.setTimeout(chunk, 16);
      else {
        stopBatch();
        setLearning(false);
        model.resetEpisode({ facingAway: true });
        readyUntilRef.current = Date.now() + 1000;
        if (randomModel) {
          randomModel.resetEpisode();
          setRandomView(randomModel.snapshot());
        }
        publish(true);
        setPaused(false);
      }
    }
    batchRef.current = window.setTimeout(chunk, 0);
  }

  const state = view?.state;
  const stride = Math.max(0, width - DINO_SIZE) / (CELLS - 1);
  const position = state?.position || 0;
  const direction = state?.direction || 1;
  const lookingFrom = Math.max(0, Math.min(CELLS - 1, position + direction));
  const lookingTo = Math.max(0, Math.min(CELLS - 1, position + direction * VISION));
  const walking = !paused && !sleeping && !batch && active && view?.last?.action !== 1 && !view?.last?.collision;
  const jumping = walking && view?.last?.action === 2;
  const score = view?.score ?? 0;
  const qValues = view?.q || [0, 0, 0];
  const actionSpeech = view?.last?.event || 'Ready';
  const bubbleEdge = position < 3 ? 'is-left' : position > CELLS - 4 ? 'is-right' : '';
  const formatQ = value => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
  const episode = Math.max(1, (view?.episodes || 0) + (view?.last?.terminal || view?.last?.truncated ? 0 : 1));

  return <section className={`dino-learning-space${detailed ? ' dino-learning-space--detailed' : ''}`} aria-label="Dinosaur Q-learning arena" hidden={!active}>
    <div className="header-dino-lane" ref={laneRef} data-sleeping={!walking} data-collision={view?.last?.collision || false}>
      <div className="dino-ground" aria-hidden="true" />
      <span className="dino-episode" aria-label={`Episode ${episode}`}>Ep. {episode}</span>
      {detailed && <span className="dino-live-label">Current agent</span>}
      <span className="dino-score" title="Cumulative reward across all episodes" aria-label={`Cumulative reward ${score.toFixed(2)}`}>
        Score {score >= 0 ? '+' : ''}{score.toFixed(2)}
      </span>
      <span className="dino-q-values" title="Q-values for Forward, Turn and Jump in the dinosaur's current observed state"
        aria-label={`Current Q-values: Forward ${qValues[0].toFixed(2)}, Turn ${qValues[1].toFixed(2)}, Jump ${qValues[2].toFixed(2)}`}>
        Q [F {formatQ(qValues[0])} · T {formatQ(qValues[1])} · J {formatQ(qValues[2])}]
      </span>
      <div className="dino-vision" aria-hidden="true" style={{ left: Math.min(lookingFrom, lookingTo) * stride + 10, width: Math.abs(lookingTo - lookingFrom) * stride + 22 }} />
      {view?.obstacles.map(cell => <span key={cell} className="dino-obstacle" aria-hidden="true" style={{ left: cell * stride + 15 }} />)}
      {state && <span className="dino-goal" aria-hidden="true" style={{ left: state.goal * stride + 9 }}>
        <img src={`${import.meta.env.BASE_URL}media/dino-meat-goal.png`} alt="" draggable="false" />
      </span>}
      <button className="header-dino" type="button" aria-label={paused ? "Resume dinosaur learning" : "Pause dinosaur learning"} onClick={togglePause}
        style={{ transform: `translateX(${position * stride}px)`, transition: batch || paused || sleeping || view?.last?.before.steps === 0 ? 'none' : undefined }}>
        <span className={`dino-bubble-anchor ${bubbleEdge}`} aria-hidden="true">
          <span key={`${view?.episodes}-${state?.steps}-${actionSpeech}`} className={`dino-action-bubble${jumping ? ' is-jumping' : ''}`}>{actionSpeech}</span>
        </span>
        <span className="header-dino-sprite" aria-hidden="true" style={{ transform: `scaleX(${direction})` }}>
          <span key={`${view?.episodes}-${state?.steps}`} className={jumping ? 'dino-hop is-jumping' : 'dino-hop'}>
            <span className="header-dino-frames">
              <img className="header-dino-frame frame-1" src={`${import.meta.env.BASE_URL}media/dino-walk-a.png`} alt="" draggable="false" />
              <img className="header-dino-frame frame-2" src={`${import.meta.env.BASE_URL}media/dino-walk-pass-a.png`} alt="" draggable="false" />
              <img className="header-dino-frame frame-3" src={`${import.meta.env.BASE_URL}media/dino-walk-b.png`} alt="" draggable="false" />
              <img className="header-dino-frame frame-4" src={`${import.meta.env.BASE_URL}media/dino-walk-pass-b.png`} alt="" draggable="false" />
            </span>
          </span>
        </span>
      </button>
    </div>
    {detailed && <DinoRandomLane view={randomView} width={width} evaluation={evaluation} paused={paused || sleeping || batch} />}
    <DinoLearningPanel view={view} paused={paused || sleeping} learning={learning} batch={batch}
      onPause={togglePause} onReset={reset} onTrain={fastTrain}
      showArticleLink={!detailed}
      onMode={() => { stopBatch(); setLearning(value => !value); engineRef.current?.resetEpisode(); publish(true); }} />
    {detailed && <DinoTelemetry view={view} learning={learning} batch={batch} />}
  </section>;
}
