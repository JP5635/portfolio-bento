# Header dinosaur asset

## Goal reward

`public/media/dino-meat-goal.png` is a generated transparent PNG used as the
goal reward. It is a compact bone-in meat pixel sprite with brick-red meat,
an ivory bone and a near-black outline. The source image was background-extracted
with the built-in image generator and is rendered at 24 × 24 CSS pixels.

## Current version — angular T-Rex walk

- Active assets: `public/media/dino-walk-a.png`, `public/media/dino-walk-pass-a.png`, `public/media/dino-walk-b.png`, and `public/media/dino-walk-pass-b.png`.
- Generated with the built-in image generation tool from the user-provided pixel T-Rex reference.
- The 40px rendered silhouette uses a large white square eye, an open rectangular mouth with a separate lower jaw, an angular head, a small arm and a complete tapered tail.
- Four frames preserve the body position while cycling through stride, passing, opposite stride and opposite passing poses. CSS cross-cuts the transparent PNGs every 100ms with a stepped animation.
- Generated originals are preserved in the Codex generated-images directory; the website copies are not post-processed.

Generation prompt summary:

```text
Create a tightly cropped, transparent pixel-art T-Rex for a web header game based on the supplied reference. Use a solid near-black angular silhouette, a clearly visible white square eye, an open rectangular mouth and lower jaw, a full tapered tail, and two separated legs. Generate the two stride poses, then edit only the legs to add the two intermediate passing poses: one support leg beneath the hip while the other foot lifts behind or forward. Keep the head, torso, arm and tail fixed; hard pixel edges; no background, shadow, outline, text or scenery.
```

## Previous version — Chromium T-Rex

- Asset retained: `public/media/chromium-offline-sprite.png`, unmodified Chromium atlas, no longer rendered.
- Source: https://github.com/chromium/chromium/blob/3f33c7c0fb6866f45d503b1ab6ec83fc86103425/components/neterror/resources/images/default_100_percent/offline/100-offline-sprite.png
- License: `public/media/chromium-LICENSE.txt` (Chromium BSD license).

## Previous version — four-step cute walk

- Archived asset: `public/media/header-dino-walk-v2.png` (2172 × 724, verified PNG alpha).
- Generated using the built-in image generation tool. Original two-frame asset is retained below for provenance, not rendered.
- Four horizontal 543 × 724 cells: stride, passing, opposite stride, opposite passing. Both legs are charcoal. Larger eye, pink cheek and a compact body make the character friendlier.
- The generated sheet is 3:1, not the requested 4:1. CSS uses its actual cell dimensions, displaying each at 32 × 42.67px with transparent vertical padding clipped into a 28px lane.
- Four frames run over 560ms. Direction flipping is isolated on the outer wrapper; stepping pauses on click, hidden tabs and reduced motion.

Generation prompt:

```text
Generate a game-ready pixel-art sprite sheet PNG WITH A TRUE TRANSPARENT ALPHA CHANNEL. No checkerboard or white background. Canvas 4:1 wide, EXACTLY FOUR equal square cells in ONE horizontal row. Four animation frames of the SAME cute baby T-rex facing right. Dark charcoal flat fill for entire dinosaur including BOTH LEGS (absolutely NO gray leg), large rounded-square head, friendly big white eye with black pupil, tiny pink cheek pixel, chubby little belly, small arms, short tail. Simple crisp pixel grid like classic handheld game, no shading texture gradients. WALK CYCLE frame1 left leg extends right/forward and right leg extends left/back; frame2 legs pass under hips, swinging foot lifted slightly; frame3 right leg extends right/forward and left leg extends left/back; frame4 opposite passing pose. Genuine horizontal alternating stride, exactly two feet, NOT identical poses. Identical head, torso, tail, overall size, pixel registration and baseline across all cells. Only legs change. Each character centered within cell and fills 80% width and 65% height. Entire figures visible. Transparent background true alpha, no ground shadows text labels grid borders or decorative elements.
```

## Original version

- Created 2026-09-09 with the built-in image_gen tool (one generation, no CLI/API fallback).
- Saved asset: `public/media/header-dino-walk.png` (1774 × 887, PNG alpha).
- Two square cells, right-facing dinosaur in both. Original PNG preserved. CSS crops transparent vertical padding, steps between the two leg poses, and flips the image at the ends of the header.
- 28px header lane is separated from links/text. Click or keyboard activation toggles pause. Tab visibility and reduced-motion preferences pause movement; observers/listeners/animations are cleaned up on unmount.
- The generated art has slight tonal texture and a subtle stride rather than an exact 1-bit sprite. No photographed subject or external brand asset is used.

## Final generation prompt

```text
Use case: stylized-concept
Asset type: transparent PNG two-frame walking dinosaur sprite sheet for a tiny 28px-high mascot above a minimalist portfolio header.
Primary request: Create ONE landscape 2:1 sprite sheet with EXACTLY TWO equal square animation cells side by side, one dinosaur in each cell, no visible cell borders.
Scene/backdrop: genuinely transparent background with PNG alpha, fully transparent empty space, no painted checkerboard or solid backdrop.
Subject: the same original small charcoal-black side-profile T-rex facing RIGHT in BOTH frames, with a simple white square eye, blocky rectangular head, tiny arms, thick body, long tapering stepped tail extending left, two short legs.
Style/medium: simple 1-bit chunky pixel art, roughly a 24x24 native pixel grid per dinosaur; solid charcoal #202020 silhouette and one white square eye; crisp hard square pixel edges, nearest-neighbor enlarged appearance, no antialiasing.
Composition/framing: left half is frame 1 and right half is frame 2. Each dinosaur fills about 85 percent of its square cell. Identical head, body, arms, tail, eye placement and scale relative to its own cell in both frames. Identical baseline, no body bob or horizontal displacement. Leave modest even transparent padding. Entire dinosaur and tail visible in both cells.
Animation: Frame 1 on the LEFT has left leg forward and right leg back. Frame 2 on the RIGHT has the opposite leg positions: left leg back and right leg forward. Only the legs change. Make the leg silhouettes visibly different so alternating the two cells reads as walking.
Constraints: exactly two frames and exactly two depictions of the same dinosaur. No text, labels, numbers, shadows, ground, platforms, motion lines, gradients, shading, texture, antialiasing, decorative elements, extra characters, border, watermark, or logos. Preserve actual transparency.
```
