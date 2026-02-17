# Muscle Map Optimisation – Attempt Log

Date range: Feb 2026

This document records the attempts to speed up `MuscleMap` rendering, what was tried, what failed, and why.

## Context
- Screen: `WorkoutHistoryScreen`
- Symptom: initial list render delayed by ~1s even when only 5 items load
- Root cause isolated: `MuscleMap` rendering
- Requirement: multiple maps on screen (up to ~6), highlights per item are static (do not change once rendered)

### Primary Code Paths
- `WorkoutHistoryScreen` usage: `/Users/peter/Projects/Gymwork/src/components/WorkoutHistoryScreen/index.tsx`
- `MuscleMap` component: `/Users/peter/Projects/Gymwork/src/components/shared/MuscleMap.tsx`

---

## Code Snapshot (Current State)
Current code is reverted to the original `SvgCss`/XML approach.

**Files**
- `/Users/peter/Projects/Gymwork/src/components/shared/MuscleMap.tsx`

**Key structure (simplified)**
```tsx
<SvgCss xml={`${svgStart}${styleTag}${back ? svgRestBack : svgRestFront}`} />
```

---

## Attempt 1 – React Native SVG + XML (Baseline)
**Approach**
- `SvgCss` renders an SVG string with inline `<style>`.
- Active muscles set via CSS classes.

**Code (baseline)**
- `MuscleMap` XML path strings and `SvgCss`: `/Users/peter/Projects/Gymwork/src/components/shared/MuscleMap.tsx`

**Why it’s slow**
- XML parsing and CSS evaluation at runtime.
- Re-renders require re‑building strings and re‑parsing.
- Parsing + tessellation happens on JS/bridge for each map.

**Result**
- Too slow. ~1s initial render delay.

---

## Attempt 2 – Cache XML Strings (still SvgCss)
**Approach**
- Cache `xmlWithCSS` strings by key (side + colors + active classes).

**Code (previous attempt)**
- Cached XML keyed by class set in `/Users/peter/Projects/Gymwork/src/components/shared/MuscleMap copy.tsx` (later removed).

**Why it didn’t fix it**
- Parsing still happens per render even if the string is cached.
- The expensive part is XML parsing/tessellation, not string concatenation.

**Result**
- No meaningful improvement.

---

## Attempt 3 – PNG Base + SVG Highlight Paths
**Approach**
- Pre‑render base body to PNG.
- Overlay highlighted muscles using SVG paths.

**Code (previous attempt)**
- Base image + SVG overlay in `/Users/peter/Projects/Gymwork/src/components/shared/MuscleMap.tsx` (later reverted).

**Why it didn’t fix it**
- SVG path parsing/drawing still expensive.
- Only removed base render cost, not highlight path cost.

**Result**
- Still slow.

---

## Attempt 4 – PNG Base + Per‑muscle PNG Masks
**Approach**
- Pre‑render each muscle group as a PNG mask.
- Stack multiple `Image` layers (one per active muscle).

**Code (previous attempt)**
- Mask assets mapping: `/Users/peter/Projects/Gymwork/src/components/shared/muscleMapMaskAssets.ts` (later removed)
- PNG masks: `/Users/peter/Projects/Gymwork/assets/images/muscle_map_masks/` (later removed)

**Why it didn’t fix it**
- Too many `Image` layers per item (dozens). Each layer adds decode/layout/draw overhead.
- Even small PNGs still require many draw calls.

**Result**
- Still slow; sometimes worse.

---

## Attempt 5 – Precompose Masks into One Overlay (ViewShot)
**Approach**
- Render hidden stack of masks, capture once to a PNG via `react-native-view-shot`.
- Cache overlay by muscle set and reuse.

**Code (previous attempt)**
- Overlay capture logic inside `/Users/peter/Projects/Gymwork/src/components/shared/MuscleMap.tsx` (later reverted).

**Why it didn’t fix it**
- First render still pays the cost of stacking + capture.
- Capture occurs after interaction; initial render still delayed.
- Added complexity without consistent win.

**Result**
- Not reliable; still slow.

---

## Attempt 6 – Skia (Canvas + PNG masks)
**Approach**
- Use Skia `Canvas` and draw base + mask images.

**Code (previous attempt)**
- Skia Canvas rendering inside `/Users/peter/Projects/Gymwork/src/components/shared/MuscleMap.tsx` (later reverted).
- Skia dependency added in `/Users/peter/Projects/Gymwork/package.json`.

**Why it didn’t fix it**
- Many layers still → many draw calls.
- Alignment issues due to aspect mismatch.
- Requires native rebuild; frequent failures.

**Result**
- Slower in practice + misalignment.

---

## Attempt 7 – Skia (SVG + paths)
**Approach**
- Convert SVG strings into Skia `Path` objects.
- Cache paths and render via `Canvas`.

**Code (previous attempt)**
- Skia path conversion in `/Users/peter/Projects/Gymwork/src/components/shared/MuscleMap.tsx` (later reverted).
- Extracted paths file: `/Users/peter/Projects/Gymwork/src/components/shared/muscleMapPaths.ts` (later removed).

**Why it didn’t fix it**
- Path creation + draw cost still high.
- Misalignment from scaling.

**Result**
- Slower + visually wrong.

---

## Attempt 8 – Component‑only SVG (aborted)
**Approach**
- No XML parsing.
- Pre‑extract paths into data (`muscleMapData.ts`).
- Render 3 paths:
  1) Base body
  2) All muscles as inactive path
  3) Active muscles as one combined path

**Code (aborted)**
- Component: `/Users/peter/Projects/Gymwork/src/components/shared/MuscleMap.tsx` (now reverted)
- Data: `/Users/peter/Projects/Gymwork/src/components/shared/muscleMapData.ts` (removed)

**Why it should have helped**
- Avoids XML parsing entirely.
- Keeps draw calls small (3 paths total).

**Status**
- Aborted and reverted due to continued slowness.

---

## Root Causes (Why it’s slow)
1. XML parsing cost (`SvgCss`).
2. High draw call count (multiple paths/layers per map).
3. Multiple maps on screen multiplies work.
4. RN layout + image decode overhead when many layers are stacked.

---

## What actually reduces cost (in order of impact)
1. Reduce draw calls per map to a constant (1–3 max).
2. Avoid XML parsing entirely.
3. Precompute overlays (per workout or per category) so highlights become a single bitmap.

---

## Recommended Next Steps (if revisited)
1. Either keep `SvgCss` but **defer maps until after list mount** (InteractionManager/deferred rendering).
2. Or **precompute per‑workout overlay bitmap** and render only 2 images (base + overlay).
3. Optional: limit highlight categories (arms/legs/core/full/etc.) for a small overlay set.
