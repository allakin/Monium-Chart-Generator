// Тесты релизных скриптов из scripts/. Проверяют две вещи: что бамп версии не
// разъезжается по семи файлам и что заметки к релизу не теряют коммиты.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

// Скрипты — ESM, тесты — CJS, поэтому грузим через динамический import.
const load = (file) => import(require('node:url').pathToFileURL(path.join(ROOT, 'scripts', file)).href);

test('bump-version: все места с версией согласованы между собой', async () => {
  const { TARGETS, findVersions } = await load('bump-version.mjs');

  const versions = new Map();
  for (const file of TARGETS) {
    const found = findVersions(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    assert.ok(found.length > 0, `${file}: строка "Monium Design System vX.Y" не найдена`);
    versions.set(file, [...new Set(found)]);
  }

  const distinct = new Set([...versions.values()].flat());
  assert.strictEqual(
    distinct.size,
    1,
    `версия разъехалась: ${[...versions].map(([f, v]) => `${f}=${v.join('/')}`).join(', ')}`,
  );
});

test('bump-version: normalize принимает X.Y и vX.Y и отбрасывает мусор', async () => {
  const { normalize } = await load('bump-version.mjs');

  assert.strictEqual(normalize('2.5'), '2.5');
  assert.strictEqual(normalize('v2.5'), '2.5');
  assert.strictEqual(normalize(' V2.5.1 '), '2.5.1');
  assert.throws(() => normalize('2'), /не похожа/);
  assert.throws(() => normalize('latest'), /не похожа/);
});

test('bump-version: stamp меняет все вхождения и не трогает соседний текст', async () => {
  const { stamp } = await load('bump-version.mjs');

  const before = '<div class="footer">Monium Design System v2.4</div>\nMonium Design System v2.4 — plain text';
  const after = stamp(before, '3.0');

  assert.strictEqual(after.match(/Monium Design System v3\.0/g).length, 2);
  assert.ok(!after.includes('v2.4'));
  assert.ok(after.includes('<div class="footer">'), 'разметка вокруг версии должна остаться целой');
});

test('release-notes: классификация тем по группам', async () => {
  const { classify } = await load('release-notes.mjs');

  assert.strictEqual(classify('Добавил лоадер на блок буфера'), 'Новое');
  assert.strictEqual(classify('Поправил багу'), 'Исправления');
  // В истории есть "Иcправил" с латинской c — это не должно уезжать в «Прочее».
  assert.strictEqual(classify('Иcправил readme.md'), 'Исправления');
  assert.strictEqual(classify('Обновил CHART_STYLE_GUIDE.md'), 'Документация');
  assert.strictEqual(classify('Обновил плагины'), 'Изменения');
  assert.strictEqual(classify('Initial commit'), 'Прочее');
});

test('release-notes: ссылка на issue сворачивается в #N', async () => {
  const { linkify } = await load('release-notes.mjs');
  const repo = 'allakin/Monium-Chart-Generator';

  assert.strictEqual(
    linkify('Исправил багу https://github.com/allakin/Monium-Chart-Generator/issues/8', repo),
    'Исправил багу #8',
  );
  // Чужой репозиторий сворачивать нельзя — ссылка должна остаться ссылкой.
  assert.ok(linkify('Багу https://github.com/other/repo/issues/8', repo).includes('https://'));
});

test('release-notes: ни один коммит не теряется, дубли сворачиваются', async () => {
  const { renderNotes } = await load('release-notes.mjs');

  const notes = renderNotes({
    repo: 'allakin/Monium-Chart-Generator',
    from: 'v2.4',
    commits: [
      { sha: 'aaaaaaa1', subject: 'Добавил новый чарт' },
      { sha: 'bbbbbbb2', subject: 'Обновил код' },
      { sha: 'ccccccc3', subject: 'Обновил код' },
      { sha: 'ddddddd4', subject: 'Странная тема без глагола' },
    ],
    merges: [{ sha: 'eeeeeee5', subject: 'Merge pull request #14 from allakin/develop-temp' }],
  });

  assert.ok(notes.includes('- Добавил новый чарт (aaaaaaa)'));
  assert.ok(notes.includes('- Обновил код (×2)'), 'одинаковые темы должны сворачиваться со счётчиком');
  assert.ok(notes.includes('Странная тема без глагола'), 'непонятная тема должна попасть в «Прочее»');
  assert.ok(notes.includes("Pull request'ы: #14"));
});

test('release-notes: пустой диапазон даёт понятный текст, а не пустоту', async () => {
  const { renderNotes } = await load('release-notes.mjs');

  assert.strictEqual(
    renderNotes({ commits: [], merges: [], repo: 'a/b', from: 'v2.4' }),
    'Изменений с v2.4 нет.',
  );
});

test('changelog-prepend: секция встаёт после маркера, история сохраняется', async () => {
  const { prepend, MARKER } = await load('changelog-prepend.mjs');

  const result = prepend(`# Changelog\n\nинтро\n\n${MARKER}\n\n## v2.4 — 2026-09-22\n\nстарое\n`, {
    version: 'v2.5',
    date: '2026-09-28',
    notes: '### Новое\n- Что-то полезное (abc1234)',
  });

  assert.ok(result.indexOf('## v2.5 — 2026-09-28') < result.indexOf('## v2.4'), 'новая версия должна быть выше старой');
  assert.ok(result.includes('старое'), 'прошлые секции должны остаться');
  assert.ok(result.includes(MARKER), 'маркер нужен для следующего релиза');
});

test('changelog-prepend: без маркера падает, а не портит файл', async () => {
  const { prepend } = await load('changelog-prepend.mjs');

  assert.throws(
    () => prepend('# Changelog\n\nбез маркера\n', { version: 'v2.5', date: '2026-09-28', notes: 'x' }),
    /маркера/,
  );
});

test('CHANGELOG.md: маркер на месте и последняя версия совпадает с футерами', async () => {
  const { MARKER } = await load('changelog-prepend.mjs');
  const { findVersions, TARGETS } = await load('bump-version.mjs');

  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  assert.ok(changelog.includes(MARKER), 'без маркера воркфлоу релиза упадёт');

  const topVersion = /^## v(\d+\.\d+(?:\.\d+)?)/m.exec(changelog)?.[1];
  const uiVersion = findVersions(fs.readFileSync(path.join(ROOT, TARGETS[0]), 'utf8'))[0];
  assert.strictEqual(topVersion, uiVersion, 'верхняя секция CHANGELOG должна совпадать с версией в футере');
});
