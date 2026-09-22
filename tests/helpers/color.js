'use strict';

/**
 * Perceptual color math for the palette tests.
 *
 * This is deliberately an independent implementation of the same maths the
 * plugins carry: if the test reused the plugin's own paletteDistance it would
 * only prove the function agrees with itself. Written straight from the
 * published formulae instead.
 *
 * Distances are OKLab ΔE × 100, the unit the thresholds below are quoted in:
 *   - 15 — the floor for normal vision. Below it two neighbouring series are
 *     hard to tell apart even for a full-colour reader.
 *   - 8  — the target under simulated colour blindness.
 */

/** Series colors that touch must clear this under normal vision. */
const ADJACENT_FLOOR = 15;
/** ...and this under protanopia and deuteranopia. */
const ADJACENT_CVD_FLOOR = 8;

function srgbChannelToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function cubeRoot(x) {
  return x < 0 ? -Math.pow(-x, 1 / 3) : Math.pow(x, 1 / 3);
}

/** Machado, Oliveira & Fernandes 2009, severity 1.0, applied in linear RGB. */
const VISION_MODELS = {
  normal: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  protanopia: [
    0.152286, 1.052583, -0.204868,
    0.114503, 0.786281, 0.099216,
    -0.003882, -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968,
    0.280085, 0.672501, 0.047413,
    -0.01182, 0.04294, 0.968881,
  ],
};

/** A Figma `{ r, g, b }` color, as one vision model sees it, in OKLab. */
function oklab(color, model = 'normal') {
  const m = VISION_MODELS[model];
  assertKnownModel(model);
  const r = srgbChannelToLinear(color.r);
  const g = srgbChannelToLinear(color.g);
  const b = srgbChannelToLinear(color.b);
  const lr = m[0] * r + m[1] * g + m[2] * b;
  const lg = m[3] * r + m[4] * g + m[5] * b;
  const lb = m[6] * r + m[7] * g + m[8] * b;
  const l = cubeRoot(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const mm = cubeRoot(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = cubeRoot(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * mm - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s,
  ];
}

function assertKnownModel(model) {
  if (!VISION_MODELS[model]) throw new Error('unknown vision model: ' + model);
}

/** OKLab ΔE × 100 between two Figma colors under one vision model. */
function deltaE(a, b, model = 'normal') {
  const [l1, a1, b1] = oklab(a, model);
  const [l2, a2, b2] = oklab(b, model);
  return 100 * Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

/** The smallest gap across normal vision, protanopia and deuteranopia. */
function deltaEWorstVision(a, b) {
  return Math.min(
    deltaE(a, b, 'normal'),
    deltaE(a, b, 'protanopia'),
    deltaE(a, b, 'deuteranopia'),
  );
}

/**
 * The tightest pair of *neighbouring* colors in a series list.
 *
 * Neighbours are the pairs a reader actually compares — touching pie slices,
 * stacked bar segments, adjacent legend rows — so this, not the all-pairs
 * minimum, is the gate the plugins are held to. (No palette of eight colors
 * can be pairwise-distinct at this floor; neighbouring ones can.)
 */
function tightestNeighbours(colors, model) {
  let worst = { deltaE: Infinity, at: -1 };
  for (let i = 0; i + 1 < colors.length; i++) {
    const d = model ? deltaE(colors[i], colors[i + 1], model)
      : deltaEWorstVision(colors[i], colors[i + 1]);
    if (d < worst.deltaE) worst = { deltaE: d, at: i };
  }
  return worst;
}

/** WCAG relative luminance, for contrast against the chart surface. */
function relativeLuminance(color) {
  const r = srgbChannelToLinear(color.r);
  const g = srgbChannelToLinear(color.g);
  const b = srgbChannelToLinear(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function hex(color) {
  return (
    '#' +
    [color.r, color.g, color.b]
      .map((v) => Math.round(v * 255).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

module.exports = {
  ADJACENT_FLOOR,
  ADJACENT_CVD_FLOOR,
  oklab,
  deltaE,
  deltaEWorstVision,
  tightestNeighbours,
  relativeLuminance,
  contrastRatio,
  hex,
};
