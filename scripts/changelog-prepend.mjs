#!/usr/bin/env node
// Вставляет новую секцию релиза в CHANGELOG.md сразу после маркера.
//
//   node scripts/changelog-prepend.mjs v2.5 /tmp/notes.md
//
// Вставка идёт по явному маркеру, а не «после первого заголовка», чтобы правка
// интро в начале файла не сдвигала точку вставки.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const MARKER = '<!-- new-release-here -->';

export function prepend(changelog, { version, date, notes }) {
  if (!changelog.includes(MARKER)) {
    throw new Error(`В CHANGELOG.md нет маркера ${MARKER} — непонятно, куда вставлять релиз`);
  }
  const section = `## ${version} — ${date}\n\n${notes.trim()}`;
  return changelog.replace(MARKER, `${MARKER}\n\n${section}`);
}

function main([version, notesFile]) {
  if (!version || !notesFile) {
    throw new Error('Использование: changelog-prepend.mjs <version> <notes-file>');
  }
  const path = join(ROOT, 'CHANGELOG.md');
  writeFileSync(
    path,
    prepend(readFileSync(path, 'utf8'), {
      version: version.startsWith('v') ? version : `v${version}`,
      date: new Date().toISOString().slice(0, 10),
      notes: readFileSync(notesFile, 'utf8'),
    }),
  );
  process.stdout.write(`CHANGELOG.md — добавлена секция ${version}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  }
}
