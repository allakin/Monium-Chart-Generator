#!/usr/bin/env node
// Проставляет версию во все места, где она видна пользователю.
//
//   node scripts/bump-version.mjs 2.5          # записать
//   node scripts/bump-version.mjs --check 2.5  # проверить, ничего не меняя
//   node scripts/bump-version.mjs --current    # напечатать текущую версию
//
// Версия плагинов живёт не в manifest.json — в схеме манифеста Figma поля
// version нет, а поведение Figma на неизвестных ключах не документировано, так
// что добавлять его рискованно. Единственное место, где версию видно из
// плагина, — футер UI; он же продублирован в стайлгайде.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const TARGETS = [
  'Monium all charts generator/ui.html',
  'Chart Line/ui.html',
  'Chart Area/ui.html',
  'Chart Bar/ui.html',
  'Chart Pie/ui.html',
  'CHART_STYLE_GUIDE.md',
];

const PATTERN = /Monium Design System v(\d+\.\d+(?:\.\d+)?)/g;

export function normalize(version) {
  const v = String(version).trim().replace(/^v/i, '');
  if (!/^\d+\.\d+(\.\d+)?$/.test(v)) {
    throw new Error(`Версия "${version}" не похожа на X.Y или X.Y.Z`);
  }
  return v;
}

export function findVersions(text) {
  return [...text.matchAll(PATTERN)].map((m) => m[1]);
}

export function stamp(text, version) {
  return text.replace(PATTERN, `Monium Design System v${version}`);
}

function readTarget(file) {
  return readFileSync(join(ROOT, file), 'utf8');
}

function main(argv) {
  if (argv.includes('--current')) {
    const found = new Set(TARGETS.flatMap((f) => findVersions(readTarget(f))));
    if (found.size !== 1) {
      throw new Error(`Версии в файлах разъехались: ${[...found].join(', ') || 'не найдено ни одной'}`);
    }
    process.stdout.write([...found][0] + '\n');
    return;
  }

  const check = argv.includes('--check');
  const version = normalize(argv.filter((a) => !a.startsWith('--'))[0]);

  const problems = [];
  const writes = [];

  for (const file of TARGETS) {
    const text = readTarget(file);
    const found = findVersions(text);

    // Ноль совпадений значит, что футер переименовали или файл переехал, —
    // молча пропустить такое нельзя, иначе релиз уедет с чужой версией.
    if (found.length === 0) {
      problems.push(`${file}: строка "Monium Design System vX.Y" не найдена`);
      continue;
    }
    if (check) {
      const wrong = found.filter((f) => f !== version);
      if (wrong.length > 0) problems.push(`${file}: ${wrong.join(', ')} вместо ${version}`);
      continue;
    }
    writes.push([file, stamp(text, version), found.length]);
  }

  if (problems.length > 0) {
    throw new Error(`Версия не совпадает:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  }

  for (const [file, text, count] of writes) {
    writeFileSync(join(ROOT, file), text);
    process.stdout.write(`  ${file} — ${count} шт. → v${version}\n`);
  }
  if (check) process.stdout.write(`Все файлы на v${version}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  }
}
