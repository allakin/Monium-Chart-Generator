# Monium Chart Generator

[![Figma plugin](https://img.shields.io/badge/Figma-plugin-F24E1E?logo=figma&logoColor=white)](#установка-в-figma)
[![Release](https://img.shields.io/github/v/release/allakin/Monium-Chart-Generator?label=release&color=1f7a1f&logo=github)](https://github.com/allakin/Monium-Chart-Generator/releases/latest)
[![All Charts tests](https://img.shields.io/github/actions/workflow/status/allakin/Monium-Chart-Generator/tests-all-charts.yml?branch=main&label=All%20Charts%20tests&logo=github)](https://github.com/allakin/Monium-Chart-Generator/actions/workflows/tests-all-charts.yml)
[![Line tests](https://img.shields.io/github/actions/workflow/status/allakin/Monium-Chart-Generator/tests-line.yml?branch=main&label=Line%20tests&logo=github)](https://github.com/allakin/Monium-Chart-Generator/actions/workflows/tests-line.yml)
[![Bar tests](https://img.shields.io/github/actions/workflow/status/allakin/Monium-Chart-Generator/tests-bar.yml?branch=main&label=Bar%20tests&logo=github)](https://github.com/allakin/Monium-Chart-Generator/actions/workflows/tests-bar.yml)
[![Area tests](https://img.shields.io/github/actions/workflow/status/allakin/Monium-Chart-Generator/tests-area.yml?branch=main&label=Area%20tests&logo=github)](https://github.com/allakin/Monium-Chart-Generator/actions/workflows/tests-area.yml)
[![Pie tests](https://img.shields.io/github/actions/workflow/status/allakin/Monium-Chart-Generator/tests-pie.yml?branch=main&label=Pie%20tests&logo=github)](https://github.com/allakin/Monium-Chart-Generator/actions/workflows/tests-pie.yml)

Набор плагинов для Figma, которые генерируют графики в стиле Monium / Yandex Cloud. Плагин рисует чарт нативными узлами Figma (векторы, прямоугольники, эллипсы с `arcData`, текст) — результат можно править руками как обычный слой, без картинок и внешних зависимостей.

📖 **Документация и гайды — в [вики репозитория](https://github.com/allakin/Monium-Chart-Generator/wiki).**

## Что внутри

| Папка | Плагин | Типы графиков |
| --- | --- | --- |
| [Monium all charts generator/](Monium%20all%20charts%20generator/) | Monium All Charts Generator | все четыре типа в одном плагине — **рекомендуется** |
| [Chart Line/](Chart%20Line/) | Chart Line Generator | линейный |
| [Chart Bar/](Chart%20Bar/) | Chart Bar Generator | столбчатый |
| [Chart Area/](Chart%20Area/) | Chart Area Generator | площадной |
| [Chart Pie/](Chart%20Pie/) | Chart Pie Generator | круговой и пончик |

Отдельные плагины и объединённый используют один и тот же код отрисовки и одну палитру — выбор зависит только от того, удобнее держать один пункт в меню Figma или четыре.

## Возможности

- **Линейный** — три стиля кривой: Smooth (монотонный кубический безье с ограничением Фритча–Карлсона, без «горбов»), Sharp, Peak.
- **Столбчатый** — вертикальная и горизонтальная ориентация; режимы Normal / Grouped / Stacked; настраиваемый зазор между столбцами; плотный режим (×10 точек).
- **Площадной** — режимы Overlap и Stacked, опция растягивания на всю высоту, регулируемая прозрачность заливки.
- **Круговой** — Pie и Donut с настройкой внутреннего радиуса и радиуса скругления, угловые зазоры между сегментами, точные значения через запятую, выноски со значениями, сумма в центре пончика.
- **Легенда** — маркеры под тип графика, свои подписи серий, выравнивание, жадная упаковка по строкам с обрезкой длинных подписей.
- **Полосы событий** — опциональные маркеры событий над и под областью графика (кроме кругового).
- **Перегенерация** — параметры графика хранятся в `pluginData`, поэтому выделенный чарт можно перегенерировать с новыми случайными данными или заменить на месте.
- **Копирование** — точная копия графика: те же данные, те же цвета, та же раскладка полос событий, вставляется в другой фрейм.
- **Палитра** — 68 цветов, серии подбираются жадным maximin-алгоритмом. Различие считается перцептивно (OKLab ΔE), а не по RGB, и с симуляцией протанопии и дейтеранопии — поэтому пара, которая сливается для дальтоника, не считается контрастной. Подобранные цвета дополнительно переставляются так, чтобы **соседние** серии — сегменты пирога, части стопки, строки легенды — были самыми различными парами: ΔE ≥ 17 при любом числе серий до 20.

## Установка в Figma

1. Откройте Figma (десктопное приложение).
2. Меню → Plugins → Development → Import plugin from manifest...
3. Выберите `manifest.json` из нужной папки, например `Monium all charts generator/manifest.json`.
4. Запустите: Меню → Plugins → Development → название плагина.

Плагины не обращаются в сеть (`networkAccess.allowedDomains: ["none"]`) и работают полностью локально.

## Как пользоваться

1. Выделите фрейм, в котором должен появиться график, — плагин подставит его размеры. Без выделения создаётся фрейм по умолчанию (600 × 400, для кругового 500 × 500).
2. Задайте параметры в окне плагина и нажмите **Generate**.
3. Чтобы изменить уже созданный график, выделите его: параметры подхватятся в форму, а кнопка сменится на **Regenerate**.

## Тесты

Автотесты гоняют настоящий `code.js` каждого плагина в Node-песочнице с моком Figma Plugin API и проверяют построенное дерево нод. Зависимостей нет, нужен только Node ≥ 20.

```bash
npm test                 # все файлы: 503 теста, ~0.5 с
npm run test:pie         # одна сьюта
npm run test:sizes       # матрица размеров фрейма
npm run test:watch       # перезапуск при правках
```

Сьюта каждого типа чарта прогоняется сразу против отдельного плагина и против соответствующей вкладки сводного генератора, поэтому расхождение двух реализаций падает ровно в одном варианте.

На GitHub эти же тесты гоняются в CI — по одному воркфлоу на плагин ([.github/workflows/](.github/workflows/)), на push в `main` и `develop` и на каждый pull request. Статус каждого — в плашках вверху; плашка `release` показывает последний релиз и меняется сама при публикации нового.

- [tests/README.md](tests/README.md) — устройство харнесса, что покрыто, приближения мока, список известных багов (тесты на них помечены `todo`, поэтому прогон остаётся зелёным) и как добавлять тесты.
- [tests/MANUAL_QA.md](tests/MANUAL_QA.md) — ручной чек-лист для того, что автотесты проверить не могут: реальная отрисовка, окно плагина, буфер обмена, шрифты, undo.

## Документация для разработки

- [CHART_STYLE_GUIDE.md](CHART_STYLE_GUIDE.md) — общий дизайн-гайд и спецификация: палитра, сетка, оси, отступы, UI-паттерны, хранение параметров, логика копирования и легенды. Это же файл-инструкция для добавления нового типа графика.
- [MERGE_GUIDE.md](MERGE_GUIDE.md) — порядок переноса изменений из отдельных плагинов в объединённый и обратно, чтобы общий код не расходился.

Каждый плагин состоит из трёх файлов: `manifest.json`, `code.js` (логика и отрисовка, Figma Plugin API), `ui.html` (интерфейс). Сборка не нужна — правите файл и перезапускаете плагин в Figma.

## Скиллы для Claude Code

В репозитории лежат два проектных скилла ([.claude/skills/](.claude/skills/)) — они подхватываются автоматически, когда проект открыт в Claude Code.

| Скилл | Что делает |
| --- | --- |
| `/plugins-chart-test-skill` | Спрашивает, какой плагин прогнать или все сразу (можно передать тип аргументом: `/plugins-chart-test-skill pie`), запускает нужные файлы тестов и разбирает результат, отделяя реальные падения от известных багов и артефактов мока. |
| `/merge-union-chart-plugin-skill` | Переносит изменения из отдельных плагинов в плагин — Monium all charts generator по [MERGE_GUIDE.md](MERGE_GUIDE.md): читает гайды, раскладывает правки по категориям, держит красные линии гайда и вызывает `/plugins-chart-test-skill` до и после мержа — для тех типов чартов, которых коснулись изменения. |
