#!/usr/bin/env node
// Собирает markdown-заметки к релизу из git log между двумя ref'ами.
//
//   node scripts/release-notes.mjs --from v2.4 --to HEAD --repo allakin/Monium-Chart-Generator
//
// Коммиты в этом репозитории пишутся свободным русским текстом, без conventional
// commits, поэтому группировка — эвристика по глаголу в начале темы. Она может
// ошибиться в разделе, но никогда не теряет коммит: последняя группа ловит всё
// остальное.

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SEP = '\u001f';

// Порядок важен: тема проверяется сверху вниз, первое совпадение выигрывает.
// «Новое» идёт раньше «Исправлений», чтобы "Добавил X и поправил Y" попал в
// новое; «Документация» раньше «Изменений», чтобы "Обновил README" не утёк в
// общий список правок.
export const GROUPS = [
  { title: 'Новое', test: /(добавил|добавлен|added?\b|new\b)/i },
  // В истории встречается "Иcправил" с латинской c — отсюда класс [сc].
  { title: 'Исправления', test: /(и[сc]прав|поправ|фикс|[бb]аг|fix|issue)/i },
  { title: 'Документация', test: /(readme|changelog|style_guide|merge_guide|гайд|документ|wiki)/i },
  { title: 'Изменения', test: /(обновил|обновлен|измен|удал|remove|update)/i },
  { title: 'Прочее', test: /./ },
];

export function classify(subject) {
  return (GROUPS.find((g) => g.test.test(subject)) ?? GROUPS[GROUPS.length - 1]).title;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Голые ссылки на issue занимают половину строки и мешают читать список —
// сворачиваем их в короткое #N, GitHub отрендерит его ссылкой сам.
export function linkify(subject, repo) {
  return subject
    .replace(new RegExp(`https?://github\\.com/${escapeRe(repo)}/issues/(\\d+)`, 'gi'), '#$1')
    .trim();
}

export function renderNotes({ commits, merges = [], repo, from }) {
  if (commits.length === 0 && merges.length === 0) {
    return from
      ? `Изменений с ${from} нет.`
      : 'Изменений нет.';
  }

  const buckets = new Map(GROUPS.map((g) => [g.title, []]));
  for (const c of commits) {
    buckets.get(classify(c.subject)).push(c);
  }

  const blocks = [];
  for (const { title } of GROUPS) {
    const items = buckets.get(title);
    if (items.length === 0) continue;

    // Одинаковые темы ("Обновил код" ×4) сворачиваем в одну строку со счётчиком,
    // иначе заметки к крупному релизу читать невозможно.
    const bySubject = new Map();
    for (const c of items) {
      const key = linkify(c.subject, repo);
      if (!bySubject.has(key)) bySubject.set(key, []);
      bySubject.get(key).push(c.sha.slice(0, 7));
    }

    const lines = [...bySubject].map(([subject, shas]) =>
      shas.length === 1 ? `- ${subject} (${shas[0]})` : `- ${subject} (×${shas.length})`,
    );
    blocks.push(`### ${title}\n${lines.join('\n')}`);
  }

  const prs = merges
    .map((m) => /Merge pull request #(\d+)/.exec(m.subject)?.[1])
    .filter(Boolean)
    .map((n) => `#${n}`);
  if (prs.length > 0) {
    blocks.push(`Pull request'ы: ${[...new Set(prs)].join(', ')}`);
  }

  return blocks.join('\n\n');
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' });
}

function readLog(range, extra) {
  const out = git('log', `--format=%H${SEP}%s`, ...extra, range).trim();
  if (!out) return [];
  return out.split('\n').map((line) => {
    const [sha, subject] = line.split(SEP);
    return { sha, subject };
  });
}

function main(argv) {
  const arg = (name, fallback) => {
    const i = argv.indexOf(`--${name}`);
    return i === -1 ? fallback : argv[i + 1];
  };

  const from = arg('from');
  const to = arg('to', 'HEAD');
  const repo = arg('repo', process.env.GITHUB_REPOSITORY || 'allakin/Monium-Chart-Generator');
  const range = from ? `${from}..${to}` : to;

  process.stdout.write(
    renderNotes({
      commits: readLog(range, ['--no-merges']),
      merges: readLog(range, ['--merges']),
      repo,
      from,
    }) + '\n',
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
