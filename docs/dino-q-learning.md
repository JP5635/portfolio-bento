# Search-area Q-learning demo

The existing Chromium sprite is now controlled by an actual tabular Q-learning
policy, not the earlier pre-programmed left/right patrol. All learning runs
locally in this tab; no server, credentials, pretrained model or analytics.

## Environment and policy

- 24 discrete cells; every episode places one to three obstacles in new seeded-random positions; the opposite edge is the goal.
- Obstacles never occupy either edge and are never adjacent, so every generated lane remains jump-solvable.
- Start at either edge with either facing direction, using a seeded RNG.
- Actions: advance one cell, turn around without moving, jump over one cell
  and land two cells ahead. Landing on an obstacle or outside the lane collides.
- Observation: only the three cells in front, plus whether facing the goal.
  Cells are clear, obstacle, goal or wall. Absolute position and complete map
  are never supplied to the policy; the simulator uses them for physics.
- The rendered lane is for the human observer only. This is a simplified
  partially observed game environment, not image recognition or a browser agent.
- Rewards: +0.1 per net cell closer to goal; costs -0.02 forward, -0.08 turn,
  -0.12 jump; -3 collision and +5 reaching goal. Retreat subtracts progress
  reward, so moving back and forth cannot farm points.
- End on collision or success; truncate/reset after 100 steps. Time-limit
  truncations bootstrap, terminal states do not.
- Q starts at zero. Update: Q(s,a) += 0.25 [r + 0.95 max Q(s',a') - Q(s,a)].
- Epsilon-greedy starts at 0.6, exponentially decays with updates to 0.05;
  equal-valued actions are randomly selected, without scripted avoidance.

## Controls and checks

The arena sits directly below the fixed search bar on collection pages and
scrolls with the content. It no longer occupies the header or a floating corner
panel. Episode and cumulative score sit in the arena corners. A single non-wrapping
status line shows pause, +500 episodes, reset, learning mode, immediate reward
and a link to the detailed article. The dinosaur reports its current action in a
speech bubble. The article embeds independent learning and random-policy tracks,
live Q values, sensor state, reward summaries and evaluation metrics.
On very narrow screens the one-line controls can scroll horizontally.

Pause / reset / 500 training episodes / frozen-policy execution remain available. Fast training runs
in chunks of 10 episodes, then automatically plays the learned policy at
epsilon zero. Hidden tabs, reduced-motion preferences and detail routes stop
automatic visible stepping. Fast training requires an explicit click and stops
if the tab is hidden or navigation leaves the collection page. The model is
retained when opening details and returning. Reset clears the Q-table, history and RNG state.

The engine's test-only evaluation uses 80 reproducible, identical start conditions for random and
current greedy policies, with separate evaluation RNGs and no Q updates.
Results describe this tiny family of generated layouts, not generalisation to other environments.
On the article page, evaluation refreshes periodically and never updates the Q-table.

Tests cover sensors, collisions, jumping in both directions, turn semantics,
terminal and truncated transitions, numeric updates, reproducibility, read-only
evaluation and improvement after 500 episodes. Run `node --test tests/*.test.js`.
