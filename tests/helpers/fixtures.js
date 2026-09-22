'use strict';

/**
 * Canonical inputs shared by the suites.
 *
 * Payloads mirror exactly what ui.html posts on "generate", including the
 * clamping the UI applies before sending (counts 1..20, opacity 0.05..1,
 * innerRadius 30..80, cornerRadius 0..50, segmentGap 0..10). `chartType` is
 * always present: the combined plugin dispatches on it, the standalone
 * plugins ignore it.
 */

/** Frame sizes worth rendering into, from poster-size down to icon-size. */
const SIZES = [
  { name: '1200x800 huge', w: 1200, h: 800 },
  { name: '600x400 default', w: 600, h: 400 },
  { name: '500x500 pie default', w: 500, h: 500 },
  { name: '400x300 small', w: 400, h: 300 },
  { name: '320x180 card', w: 320, h: 180 },
  { name: '233x95 reported', w: 233, h: 95 },
  { name: '160x60 tiny', w: 160, h: 60 },
  { name: '120x40 tiny', w: 120, h: 40 },
  { name: '90x90 tiny square', w: 90, h: 90 },
  { name: '60x24 sparkline', w: 60, h: 24 },
  { name: '40x40 micro', w: 40, h: 40 },
  { name: '20x20 nano', w: 20, h: 20 },
];

const X_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const Y_VALUES = [0, 50, 100, 150, 200];

const BASE = {
  line: {
    yValues: Y_VALUES,
    yLabels: null,
    yUnit: '',
    xLabels: X_LABELS,
    linesCount: 3,
    lineStyle: 'smooth',
    showLegend: false,
    legendLabels: [],
    legendAlign: 'left',
    topEvent: false,
    bottomEvent: false,
    replace: false,
  },
  area: {
    yValues: Y_VALUES,
    yLabels: null,
    yUnit: '',
    xLabels: X_LABELS,
    areasCount: 3,
    areaStyle: 'smooth',
    areaMode: 'overlap',
    fillHeight: false,
    fillOpacity: 0.3,
    showLegend: false,
    legendLabels: [],
    legendAlign: 'left',
    topEvent: false,
    bottomEvent: false,
    replace: false,
  },
  bar: {
    yValues: Y_VALUES,
    yLabels: null,
    yUnit: '',
    xLabels: X_LABELS,
    barsCount: 3,
    orientation: 'vertical',
    barMode: 'normal',
    dense: false,
    barGap: 1,
    fillOpacity: 1,
    showLegend: false,
    legendLabels: [],
    legendAlign: 'left',
    topEvent: false,
    bottomEvent: false,
    replace: false,
  },
  pie: {
    values: [30, 25, 20, 15, 10],
    segmentsCount: 5,
    pieStyle: 'donut',
    innerRadiusPct: 55,
    cornerRadius: 0,
    segmentGap: 1,
    showLabels: false,
    showTotal: false,
    fillOpacity: 1,
    showLegend: false,
    legendLabels: [],
    legendAlign: 'left',
    replace: false,
  },
};

function payload(type, overrides) {
  return Object.assign({ chartType: type }, BASE[type], overrides || {});
}

/** Layer names each chart type always writes. */
const REQUIRED_LAYERS = {
  line: ['Grid', 'Y Labels', 'X Labels', 'Lines'],
  area: ['Grid', 'Y Labels', 'X Labels', 'Areas'],
  bar: ['Grid', 'Y Labels', 'X Labels', 'Bars'],
  pie: ['Slices'],
};

/** chartParams keys the paste path relies on, per chart type. */
const REQUIRED_PARAMS = {
  line: [
    'yValues', 'yUnit', 'yLabels', 'xLabels', 'linesCount', 'lineStyle',
    'topEvent', 'bottomEvent', 'showLegend', 'legendAlign', 'legendLabels',
    'allSeries', 'colors',
  ],
  area: [
    'yValues', 'yUnit', 'yLabels', 'xLabels', 'areasCount', 'areaStyle',
    'areaMode', 'fillHeight', 'fillOpacity', 'topEvent', 'bottomEvent',
    'showLegend', 'legendAlign', 'legendLabels', 'allSeries', 'colors',
  ],
  bar: [
    'yValues', 'yUnit', 'yLabels', 'xLabels', 'barsCount', 'orientation',
    'barMode', 'dense', 'barGap', 'fillOpacity', 'topEvent', 'bottomEvent',
    'showLegend', 'legendAlign', 'legendLabels', 'allSeries', 'colors',
  ],
  pie: [
    'values', 'segmentsCount', 'pieStyle', 'innerRadiusPct', 'cornerRadius',
    'segmentGap', 'showLabels', 'showTotal', 'fillOpacity', 'showLegend',
    'legendAlign', 'legendLabels', 'colors',
  ],
};

const LINE_STYLES = ['smooth', 'sharp', 'peak'];
const AREA_STYLES = ['smooth', 'sharp', 'peak'];
const AREA_MODES = ['overlap', 'stacked'];
const BAR_MODES = ['normal', 'grouped', 'stacked'];
const ORIENTATIONS = ['vertical', 'horizontal'];
const PIE_STYLES = ['pie', 'donut'];
const LEGEND_ALIGNS = ['left', 'center', 'right'];

/** Y axis inputs the UI accepts: plain, unit-suffixed, clock times, signed. */
const Y_AXIS_CASES = [
  { name: 'plain integers', labels: ['0', '50', '100', '150', '200'] },
  { name: 'decimals', labels: ['0.5', '1.5', '2.5'] },
  { name: 'comma decimals', labels: ['0,5', '1,5', '2,5'] },
  { name: 'ms unit', labels: ['0ms', '150ms', '300ms'] },
  { name: 'percent unit', labels: ['0%', '50%', '100%'] },
  { name: 'clock mm:ss', labels: ['0:00', '1:30', '3:00'] },
  { name: 'clock h:mm:ss', labels: ['0:00:00', '1:02:30', '2:00:00'] },
  { name: 'negatives', labels: ['-100', '-50', '0', '50'] },
  { name: 'currency prefix', labels: ['$0', '$500', '$1000'] },
  { name: 'large numbers', labels: ['0', '500000', '1000000'] },
];

/** Long/odd legend label sets: truncation, padding, pagination. */
const LEGEND_CASES = [
  { name: 'none', labels: [] },
  { name: 'fewer than series', labels: ['Only one'] },
  { name: 'exact', labels: ['Alpha', 'Beta', 'Gamma'] },
  { name: 'more than series', labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
  {
    name: 'very long single',
    labels: ['An extremely long legend label that cannot possibly fit into the chart width'],
  },
  { name: 'unicode', labels: ['Выручка', '利益', 'Ünïcödé'] },
];

module.exports = {
  SIZES,
  X_LABELS,
  Y_VALUES,
  BASE,
  payload,
  REQUIRED_LAYERS,
  REQUIRED_PARAMS,
  LINE_STYLES,
  AREA_STYLES,
  AREA_MODES,
  BAR_MODES,
  ORIENTATIONS,
  PIE_STYLES,
  LEGEND_ALIGNS,
  Y_AXIS_CASES,
  LEGEND_CASES,
};
