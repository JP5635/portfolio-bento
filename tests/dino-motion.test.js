import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { DINO_SIZE, patrolSettings } from '../src/components/dino-motion.js';

test('custom T-Rex uses four alpha frames for a complete walking cycle', () => {
  const jsx = readFileSync(new URL('../src/components/HeaderDino.jsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/components/HeaderDino.css', import.meta.url), 'utf8');
  for (const name of ['dino-walk-a.png', 'dino-walk-pass-a.png', 'dino-walk-b.png', 'dino-walk-pass-b.png']) {
    const image = readFileSync(new URL(`../public/media/${name}`, import.meta.url));
    assert.equal(image.toString('ascii', 1, 4), 'PNG');
    assert.ok(image.readUInt32BE(16) > 1000);
    assert.ok(image.readUInt32BE(20) > 1000);
    assert.equal(image[25], 6, `${name} must be an RGBA PNG`);
    assert.match(jsx, new RegExp(`media/${name.replace('.', '\\.')}`));
  }
  assert.doesNotMatch(jsx, /chromium-offline-sprite/);
  for (const frame of [1, 2, 3, 4]) assert.match(css, new RegExp(`\\.header-dino-frame\\.frame-${frame}`));
  assert.match(css, /animation-duration: \.4s/);
  assert.match(css, /steps\(1, end\)/);
});

test('arena obstacles are plain black triangles rather than cactus sprites', () => {
  const jsx = readFileSync(new URL('../src/components/HeaderDino.jsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/components/HeaderDino.css', import.meta.url), 'utf8');
  assert.doesNotMatch(jsx, /dino-obstacle[^\n]+backgroundImage/);
  assert.match(css, /\.dino-obstacle[\s\S]*background: #111;/);
  assert.match(css, /clip-path: polygon\(50% 0, 100% 100%, 0 100%\)/);
});

test('the goal uses the generated meat image rather than an emoji or green finish line', () => {
  const jsx = readFileSync(new URL('../src/components/HeaderDino.jsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/components/HeaderDino.css', import.meta.url), 'utf8');
  assert.match(jsx, /media\/dino-meat-goal\.png/);
  assert.doesNotMatch(jsx, /🍖/);
  assert.doesNotMatch(css, /\.dino-goal[^\n]+background: #5e9275/);
  assert.equal(existsSync(new URL('../public/media/dino-meat-goal.png', import.meta.url)), true);
});

test('learning arena stays in document flow while the search toolbar remains fixed', () => {
  const arenaCss = readFileSync(new URL('../src/components/DinoLearningPanel.css', import.meta.url), 'utf8');
  const pageCss = readFileSync(new URL('../src/pages/PortfolioExplorer.css', import.meta.url), 'utf8');
  assert.match(arenaCss, /\.dino-learning-space\s*\{[\s\S]*?position: relative;/);
  assert.doesNotMatch(arenaCss, /\.dino-learning-space\s*\{[\s\S]*?position: fixed;/);
  assert.match(pageCss, /\.explorer-toolbar\s*\{\s*position: fixed;/);
});

test('arena reserves enough vertical room for the dinosaur jump', () => {
  const arenaCss = readFileSync(new URL('../src/components/HeaderDino.css', import.meta.url), 'utf8');
  const pageCss = readFileSync(new URL('../src/pages/PortfolioExplorer.css', import.meta.url), 'utf8');
  assert.match(arenaCss, /\.header-dino-lane[^\n]+height: 100px;/);
  assert.match(arenaCss, /\.header-dino-sprite[^\n]+overflow: visible;/);
  assert.match(arenaCss, /\.header-dino-frames[^\n]+height: 40px;/);
  assert.match(pageCss, /--ex-learning-height: 140px;/);
});

test('arena shows the current Q-table row instead of implementation parameters', () => {
  const jsx = readFileSync(new URL('../src/components/HeaderDino.jsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/components/HeaderDino.css', import.meta.url), 'utf8');
  assert.doesNotMatch(jsx, /α \{ALPHA|γ \{GAMMA|ε \{epsilon|Updates \{updates/);
  assert.match(jsx, /const qValues = view\?\.q \|\| \[0, 0, 0\]/);
  assert.match(jsx, /Q \[F \{formatQ\(qValues\[0\]\)\} · T/);
  assert.match(jsx, /J \{formatQ\(qValues\[2\]\)\}\]/);
  assert.match(css, /\.dino-q-values[^\n]+white-space: nowrap;/);
});

test('current dinosaur speaks its latest action in a bounded speech bubble', () => {
  const jsx = readFileSync(new URL('../src/components/HeaderDino.jsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/components/HeaderDino.css', import.meta.url), 'utf8');
  assert.match(jsx, /actionSpeech = view\?\.last\?\.event/);
  assert.match(jsx, /dino-action-bubble/);
  assert.match(jsx, /position < 3 \? 'is-left'/);
  assert.match(css, /\.dino-action-bubble::after/);
  assert.match(css, /@keyframes dino-bubble-hop/);
});

test('a new episode renders its random initial direction before the first action', () => {
  const jsx = readFileSync(new URL('../src/components/HeaderDino.jsx', import.meta.url), 'utf8');
  assert.match(jsx, /if \(model\.finished\) \{[\s\S]*?model\.resetEpisode\(\);[\s\S]*?publish\(\);[\s\S]*?return;/);
  assert.match(jsx, /model\.resetEpisode\(\{ facingAway: true \}\)/);
  assert.match(jsx, /readyUntilRef\.current = Date\.now\(\) \+ 1000/);
});

test('learning arena links to the full Q-learning article', () => {
  const panel = readFileSync(new URL('../src/components/DinoLearningPanel.jsx', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const article = readFileSync(new URL('../src/pages/DinoQPost.jsx', import.meta.url), 'utf8');
  assert.match(panel, /to="\/writing\/dino-q-learning"/);
  assert.match(panel, />More ↗<\/Link>/);
  assert.match(app, /writing\/dino-q-learning/);
  for (const concept of ['Reward design', 'Q [F · T · J]', 'Reproducible check', 'Learned success']) assert.match(article, new RegExp(concept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('the article embeds a full live learning dashboard', () => {
  const article = readFileSync(new URL('../src/pages/DinoQPost.jsx', import.meta.url), 'utf8');
  const telemetry = readFileSync(new URL('../src/components/DinoTelemetry.jsx', import.meta.url), 'utf8');
  assert.match(article, /<HeaderDino active detailed/);
  for (const label of ['Current step', 'Episode reward', 'Cumulative score', 'Average reward', 'Q-table updates', 'Learned states', 'Vision · next 3', 'Success rate', 'Collision rate', 'Average completion', 'Recent episodes']) {
    assert.match(telemetry, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('two-track policy comparison is isolated to the detailed blog dashboard', () => {
  const header = readFileSync(new URL('../src/components/HeaderDino.jsx', import.meta.url), 'utf8');
  const race = readFileSync(new URL('../src/components/DinoRandomLane.jsx', import.meta.url), 'utf8');
  assert.match(header, /detailed && <DinoTelemetry/);
  assert.match(race, /Random baseline/);
  assert.match(header, /detailed && <DinoRandomLane/);
  assert.match(header, /Current agent/);
  assert.match(header, /randomEngineRef\.current\.step\(false\)/);
  assert.match(header, /new DinoLearner\(null, 90826\)/);
  assert.match(header, /randomTarget = randomModel \? randomModel\.episodes \+ 500/);
  assert.match(header, /while \(randomModel\.episodes < randomUntil\) randomModel\.step\(false\)/);
  assert.match(race, /view\.last\?\.action === 2/);
  assert.match(race, /dino-hop is-jumping/);
  assert.match(race, /P \[F \.33 · T \.33 · J \.33\]/);
  assert.match(race, /className="dino-vision"/);
  assert.match(race, /newEpisode \|\| paused \? 'none'/);
  assert.match(race, /dino-random-name">RANDOM/);
  for (const frame of [1, 2, 3, 4]) assert.match(race, new RegExp(`header-dino-frame frame-${frame}`));
});

test('dinosaur stays inside the header at phone and desktop widths', () => {
  for (const width of [288, 579, 887, 1888]) {
    const { distance, duration } = patrolSettings(width);
    assert.equal(distance + DINO_SIZE, width);
    assert.ok(duration >= 8000);
    assert.ok(distance / (duration / 2000) <= 45.001);
  }
});

test('collapsed and invalid widths never produce negative travel or duration', () => {
  for (const width of [0, 12, -20, NaN, Infinity]) {
    assert.deepEqual(patrolSettings(width), { distance: 0, duration: 8000 });
  }
});
