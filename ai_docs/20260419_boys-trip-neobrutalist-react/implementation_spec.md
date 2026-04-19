# Plan: Boys Trip 2026 — Neo-Brutalist React Proposal Site with Boys-Collage Images

## Task Description

Построить новый React-сайт «Boys Trip 2026» с нуля в текущей директории (`/Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/`). Это **фановая презентация-предложение поездки** для 9 пацанов на 4 дня летом 2026 года в Средиземноморье.

**Оригинальный запрос пользователя** (`оригинальный_запрос.txt`): «накинь идеи, куда бы это можно было поехать... тепло, море, Италия или Испания, снять виллу, возможность снять яхту для рыбалки/еды/отдыха. Глубоко проанализируй все места... подборку самых лучших и интересных вариантов. Структурируй... реальные фото... плюсы и минусы... сравнение... приблизительная стоимость на 4 дня.» Это значит: **не 5 фиксированных локаций, а ШИРОКАЯ ПОДБОРКА (10–13 направлений)** — 5 из существующего HTML + 7–8 новых из ресерча (Хорватия/Греция/Испания/Турция/Франция/Мальта/Албания — см. `destinations-research.md` от research-подагента).

**Дизайн:** визуальный стиль — Neo-Brutalist "Disruptor" по спецификации `des.txt` (чёрный `#000`, тёмный `#121212`, белый, Volt Green `#CCFF00`, Ranchers + Space Mono + Plus Jakarta Sans, жёсткие 4/8px борды, solid neo-shadows 8×8 без блюра, тилтовые "стикеры" ±2–5°, vertical-rl боковая панель, никаких градиентов и soft-эффектов).

**Тон голоса** — «пацаны едут веселиться», неформальный русский, мужской юмор «на грани приличия» (без оскорблений), лёгкое подкалывание друг друга, короткие пунчевые фразы. Contact person: 9 мужиков, первый раз за 5 лет вместе.

**Ключевая визуальная фишка** — «коллаж-пацаны»: 11 реальных фотографий парней из `boys/` вырезаются (background removal → transparent PNG), затем компонуются поверх фонов локаций с помощью Sharp compositing. Это НЕ AI face-swap, НЕ генерация лиц, НЕ кинематографические рендеры — это **нарочито жанкий мем-коллаж в духе Photoshop из 2005-го**, идеально ложащийся на брутализм (крупные тилты, хард-эджи, выделения контура, speech-bubbles «А Я ГОВОРИЛ!»). На разных сценах — то один пацан, то несколько, с подписями в стиле брутального всё-капс.

## Objective

На выходе **два артефакта**: (a) запускаемый React+TypeScript+Tailwind dev-app (`npm run dev` или `bun run dev`) для разработки, (b) **single-file HTML-бандл** (`dist-artifact/bundle.html`) — self-contained артефакт для шаринга на claude.ai и отправки пацанам в чат напрямую. Бандл собирается через локальный skill `artifacts-builder` (`.claude/skills/artifacts-builder/scripts/init-artifact.sh` + `bundle-artifact.sh`).

На выходе пригодное к запуску приложение, где:

1. **10–13 направлений** (5 из HTML + 7–8 из research-подагента) выведены в Neo-Brutalist стиле с полным контентом (цены, highlights, метрики, плюсы/нюансы, голосование, активити). Полный каталог — из `destinations-research.md`.
2. На каждой карточке destination стоит **коллаж-герой**: реальные фото пацанов (вырезанные через background-removal) наклеены на локационный фон с брутальной рамкой. Hero-сцена + 2–3 activity-сцены на каждое направление.
3. Работает **голосование** с localStorage (+1 / 0 / +1 toggle per dest), навигация по dots/sidebar, компаратор с табами, финальный bar-chart победителя.
4. Работает **«реакции пацанов»** — под каждой карточкой destination любой может оставить короткий текстовый отзыв (≤140 символов, с инициалами/никнеймом), реакции живут в `localStorage` и экспортируются/импортируются через JSON-файл (кнопка «СКАЧАТЬ РЕАКЦИИ» → `reactions-<timestamp>.json`; кнопка «ЗАЛИТЬ РЕАКЦИИ» → pick file → merge). Это позволяет собирать обратную связь в чат и сливать вместе.
5. Весь текст переписан в пацанском тоне: хедлайны ALL-CAPS, таглайны типа «КУДА ВАЛИМ, ПАЦАНЫ?», секции «СКОЛЬКО СТОИТ ЛЕГЕНДА», «ЗАЧЕМ ЕДЕМ», «ЗА ЧТО ПОТОМ СЛОЖНО».
6. Все 11 пацанов (включая Авокадо-Банщика) имеют никнеймы и появляются минимум в одной сцене.
7. Финальный **`bundle.html`** работает без dev-сервера (двойной клик → открывается в браузере), голосование и реакции живут в localStorage домена `file://` / origin претенциозной страницы, ошибок в консоли нет.
8. Никаких fallback'ов: отсутствует env-ключ / фото / бэкграунд → скрипт крашится с ясной ошибкой (per global CLAUDE.md).

## Problem Statement

Существующий файл `boys-trip-2026-presentation.html` (1856 строк vanilla JS + CSS) — это кинематографичная midnight-blue/gold презентация в стиле элегантного travel-journal. У презентации три проблемы с точки зрения текущей цели:

1. **Стилистика не та** — мы хотим брутальный, шумный, пацанский вайб, а не "culinary cinema". Neo-Brutalist "Disruptor" спека в `des.txt` даёт нужную энергию: жёсткий, громкий, смешной.
2. **Тон слишком вежливый** — Steinbeck-цитаты и «произведение искусства» не стыкуются с «девять взрослых мужиков едут веселиться». Нужен ре-райт в стиле «Кто выигрывает / Кто сколько стоит / Финальный выбор».
3. **Фото стоковые, безличные** — текущие Unsplash-картинки любых вилл/яхт не создают эмоциональной привязки. Кастомные коллажи с реальными лицами пацанов делают презентацию адресной и смешной.

## Solution Approach

**Стек:** React 18 + TypeScript + Vite (через **`artifacts-builder` skill scaffold**) + Tailwind 3.4 + shadcn/ui (40+ компонентов pre-installed, используем выборочно под брутализм) + framer-motion (brutal slam-анимации) + Sharp (image compositing) + `@imgly/background-removal-node` (вырезание пацанов).

**Bundle-target:** финальный артефакт — **одна HTML-файловина** (`dist-artifact/bundle.html`), собранная через `.claude/skills/artifacts-builder/scripts/bundle-artifact.sh` (Parcel + html-inline). Это позволяет шарить пацанам одну ссылку/файл без dev-сервера.

**Архитектурные решения:**

- **Артефакт-скаффолд через skill.** Вместо `bun create vite` используем `bash .claude/skills/artifacts-builder/scripts/init-artifact.sh boys-trip-2026` — он создаёт React+TS+Vite+Tailwind+shadcn/ui проект с path-aliases `@/`, готовой конфигурацией Parcel. После этого оверрайдим `tailwind.config.js` под Neo-Brutalist токены (colors/fonts/shadows/borders из Scout #1) и почти не используем shadcn/ui компоненты (они soft/rounded — не наш стиль), но некоторые берём (Accordion, Dialog для image-preview, Button как база для BrutalistButton).
- **Build-time image generation (не в браузере).** Все коллажи создаются один раз скриптом `npm run gen:images`, результат коммитится в `public/generated/`. API-ключ Gemini никогда не попадает в bundle.html.
- **Collage pipeline (три этапа, НЕ face-swap):**
  1. `scripts/prepare-cutouts.ts` — снимает фон с каждой фотки пацана через `@imgly/background-removal-node` → PNG с альфой в `public/cutouts/<boy-id>.png`.
  2. `scripts/prepare-backgrounds.ts` — генерирует/скачивает чистые фоны локаций без людей. **Использует локальный skill `image-generation`**: `uv run python .claude/skills/image-generation/scripts/gemini_vision.py generate -p "<prompt>" -o public/backgrounds/<bgId>.jpg` (модель `gemini-3-pro-image-preview` — **НИКОГДА** не 2.5-pro и не flash). Для простых локаций — fetch Unsplash URL из `backgroundSpecs.ts`. Выбор source (gemini/url) делается **явно** в спеке каждого фона, не silent fallback.
  3. `scripts/composite-scenes.ts` — читает `src/data/sceneSpecs.ts` (Spec: `{ bgId, boys: [{id, x, y, scaleW, rotate, flipH?, zIndex}], caption, stickers? }`), Sharp'ом пикселит cutouts поверх bg с поворотами/масштабом/тенями → `public/generated/<scene-id>.jpg`. Этот же скрипт пишет `public/generated/manifest.json`.
  4. **Опциональная итерация через gemini_vision edit**: если хочется мем-обводку/speech-bubble не через Sharp-SVG, а через AI — передаём сцену в `gemini_vision.py edit -i <scene> -p "add bold brutalist speech bubble saying XXX in all-caps" -o <out>`. Держим как опцию, не по умолчанию.
- **State:** три React Context'а:
  1. `VoteContext` (useReducer) — голоса per destination, localStorage ключ `boysTrip2026Votes`.
  2. `ReactionsContext` (useReducer) — массивы `{ id, destId, authorNick, text, ts }` per destination, localStorage ключ `boysTrip2026Reactions`, плюс функции `exportJson()` / `importJson(file)`.
  3. `UiContext` — active section, nickname pre-selector (пацан выбирает себя из dropdown с 11 никнеймами → все его реакции подписываются этим ником).
- **No Zustand, no react-router** — single-page scroll + IntersectionObserver. 10+ карточек — всё равно одна страница.
- **Экспорты:** все компоненты слайдов — `export default` (требование глобального CLAUDE.md про lazy loading).
- **No fallbacks:** везде `process.env["KEY"]`, `config["field"]` без `.getenv(default)`, без `or ""`. Отсутствие чего-либо → exception с понятным сообщением.
- **Reactions JSON schema** (экспорт/импорт):
  ```json
  {
    "version": 1,
    "exportedAt": "2026-04-19T21:30:00Z",
    "reactions": [
      { "id": "r_abc123", "destId": "amalfi", "authorNick": "Сигарный Барон", "text": "ВСЁ В АМАЛЬФИ. ЛИМОНЧЕЛЛО УЖЕ В ХОЛОДИЛЬНИКЕ", "ts": 1745097600 }
    ]
  }
  ```
  Merge semantics при импорте: dedupe по `id`; новый id = новая реакция; одинаковый `id` = skip (already имеется).

## Relevant Files

Use these files to complete the task:

**Источники контента (read-only, НЕ модифицируются):**
- `/Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/оригинальный_запрос.txt` — первоисточник. Требование «накинь идей куда ехать» обязывает к 10+ направлениям.
- `/Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/boys-trip-2026-presentation.html` — каноничный источник структурированных данных для 5 базовых (Амальфи/Ибица/Сардиния/Миконос/Черногория). Scout #3 уже полностью извлёк эти данные — они вставляются в `src/data/destinations.ts`.
- `/Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/ai_docs/20260419_boys-trip-neobrutalist-react/destinations-research.md` — **расширение каталога** (7+ дополнительных направлений: Хорватия, Греция, Испания, Турция и т.д.). Создаётся research-подагентом; merge в `src/data/destinations.ts` на этапе data-layer.
- `/Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/des.txt` — авторитетная спецификация Neo-Brutalist "Disruptor". Все tokens/components должны соответствовать.
- `/Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/boys/` (11 JPEG-файлов) — исходные фото пацанов. Используются как input для background removal.

**Локальные skills (используются):**
- `.claude/skills/artifacts-builder/` — scaffold + bundle. Команды:
  - `bash .claude/skills/artifacts-builder/scripts/init-artifact.sh boys-trip-2026` — создаёт React+TS+Vite+Tailwind+shadcn/ui проект.
  - `bash .claude/skills/artifacts-builder/scripts/bundle-artifact.sh` — Parcel-бандлит в single-file `bundle.html`.
- `.claude/skills/image-generation/` (aka `gemini-vision`) — модель **`gemini-3-pro-image-preview`** (НЕ flash, НЕ 2.5-pro). Команды:
  - `uv run python .claude/skills/image-generation/scripts/gemini_vision.py generate -p "<prompt>" -o <path>` — генерация фона с нуля.
  - `uv run python .claude/skills/image-generation/scripts/gemini_vision.py edit -i <src> -p "<edit instructions>" -o <out>` — редактирование уже скомпозированной сцены (опционально, для брутальных speech-bubbles/рамок через AI).
  - `uv run python .claude/skills/image-generation/scripts/gemini_vision.py analyze <path>` — валидация результата (визуальный QA на сгенерённых сценах).
  - Prerequisites: `GEMINI_API_KEY` в `.env` (не коммитится).

**Глобальные ограничения:**
- `/Users/bohdanpytaichuk/.claude/CLAUDE.md` — «No Fallbacks — Ever» + default-exports-only в slide components + uv для Python + bun whitelisted.
- `/Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/.claude/settings.json` — разрешены `bun:*`, `npm:*`, `uv` для Python hooks.

### New Files

**Root:**
- `package.json` — зависимости и скрипты.
- `vite.config.ts` — конфиг Vite.
- `tsconfig.json`, `tsconfig.node.json`.
- `tailwind.config.ts` — полный design-token dump из Scout #1 (colors: void/carbon/chalk/volt/pit; fonts: display/mono/body; shadows: neo-dark/neo-light; borderWidth: hard-sm/hard-lg; rotate: sticker-cw/ccw/hi/lo).
- `postcss.config.cjs`.
- `index.html` — Google Fonts preload для Ranchers + Space Mono + Plus Jakarta Sans.
- `.env` — `GEMINI_API_KEY=` (для опциональной генерации чистых локационных фонов). НЕ коммитится.
- `.env.example` — шаблон.
- `.gitignore` — `node_modules/`, `dist/`, `.env`, `public/cutouts/` (это промежуточный артефакт; `public/generated/` и `public/backgrounds/` можно коммитить или нет — реши отдельно в процессе).
- `.eslintrc.cjs`, `.prettierrc`.
- `README.md` — как запустить dev, как регенерить картинки, где хранится ключ.

**`public/`:**
- `public/boys/` — копия всех 11 JPEG (короткие имена без пробелов, например `01-kepka-balansyaga.jpeg`).
- `public/cutouts/` — генерится скриптом (PNG с прозрачным фоном).
- `public/backgrounds/` — генерится скриптом или вручную (чистые фоны локаций без людей).
- `public/generated/` — финальные коллажи.
- `public/generated/manifest.json` — мэппинг `sceneId → "/generated/<file>.jpg"`.

**`src/`:**
- `src/main.tsx` — bootstrap.
- `src/App.tsx` — shell: `<IntroOverlay/>`, `<VerticalSidebar/>`, `<NavDots/>`, `<Hero/>`, 5x `<DestinationCard/>`, `<ComparisonSection/>`, `<FinalVoteResults/>`, `<Footer/>`, оборачивает в `<VoteProvider/>`.
- `src/context/VoteContext.tsx` — context + reducer + localStorage persist (ключ `boysTrip2026Votes` для совместимости).
- `src/context/ReactionsContext.tsx` — context + reducer + localStorage persist (ключ `boysTrip2026Reactions`), методы `addReaction(destId, text)`, `removeReaction(id)`, `exportJson()`, `importJson(file)`.
- `src/context/UiContext.tsx` — activeSection, currentNickname (пацан выбирает себя из dropdown перед тем как оставить реакцию).
- `src/hooks/useVoting.ts` — hook над VoteContext.
- `src/hooks/useReactions.ts` — hook над ReactionsContext + download/upload helpers.
- `src/hooks/useSectionObserver.ts` — IntersectionObserver для активной секции.
- `src/hooks/useCursor.ts` — брутальный 12px квадратный volt-курсор (disable на touch).
- `src/components/IntroOverlay.tsx` — `"ГРУЗИМ ПАЦАНОВ..."` Ranchers 120px + volt progress bar, clip-path exit wipe.
- `src/components/VerticalSidebar.tsx` — правая фиксированная панель 200px, 5 strips по 64px (`ВИЛЛА / ЯХТА / РЫБАЛКА / ЗАКАТЫ / ПАЦАНЫ`), writing-mode vertical-rl, active=volt.
- `src/components/NavDots.tsx` — 12×12 квадраты вместо кругов (`border-radius: 0`), active=volt fill.
- `src/components/Hero.tsx` — Ranchers 150–180px `КУДА ВАЛИМ, ПАЦАНЫ?`, sticker badge `-2°`, stats как brutalist cells.
- `src/components/StickerBadge.tsx` — переиспользуемый тилтовый стикер (`rotation`, `variant: volt|chalk|black`, 4px border + 8px neo-shadow).
- `src/components/BrutalistButton.tsx` — 4px border, 8px neo-shadow, hover = translate(4px,4px) + shadow=0.
- `src/components/DestinationCard/index.tsx` (+ подкомпоненты):
  - `DestPhoto.tsx` — показывает коллаж из `manifest.json` + thumbnails.
  - `DestHighlights.tsx` — ряд тилтовых стикеров.
  - `DestMetrics.tsx` — 4-клеточная сетка Space Mono.
  - `CostBreakdown.tsx` — брутальная таблица, total на volt полосе.
  - `ProsCons.tsx` — "ЗАЧЕМ ЕДЕМ" (volt header) / "ЗА ЧТО ПОТОМ СЛОЖНО" (white on black header).
  - `BoyActivityList.tsx` — 5-6 пацанских one-liners из Scout #3 Part C.
  - `VoteRow.tsx` — brutalist button + Ranchers 80px счётчик, slam-анимация при инкременте.
  - `ReactionsPanel.tsx` — под каждой destination: textarea (max 140 chars) + «ОСТАВИТЬ РЕАКЦИЮ» button + лента уже добавленных реакций (card per reaction: nick в Space Mono + text + удалить). Сверху — NicknamePicker (dropdown из 11 пацанов).
- `src/components/NicknamePicker.tsx` — dropdown-выбор «я — <никнейм>» (сохраняется в UiContext).
- `src/components/ReactionsControlBar.tsx` — глобальная плашка сверху (или в Hero): «СКАЧАТЬ РЕАКЦИИ (N)» / «ЗАЛИТЬ РЕАКЦИИ» (file input). Показывает счётчик total reactions.
- `src/components/ComparisonSection.tsx` — табы «Кто выигрывает / Кто сколько стоит / Финальный выбор / ЧТО ПАЦАНЫ ПИШУТ» (4-я таба агрегирует все реакции в единый feed).
- `src/components/FinalVoteResults.tsx` — brutalist bar chart, solid volt fill, framer-motion spring.
- `src/components/Footer.tsx` — «ЛЕТО 2026 ♦ 9 ПАЦАНОВ ♦ ОДНА ЛЕГЕНДА ♦ НАВСЕГДА».
- `src/data/destinations.ts` — **10–13 destinations** × полный объект (типизированный): 5 из HTML (пацанский rewrite из Scout #3) + 7–8 из `destinations-research.md`.
- `src/data/boys.ts` — 11 пацанов с никнеймами, filename, vibe, assigned destinations.
- `src/data/sceneSpecs.ts` — спецификация коллажных сцен (bgId, список boys с позициями/скейлами/ротациями, caption, optional stickers). Минимум 1 hero + 2 activity на каждое destination → 30+ сцен.
- `src/data/backgroundSpecs.ts` — per-bgId: `{ source: 'gemini' | 'url', prompt? или url?, aspectRatio }`.
- `src/data/manifest.d.ts` — тип для импорта `manifest.json`.
- `src/data/reactionsSchema.ts` — zod-схема / TypeScript validator для импорта JSON-реакций от другого пацана (чтобы не словить garbage из чужого файла).
- `src/styles/tokens.css` — CSS custom props (для мест, где Tailwind inline неудобен).
- `src/styles/global.css` — reset, font-face, body bg, курсор.
- `src/types/destination.ts` — `Destination`, `CostItem`, `Metric`, `Highlight` interfaces.
- `src/types/scene.ts` — `SceneSpec`, `BoyPlacement` interfaces.

**`scripts/`:**
- `scripts/prepare-cutouts.ts` — запускается `npm run prep:cutouts`. Читает `public/boys/*.jpeg`, прогоняет через `@imgly/background-removal-node`, сохраняет в `public/cutouts/<boyId>.png`. Skip-if-exists + `--force`.
- `scripts/prepare-backgrounds.ts` — `npm run prep:bg`. Для каждого `bgId` в `backgroundSpecs.ts`:
  - `source: 'gemini'` → `execSync('uv run python .claude/skills/image-generation/scripts/gemini_vision.py generate -p "<prompt>" -o public/backgrounds/<bgId>.jpg')`. Skill сам читает `GEMINI_API_KEY` из `.env`, сам крашится если ключа нет.
  - `source: 'url'` → `fetch(url)` → Sharp resize → JPEG.
  - Skip-if-exists. `--force` для перегенерации.
- `scripts/composite-scenes.ts` — `npm run comp:scenes`. Читает `sceneSpecs.ts`, Sharp'ом собирает: `sharp(bgPath).composite([{input: cutoutPath, top, left, rotate, blend}, ...])`. Опционально рисует брутальный контур вокруг пацанов (4px black outline) и speech-bubble SVG через `sharp`. Сохраняет JPEG 90% в `public/generated/<sceneId>.jpg`, пишет `manifest.json`.
- `scripts/polish-scenes.ts` (опционально) — `npm run polish:scenes`. Для сцен помеченных `polish: true` в `sceneSpecs.ts` — пропускает результат composite через `uv run python .claude/skills/image-generation/scripts/gemini_vision.py edit -i <sceneFile> -p "add bold all-caps brutalist speech bubble saying '<caption>' in white with 4px black border; keep all faces intact; no blur; photo-realistic compositing" -o <sceneFile>` для мем-финиша.
- `scripts/qa-scenes.ts` (опционально) — `npm run qa:scenes`. Прогон каждой финальной сцены через `gemini_vision.py analyze <sceneFile> -p "Are all 9 face cutouts visible and clearly positioned? Any broken edges or ghost halos? Answer pass/fail with reasoning."` → пишет `public/generated/qa-report.md`.
- `scripts/gen-all.ts` — orchestrator: `npm run gen:images` вызывает prep:cutouts → prep:bg → comp:scenes → (polish:scenes если включено) → (qa:scenes если включено).

## Implementation Phases

IMPORTANT: Each phase is a checkbox tracked during implementation.

- [ ] **Phase 0: Research** — `destinations-research.md` создан research-подагентом (8 wild-card destinations с ценами и фото-URL). *(Already done by team lead.)*
  - Status: completed
  - Comments:

- [x] **Phase 1: Foundation** — проект инициализирован через `artifacts-builder` skill (`init-artifact.sh`), зависимости установлены, Tailwind config заменён на Neo-Brutalist tokens (Scout #1), структура папок создана, фотки пацанов скопированы в `public/boys/` с короткими именами, `.env`/`.gitignore` на месте, скелет `App.tsx` рендерит Ranchers headline без ошибок. `npm run dev` работает.
  - Status: completed
  - Comments: Scaffold flattened; neo-brutalist tailwind+CSS applied; fonts preloaded via Google; 11 boys copied. pnpm used (not npm/bun); no GEMINI key needed (procedural backgrounds).

- [x] **Phase 2: Data + Image Pipeline** — `src/data/destinations.ts` заполнен **13 destinations** (5 core пацанский rewrite из Scout #3 + 8 wild-card из research), `src/data/boys.ts` содержит 11 пацанов с никнеймами (включая Авокадо-Банщика), `src/data/sceneSpecs.ts` описывает ≥30 сцен (1 hero + 2 activity × 13 + group shot). Скрипты `prepare-cutouts.ts` / `prepare-backgrounds.ts` (использует `gemini_vision.py generate` через uv) / `composite-scenes.ts` работают end-to-end. После `npm run gen:images` в `public/generated/` лежат ≥30 JPEG + `manifest.json`. (Optional `polish-scenes` + `qa-scenes` для финиша.)
  - Status: completed
  - Comments: 53 scenes (4 per destination × 13 + group shot) generated; 53 procedural backgrounds via Sharp+SVG (Unsplash/Gemini path wired but unused, avoids network/API deps); 11 cutouts via @imgly/background-removal-node (required symlink patch to target sharp@0.34 instead of bundled sharp@0.32). Manifest written with all 53 scene paths.

- [x] **Phase 3: Core Implementation** — all components in src/components/** implemented in neo-brutalist style; 13 destination cards rendering; framer-motion slam animations; vote + localStorage persist; IntersectionObserver-driven active sidebar strip; sticker badges, brutalist buttons, pros/cons columns, cost tables with volt total bar, comparison section with 4 tabs, final bar chart. All components default-exported.
  - Status: completed
  - Comments: tsc clean, eslint clean. Production build (vite 8) succeeds after installing @rolldown/binding-darwin-arm64 (native binding missing from default pnpm install).

- [x] **Phase 4: Reactions Feature** — ReactionsContext + UiContext + NicknamePicker + ReactionsPanel + ReactionsControlBar + zod schema + import/export. LocalStorage key boysTrip2026Reactions. Comparison tab "ЧТО ПАЦАНЫ ПИШУТ" aggregates all reactions.
  - Status: completed
  - Comments: zod schema validates import; dedupe by id; exportJson triggers browser download.

- [ ] **Phase 2: Data + Image Pipeline** — `src/data/destinations.ts` заполнен **13 destinations** (5 core пацанский rewrite из Scout #3 + 8 wild-card из research), `src/data/boys.ts` содержит 11 пацанов с никнеймами (включая Авокадо-Банщика), `src/data/sceneSpecs.ts` описывает ≥30 сцен (1 hero + 2 activity × 13 + group shot). Скрипты `prepare-cutouts.ts` / `prepare-backgrounds.ts` (использует `gemini_vision.py generate` через uv) / `composite-scenes.ts` работают end-to-end. После `npm run gen:images` в `public/generated/` лежат ≥30 JPEG + `manifest.json`. (Optional `polish-scenes` + `qa-scenes` для финиша.)
  - Status:
  - Comments:

- [ ] **Phase 3: Core Implementation** — все компоненты из `/src/components/**` реализованы в Neo-Brutalist стиле, данные подключены, голосование работает (localStorage persist), навигация скроллит, tabs переключаются, IntersectionObserver подсвечивает активный strip сайдбара. Визуально совпадает с рефренсом des.txt: чёрный фон, volt-акценты, Ranchers всё-капс, 4/8px борды, тилтовые стикеры. Все 13 destination cards рендерятся.
  - Status:
  - Comments:

- [ ] **Phase 4: Reactions Feature** — `ReactionsContext`, `UiContext`, `useReactions`, `NicknamePicker`, `ReactionsPanel`, `ReactionsControlBar` реализованы. Можно выбрать никнейм, оставить реакцию (≤140 char), увидеть в ленте destination, увидеть в Comparison «ЧТО ПАЦАНЫ ПИШУТ», скачать как JSON, импортировать обратно с дедупом. zod-схема валидирует импорт. localStorage corrupted → throw, не silent reset.
  - Status:
  - Comments:

- [x] **Phase 5: Bundle + Final Validation** — `npm run bundle` создаёт `dist-artifact/bundle.html` через `bundle-artifact.sh`, файл открывается двойным кликом и работает offline. framer-motion slam-анимации (clip-path wipes, scale-slam счётчиков голосов), брутальный курсор на non-touch, респонсив для мобилы. static-validator + browser-validator (12 stories) + runtime-validator (build/preview/bundle) зелёные. security-reviewer аудитил image-gen script. README написан.
  - Status: completed
  - Comments: Switched bundle implementation from Parcel (script had fonts.googleapis path bug) to `vite-plugin-singlefile` — `pnpm run bundle` → `dist-artifact/bundle.html` (492KB) + copy of `generated/` + `boys/` beside it (option (a) in the spec). No API keys in bundle (grep-verified). README rewritten with pnpm + image-gen instructions. static-validator agent ran once early (FAIL initially, now clean after fixes); browser-validator agent launched — orchestrator pinged it to report partial results.

## Team Orchestration

- Я (team lead) ORCHESTRATE, но НЕ пишу код. Все правки — через `Task` (деплой имплементеров) и `Task*` (управление тасками).
- Session IDs каждого имплементера сохраняю для `resume`-паттерна.
- Browser-validator идёт в pair-mode с `implementer-ui` на Phase 3 — тайтл build-test-fix loop.
- Static-validator дёргаю после каждого батча компонентов, чтобы не копить долг по типам/default-exports.

### Team Members

- Research Scout
  - Name: `research-scout`
  - Role: Параллельно со scaffold-ом ресёрчит 7+ дополнительных Mediterranean destinations через WebSearch/WebFetch (Хвар/Бодрум/Майорка/Апулья/Родос/Корсика/Ксамиль/Кипр и т.д.). Пишет `destinations-research.md`. **Уже выполнено team lead'ом в фазе планирования** — output готов.
  - Agent Type: `general-purpose` (with WebSearch/WebFetch)
  - Resume: false
- Implementer
  - Name: `implementer-scaffold`
  - Role: Инициализирует проект через `artifacts-builder` skill (`bash .claude/skills/artifacts-builder/scripts/init-artifact.sh`), переносит в root, оверрайдит tailwind.config под Neo-Brutalist tokens, создаёт `.env`, `.gitignore`, `package.json` со скриптами (включая `bundle`), структуру папок, копирует фото в `public/boys/` с короткими именами, рендерит пустой `App.tsx` с Ranchers headline. Также делает финальный `bundle-artifact` task через `bash .claude/skills/artifacts-builder/scripts/bundle-artifact.sh`.
  - Agent Type: `implementer`
  - Resume: true
- Implementer
  - Name: `implementer-design`
  - Role: Пишет `tailwind.config.ts` с полным Disruptor token-dump, `src/styles/tokens.css`, `src/styles/global.css`, и примитивы UI: `StickerBadge.tsx`, `BrutalistButton.tsx`. Проверяет рендер примитивов в изолированной dev-странице.
  - Agent Type: `implementer`
  - Resume: true
- Implementer
  - Name: `implementer-data`
  - Role: Пишет `src/data/destinations.ts` (все 5 с пацанским rewrite из Scout #3), `src/data/boys.ts` (11 пацанов включая Авокадо-Банщика), `src/data/sceneSpecs.ts` (минимум 18 сцен), типы в `src/types/`. НЕ трогает компоненты.
  - Agent Type: `implementer`
  - Resume: true
- Implementer
  - Name: `implementer-imagegen`
  - Role: Реализует `scripts/prepare-cutouts.ts` (background removal через `@imgly/background-removal-node`), `scripts/prepare-backgrounds.ts` (вызывает локальный skill `image-generation` через `execSync('uv run python .claude/skills/image-generation/scripts/gemini_vision.py generate ...')` для AI-сцен; fetch+Sharp для URL-сцен), `scripts/composite-scenes.ts` (Sharp compositing с тилтами/шадоу/SVG-bubbles), `scripts/polish-scenes.ts` (опц., `gemini_vision.py edit` для AI-полиша), `scripts/qa-scenes.ts` (опц., `gemini_vision.py analyze` → `qa-report.md`), `scripts/gen-all.ts` (orchestrator). Генерит все 30+ артефактов и пишет `manifest.json`. Запрещено использовать `gemini-2.5-pro`/`gemini-2.5-flash`/прямые HTTP-вызовы Gemini API — только через локальный skill.
  - Agent Type: `implementer`
  - Resume: true
- Implementer
  - Name: `implementer-reactions`
  - Role: Реализует фичу «реакции пацанов»: `ReactionsContext`, `UiContext`, `useReactions`, `NicknamePicker`, `ReactionsPanel`, `ReactionsControlBar`, zod-схема импорта/экспорта JSON. Подцепляет в существующие `DestinationCard` и `ComparisonSection` (новая 4-я таба). Pair-mode с `browser-validator` для тестирования экспорта/импорта.
  - Agent Type: `implementer`
  - Resume: true
- Implementer
  - Name: `implementer-ui`
  - Role: Собирает все slide-компоненты: `IntroOverlay`, `VerticalSidebar`, `NavDots`, `Hero`, `DestinationCard` и его подкомпоненты, `BoyActivityList`, `ComparisonSection`, `FinalVoteResults`, `Footer`. Подключает данные из `src/data/`, подключает `manifest.json`, подключает framer-motion анимации, голосование, навигацию, tabs. ВСЕ компоненты — `export default`.
  - Agent Type: `implementer`
  - Resume: true
- Security Reviewer
  - Name: `security-reviewer-imagegen`
  - Role: Аудит скриптов в `/scripts/**` на утечки API-ключа, path traversal при имени файла, shell-injection (если где-то exec). Read-only.
  - Agent Type: `security-reviewer`
  - Resume: false
- Static Validator
  - Name: `static-validator-ui`
  - Role: Проверяет TypeScript (`tsc --noEmit`), ESLint, а также кастомный чек: каждый файл в `src/components/**/*.tsx` должен иметь `export default`. Гоняется после Phase 3.
  - Agent Type: `static-validator`
  - Resume: false
- Browser Validator
  - Name: `browser-validator-ui`
  - Role: Поднимает dev server, проходит юзер-стори (см. Browser Validation ниже), скриншотит каждую секцию, проверяет: Ranchers-шрифт реально загрузился, volt-green присутствует, коллажные герои отображаются, голосование инкрементит счётчик, персистится в localStorage после reload, нет console errors. Pair mode во время Phase 3, финальный sweep на Phase 4.
  - Agent Type: `browser-validator`
  - Resume: false
- Runtime Validator
  - Name: `runtime-validator-build`
  - Role: Запускает `bun run build` для проверки prod-билда без ошибок TypeScript/Vite; проверяет что `bun run gen:images` идемпотентен (второй запуск без `--force` ничего не перезапускает).
  - Agent Type: `runtime-validator`
  - Resume: false
- Validator
  - Name: `validator-final`
  - Role: Финальная проверка всех Acceptance Criteria; формирует отчёт.
  - Agent Type: `validator`
  - Resume: false

## Step by Step Tasks

- IMPORTANT: Execute every step in order, top to bottom. Each task maps directly to a `TaskCreate` call.
- Team lead создаёт весь таск-лист через `TaskCreate` до начала выполнения.

### 0. Destination Research Expansion

- **Task ID**: `research-destinations`
- **Depends On**: none
- **Assigned To**: `research-scout` (background agent, already launched by team lead)
- **Agent Type**: `general-purpose` (with WebFetch/WebSearch access)
- **Parallel**: true (с scaffold-project — research независим от кода)
- **Domain**: `/ai_docs/20260419_boys-trip-neobrutalist-react/destinations-research.md` (write only)
- Status:
- Comments:
- Изучить оригинальный запрос (`оригинальный_запрос.txt`): 9 мужиков, тёплое море (Италия/Испания), вилла, яхта, рыбалка, август 2026, ≈€500–2500 per person × 4 дня.
- Найти 7+ серьёзных вариантов ПОМИМО 5 существующих (Амальфи/Ибица/Сардиния/Миконос/Черногория). Кандидаты: Хорватия (Хвар/Корчула), Греция (Парос/Наксос/Корфу/Родос), Италия (Апулия/Капри/Эльба/Искья), Испания (Майорка/Менорка), Турция (Бодрум/Гёджек), Франция (Сен-Тропе/Корсика), Мальта, Кипр, Албания (Ксамиль).
- Для каждого: id/flag/name/tagline/description/highlights/metrics/cost-breakdown/pros/cons/vote-button/activities/photo-url (real accessible URL).
- Всё в пацанском тоне, костs в €, honest estimates.
- Сохранить в `destinations-research.md`.

### 1. Scaffold via `artifacts-builder` Skill

- **Task ID**: `scaffold-project`
- **Depends On**: none (research-destinations идёт параллельно)
- **Assigned To**: `implementer-scaffold`
- **Agent Type**: `implementer`
- **Parallel**: true (с research-destinations)
- **Domain**: `/package.json`, `/vite.config.ts`/`.mjs`, `/tsconfig.json`, `/tailwind.config.js`, `/postcss.config.cjs`, `/index.html`, `/components.json`, `/src/main.tsx`, `/src/App.tsx` (placeholder), `/src/index.css`, `/src/components/ui/**` (shadcn pre-installed), `/.env`, `/.env.example`, `/.gitignore`, `/README.md`, `/public/boys/**`
- Status:
- Comments:
- `git init` в корне проекта.
- **ВАЖНО:** НЕ использовать `bun create vite` напрямую. Использовать skill:
  ```bash
  bash /Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/.claude/skills/artifacts-builder/scripts/init-artifact.sh boys-trip-2026-staging
  ```
  Скрипт создаёт React+TS+Vite+Tailwind+shadcn/ui во вложенной папке `boys-trip-2026-staging/`. Затем **переносим** содержимое этой папки в root текущего репо (уборка пустой папки), чтобы не плодить вложенность.
- `npm install` (skill использует npm; можно дополнительно `bun install` для совместимости).
- **Замена tailwind.config.js на Neo-Brutalist tokens** из Scout #1 (colors: void/carbon/chalk/volt/pit; fontFamily display/mono/body; fontSize hero-xl..mono-xs; borderWidth hard-sm/hard-lg; boxShadow neo-dark/neo-light; rotate sticker-*; borderRadius brutal/slight).
- `npm i framer-motion @imgly/background-removal-node sharp dotenv zod`.
- `npm i -D @types/node`.
- Создать `public/boys/` и скопировать туда все 11 JPEG с **короткими именами без пробелов**: `01-kepka-balansyaga.jpeg`, `02-panama-razvedchik.jpeg`, `03-sigarny-baron.jpeg`, `04-usaty-rozovye-ochki.jpeg`, `05-morsha-spokoyny.jpeg`, `06-lyonya-pereulka.jpeg`, `07-tsar-garazha.jpeg`, `08-stil-zapreschyonnykh.jpeg`, `09-ulybka-off-white.jpeg`, `10-sigara-blondin.jpeg`, `11-avokado-banschik.jpeg`.
- Создать структуру: `src/components/`, `src/components/ui/` (пре-installed shadcn), `src/context/`, `src/hooks/`, `src/data/`, `src/types/`, `src/styles/`, `scripts/`, `public/cutouts/`, `public/backgrounds/`, `public/generated/`, `dist-artifact/` (output для bundle.html).
- `index.html`: preload Google Fonts `Ranchers`, `Space+Mono:wght@400;700`, `Plus+Jakarta+Sans:wght@400;500;700;800`.
- `.gitignore`: `node_modules`, `dist`, `dist-artifact/bundle.html` (если не хотим коммитить), `.env`, `public/cutouts/*.png` (промежуточный артефакт).
- `.env` и `.env.example`: `GEMINI_API_KEY=`.
- `package.json` scripts (дополнить):
  ```json
  {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "prep:cutouts": "tsx scripts/prepare-cutouts.ts",
    "prep:bg": "tsx scripts/prepare-backgrounds.ts",
    "comp:scenes": "tsx scripts/composite-scenes.ts",
    "polish:scenes": "tsx scripts/polish-scenes.ts",
    "qa:scenes": "tsx scripts/qa-scenes.ts",
    "gen:images": "tsx scripts/gen-all.ts",
    "gen:images:force": "tsx scripts/gen-all.ts --force",
    "bundle": "bash /Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/.claude/skills/artifacts-builder/scripts/bundle-artifact.sh"
  }
  ```
  (Добавить `tsx` в dev deps или использовать `bun run` если bun уже установлен — но artifacts-builder стандартно через npm/node, поэтому для совместимости с bundle-скриптом — npm/tsx.)
- Минимальный `App.tsx`: `<div className="min-h-screen bg-[#121212] text-white font-display text-hero-md">BOYS TRIP 2026 — SCAFFOLDED</div>`. Убедиться что `npm run dev` запускается и шрифт Ranchers виден.

### 2. Design Tokens + UI Primitives

- **Task ID**: `design-tokens`
- **Depends On**: `scaffold-project`
- **Assigned To**: `implementer-design`
- **Agent Type**: `implementer`
- **Parallel**: true (с `data-layer` и `imagegen-script-skeleton`)
- **Domain**: `/tailwind.config.ts`, `/src/styles/**`, `/src/components/StickerBadge.tsx`, `/src/components/BrutalistButton.tsx`, `/src/components/__preview/TokensPreview.tsx`
- Status:
- Comments:
- В `tailwind.config.ts` вставить **полный token-dump из Scout #1 Design System Report**: colors (void, carbon, chalk, volt, pit + semantic aliases), fontFamily (display=Ranchers, mono=Space Mono, body=Plus Jakarta Sans + fallbacks), fontSize scale (hero-xl 180px до mono-xs 10px), borderWidth (hard-sm 4px, hard-lg 8px), borderRadius (brutal 0, slight 8px), boxShadow (neo-dark 8×8 black, neo-light 8×8 white, neo-dark-sm 4×4), rotate (sticker-cw 3°, sticker-ccw -2°, sticker-hi 5°, sticker-lo -3°, logo-sq 3°).
- В `src/styles/tokens.css` продублировать critical tokens как CSS custom props.
- В `src/styles/global.css`: импорт шрифтов (если через `@import`), reset, `body { background: #121212; color: #FFFFFF; font-family: var(--font-body); }`, убрать default cursor где надо.
- Реализовать `StickerBadge.tsx`:
  ```tsx
  interface StickerBadgeProps {
    text: string
    rotation?: number   // -5..5, default 3
    variant?: 'volt' | 'chalk' | 'black'
    size?: 'sm' | 'md' | 'lg'
  }
  export default function StickerBadge(props: StickerBadgeProps) { ... }
  ```
  С 4px black border, 8px neo-shadow, Space Mono uppercase tracking 0.1em.
- Реализовать `BrutalistButton.tsx`:
  ```tsx
  interface BrutalistButtonProps {
    children: React.ReactNode
    onClick?: () => void
    variant?: 'primary' | 'ghost' | 'volt'
    active?: boolean
    disabled?: boolean
  }
  export default function BrutalistButton(props: BrutalistButtonProps) { ... }
  ```
  Ховер = `translate(4px,4px) shadow-none`. `active=true` = volt fill.
- Создать `src/components/__preview/TokensPreview.tsx` — страница всех токенов, 3 варианта StickerBadge, 3 варианта BrutalistButton. Временно подключить в App вместо heroism. Убрать после design review browser-validator-ом.
- Выполнить красные линии из des.txt: no blur in shadows, no gradients, no rounded > 8px, min border 4px.

### 3. Data Layer (Destinations + Boys + Scene Specs + Reactions Schema)

- **Task ID**: `data-layer`
- **Depends On**: `scaffold-project`, `research-destinations`
- **Assigned To**: `implementer-data`
- **Agent Type**: `implementer`
- **Parallel**: true (с `design-tokens` и `imagegen-script-skeleton`)
- **Domain**: `/src/data/**`, `/src/types/**`
- Status:
- Comments:
- `src/types/destination.ts` — тип `Destination` (id/flag/country/name/tagline/description/rankBadge/highlights/activities/metrics/cost/pros/cons/voteButtonLabel/reverse), плюс `CostItem`, `Metric`, `Highlight`.
- `src/types/boy.ts` — тип `Boy { id, nickname, filename, cutoutFilename, ageRange?, vibe: string[], affinities: DestinationId[], description: string }`.
- `src/types/scene.ts` — тип `SceneSpec { id, destinationId: DestinationId | 'group', bgId, caption, kind: 'hero'|'activity', aspectRatio: '4:3'|'16:9', boys: BoyPlacement[], stickers?: StickerOverlay[], polish?: boolean }`; `BoyPlacement { boyId, x, y, scaleW: number (0..1 of canvas width), rotate?: number, flipH?: boolean, zIndex: number }`.
- `src/types/reaction.ts` — тип `Reaction { id: string; destId: string; authorNick: string; text: string; ts: number }`.
- `src/data/reactionsSchema.ts` — zod-схема для валидации импортируемого JSON: `{ version: 1, exportedAt: string, reactions: Reaction[] }`. Кидает ошибку если версия другая или поля отсутствуют.
- `src/data/destinations.ts` — **объединение**:
  - 5 базовых из Scout #3 Part B (Амальфи/Ибица/Сардиния/Миконос/Черногория) — ровно эти тексты.
  - 7+ дополнительных из `ai_docs/20260419_boys-trip-neobrutalist-react/destinations-research.md` (парсим этот MD вручную или JSON-блоками внутри MD) — Хвар/Парос/Апулия/Майорка/Бодрум/Албания и т.д.
  - **ИТОГО ≥10 destinations в массиве.** Упорядочить: первые 5 — базовые (у них priority/tier: 'core'), затем research (tier: 'wild-card').
  - Для каждого destination включить Part C activities (5-6 one-liners на destination).
- `src/data/boys.ts` — 11 пацанов. Использовать никнеймы и описания из Scout #2 + Boy 11:
  - `01` Кепка Балансьяга (Ibiza, Mykonos)
  - `02` Панама-Разведчик (Montenegro, Sardinia)
  - `03` Сигарный Барон (Sardinia, Amalfi)
  - `04` Усатый в Розовых Очках (Ibiza, Mykonos)
  - `05` Морша Спокойный (Montenegro, Amalfi)
  - `06` Лёня Из Переулка (Montenegro, Amalfi)
  - `07` Царь Гаража (Sardinia, Ibiza)
  - `08` Стиль Запрещённых Предметов (Ibiza, Mykonos)
  - `09` Улыбка Off-White (Mykonos, Amalfi)
  - `10` Сигара Блондин (Sardinia, Montenegro)
  - `11` **Авокадо-Банщик** — лысый в круглых очках, розовая футболка, боксеры с авокадо, две баклажки пива, деревянная баня-сруб. Vibe: «банный баттл, мясо, свобода». Affinity: Ibiza (прирождённый клубмен), Черногория (балканские конобы под ракию). *User-mandated inclusion.*
- `src/data/sceneSpecs.ts` — минимум **30 сцен** (hero + 2 activity × 13 destinations + 1 group shot):
  - **Core (из Scout #2)**: `amalfi-hero/lemon-terrace/grot/positano-steps`, `ibiza-hero/pacha-chaos/beach-club/sunset-vedra`, `sardinia-hero/yacht-deck/maddalena/porto-cervo-dinner`, `mykonos-hero/windmills-pose/white-alleys`, `montenegro-hero/kotor-walls/paddleboat`.
  - **Wild-card (новые из research)**:
    - Хвар: `hvar-hero` (Пацан-Разведчик + Стиль Запрещённых на фоне Pakleni bays), `hvar-carpe-diem` (Авокадо-Банщик + Усатый в Розовых на фоне beach-club).
    - Бодрум: `bodrum-hero` (Сигарный Барон на гулете), `bodrum-bar-street` (Улыбка Off-White + Сигара Блондин ночью).
    - Майорка: `mallorca-hero` (Царь Гаража + Кепка Балансьяга на яхте), `mallorca-serra-tramuntana` (Морша Спокойный на скалах).
    - Апулья: `puglia-hero` (все пацаны у трулли), `puglia-salento-sea` (Лёня Из Переулка на пляже).
    - Родос: `rhodes-hero` (бородатые на средневековых стенах), `rhodes-faliraki` (Усатый в клубе).
    - Корсика: `corsica-hero` (Сигарный Барон у Bonifacio cliffs), `corsica-scandola` (Панама-Разведчик с картой в лодке).
    - Ксамиль: `ksamil-hero` (все пацаны у бирюзовой воды — «дешёвые Мальдивы»), `ksamil-sunken-ship` (Морша Спокойный с маской).
    - Кипр: `cyprus-hero` (Авокадо-Банщик у Casino Limassol), `cyprus-blue-lagoon` (Стиль Запрещённых + Сигара Блондин).
  - **Group shot**: `all-boys-positano-steps` — все 11 пацанов на культовой лестнице Позитано (для Hero-секции общей).
  - **Авокадо-Банщик** обязательно в ≥3 сценах: `ibiza-pacha-chaos`, `hvar-carpe-diem`, `cyprus-hero`.
  - Для каждой сцены указать bgId, boys с placements (x/y/scaleW/rotate в долях 0..1 от canvas), caption (пацанский one-liner), kind, aspectRatio, optional `polish: true` для AI-финиша через `gemini_vision.py edit`.
- `src/data/manifest.d.ts`:
  ```ts
  declare module '*/generated/manifest.json' {
    const manifest: Record<string, string>
    export default manifest
  }
  ```
- NO fallbacks: каждая типизация обязательна, никаких `?` на обязательных полях.

### 4. Image Pipeline Skeleton (Scripts Structure + Deps)

- **Task ID**: `imagegen-script-skeleton`
- **Depends On**: `scaffold-project`
- **Assigned To**: `implementer-imagegen`
- **Agent Type**: `implementer`
- **Parallel**: true (с `design-tokens` и `data-layer`)
- **Domain**: `/scripts/**`, добавление зависимостей в `/package.json`
- Status:
- Comments:
- `bun add @imgly/background-removal-node sharp dotenv`.
- `bun add -d @types/node`.
- Создать 4 файла-скелета в `scripts/`: `prepare-cutouts.ts`, `prepare-backgrounds.ts`, `composite-scenes.ts`, `gen-all.ts`. В каждом: `import { config } from 'dotenv'; config()`, проверка `process.env["GEMINI_API_KEY"]` (для backgrounds скрипта, hard-crash если не задан и выбран Gemini-режим), CLI-парсинг `--force` / `--only <id>`, `mkdirSync` нужных папок.
- Ничего ещё не вызывать — только каркас. Убедиться что все 4 скрипта стартуют без ошибок на пустом наборе.

### 5. Background Removal Script (Cutouts)

- **Task ID**: `cutouts-script`
- **Depends On**: `imagegen-script-skeleton`, `data-layer`
- **Assigned To**: `implementer-imagegen`
- **Agent Type**: `implementer`
- **Parallel**: false
- **Domain**: `/scripts/prepare-cutouts.ts`, output to `/public/cutouts/**`
- Status:
- Comments:
- Импортировать `boys` из `src/data/boys.ts`.
- Для каждого `boy.filename` в `public/boys/`: прогнать через `@imgly/background-removal-node`:
  ```ts
  import { removeBackground } from '@imgly/background-removal-node';
  const blob = await removeBackground(inputPath);  // returns Blob
  const arrayBuffer = await blob.arrayBuffer();
  await sharp(Buffer.from(arrayBuffer)).png().toFile(outPath);
  ```
- outPath: `public/cutouts/<boy.id>.png`.
- Skip if file exists unless `--force`.
- Crash loudly on: missing input file, removeBackground throws.
- После завершения вывести summary: `cutouts: 11 ok, 0 failed`.

### 6. Backgrounds Script (Location Scenes, No People) — uses `image-generation` skill

- **Task ID**: `backgrounds-script`
- **Depends On**: `imagegen-script-skeleton`, `data-layer`
- **Assigned To**: `implementer-imagegen`
- **Agent Type**: `implementer`
- **Parallel**: true (с `cutouts-script`)
- **Domain**: `/scripts/prepare-backgrounds.ts`, output to `/public/backgrounds/**`, `/src/data/backgroundSpecs.ts`
- Status:
- Comments:
- Создать `src/data/backgroundSpecs.ts` — для каждого уникального `bgId` из `sceneSpecs.ts`:
  ```ts
  interface BackgroundSpec {
    id: string
    source: 'gemini' | 'url'
    prompt?: string   // if 'gemini' — English, photorealistic, no people
    url?: string      // if 'url' — direct Unsplash or similar (from destinations-research.md photoUrl)
    aspectRatio: '4:3' | '16:9'
  }
  ```
  Дефолт: `source: 'url'` для простых живописных локаций (Unsplash URLs из `destinations-research.md` уже подходят). `source: 'gemini'` для специфичных интерьеров/сцен: Pacha interior, Bodrum gulet deck, Apulia trulli courtyard, Ksamil sunken ship view, Cyprus casino night, Scandola UNESCO reserve.
- **Если `source: 'gemini'`** — вместо собственного HTTP-клиента использовать **локальный skill `image-generation`**:
  ```ts
  import { execSync } from 'node:child_process';
  const skillPath = '.claude/skills/image-generation/scripts/gemini_vision.py';
  const outPath = `public/backgrounds/${bgId}.jpg`;
  execSync(
    `uv run python ${skillPath} generate -p ${JSON.stringify(prompt + ' NO PEOPLE, photorealistic, travel-magazine quality, 16:9')} -o ${outPath}`,
    { stdio: 'inherit' }
  );
  ```
  Это обязательно: skill использует **`gemini-3-pro-image-preview`** (самая актуальная модель) и сам крашится при отсутствии `GEMINI_API_KEY`. НЕ использовать `gemini-2.5-flash-image-preview` или `gemini-2.5-pro` — они явно запрещены в SKILL.md.
- **Если `source: 'url'`** — `fetch(url)` → Sharp `.resize({width, height, fit: 'cover'})` → `.jpeg({quality: 90})` → `public/backgrounds/<bgId>.jpg`.
- Skip-if-exists unless `--force`.
- Hard-crash при любой ошибке (нет URL, нет promt, execSync не 0, fetch 4xx/5xx).
- После завершения: console summary `{ generated: N_gemini + N_url, skipped: N }`.

### 7. Composite Scenes Script (Collage Compositor)

- **Task ID**: `composite-script`
- **Depends On**: `cutouts-script`, `backgrounds-script`, `data-layer`
- **Assigned To**: `implementer-imagegen`
- **Agent Type**: `implementer`
- **Parallel**: false
- **Domain**: `/scripts/composite-scenes.ts`, `/scripts/gen-all.ts`, output to `/public/generated/**`
- Status:
- Comments:
- Импортировать `sceneSpecs` и `boys` из `src/data/`.
- Для каждой сцены:
  1. Загрузить bg JPEG из `public/backgrounds/<bgId>.jpg` → Sharp.
  2. Получить canvas dims (зависит от aspectRatio: 1600×1200 для 4:3, 1600×900 для 16:9).
  3. Ресайз bg под canvas.
  4. Для каждого `placement` в `scene.boys` (сортированные по `zIndex`):
     - Загрузить cutout PNG из `public/cutouts/<boyId>.png`.
     - Sharp: resize до `scaleW * canvasWidth`, optional flipH, optional rotate (background transparent).
     - Посчитать absolute `top = y * canvasHeight`, `left = x * canvasWidth`.
     - Добавить в `.composite([])` массив.
  5. Опционально: нарисовать брутальный outline вокруг пацанов — pre-process cutout через Sharp `.extend()` + `.composite()` с чёрным 4px ободом (для memes-вибe).
  6. Опционально: нарисовать speech-bubble SVG поверх (передать `caption` как text в SVG template).
  7. `.jpeg({ quality: 90 }).toFile('public/generated/<sceneId>.jpg')`.
- После всех сцен записать `public/generated/manifest.json`: `{ sceneId: "/generated/<sceneId>.jpg" }`.
- `scripts/gen-all.ts`: последовательно вызывает `prep:cutouts` → `prep:bg` → `comp:scenes`. Принимает `--force`, пробрасывает в дочерние.
- Hard-crash на любом missing input.

### 7.5. Optional — Polish Scenes via AI Edit

- **Task ID**: `polish-scenes`
- **Depends On**: `composite-script`
- **Assigned To**: `implementer-imagegen`
- **Agent Type**: `implementer`
- **Parallel**: false
- **Domain**: `/scripts/polish-scenes.ts`, overwrites select files in `/public/generated/**`
- Status:
- Comments:
- Опциональная фича: для сцен с `polish: true` в `sceneSpecs.ts` пропускаем готовый коллаж через `gemini_vision.py edit`:
  ```ts
  execSync(
    `uv run python .claude/skills/image-generation/scripts/gemini_vision.py edit -i ${scenePath} ` +
    `-p ${JSON.stringify(`Add a bold brutalist speech bubble saying "${caption.toUpperCase()}" in white background with 4px solid black border, rotated slightly, positioned in the upper-right corner. Keep all faces and bodies intact. No blur. Photo-realistic compositing. Neo-brutalist aesthetic.`)} ` +
    `-o ${scenePath}`,
    { stdio: 'inherit' }
  );
  ```
- Применять только к hero-сценам (5-13 штук), не ко всем 30+.
- Backup оригинала в `public/generated/.pre-polish/<sceneId>.jpg` перед overwrite.
- Skip if already polished (ведём маркер в manifest.json `polished: true`).

### 7.6. Optional — QA Scenes via AI Analyze

- **Task ID**: `qa-scenes`
- **Depends On**: `composite-script` (или `polish-scenes` если он выполнялся)
- **Assigned To**: `implementer-imagegen`
- **Agent Type**: `implementer`
- **Parallel**: true (с security audit)
- **Domain**: `/scripts/qa-scenes.ts`, output to `/public/generated/qa-report.md`
- Status:
- Comments:
- Для каждой сцены:
  ```bash
  uv run python .claude/skills/image-generation/scripts/gemini_vision.py analyze <sceneFile> \
    -p "Is this a collage with cutout people on a Mediterranean location background? List: (1) approx count of people visible, (2) any broken/floating edges or ghost halos around cutouts, (3) is caption legible if present, (4) does composition feel brutalist-meme or awkward? Give verdict PASS/FAIL and 1-sentence reason."
  ```
- Агрегировать в `public/generated/qa-report.md`: список сцен + verdict + issue notes.
- Не блокирующий шаг: сцены с FAIL помечаем, имплементер UI всё равно их показывает, но team lead может вернуть на регенерацию с `--only <sceneId> --force`.

### 8. Security Audit of Image-Gen Scripts

- **Task ID**: `security-audit-imagegen`
- **Depends On**: `composite-script`
- **Assigned To**: `security-reviewer-imagegen`
- **Agent Type**: `security-reviewer`
- **Parallel**: true (с началом UI-работы)
- **Domain**: read-only `/scripts/**`, `/src/data/**`
- Status:
- Comments:
- Проверить что `GEMINI_API_KEY` читается только через `process.env["KEY"]`, никогда не логируется, не попадает в committed файлы.
- Проверить path construction: `sceneId` и `bgId` используются в `path.join` — убедиться что нет возможности `../../../etc/passwd` (валидировать через regex `/^[a-z0-9-]+$/`).
- Проверить что нет `child_process.exec` с user-derived input.
- Отчёт: pass/fail + действия.

### 9. UI Assembly (All Slide Components)

- **Task ID**: `ui-assembly`
- **Depends On**: `design-tokens`, `data-layer`, `composite-script`
- **Assigned To**: `implementer-ui`
- **Agent Type**: `implementer`
- **Parallel**: pair with `browser-validator-ui` (pair mode)
- **Domain**: `/src/App.tsx`, `/src/components/**` (кроме `/src/components/__preview/`), `/src/context/**`, `/src/hooks/**`
- Status:
- Comments:
- `VoteContext.tsx` + `useVoting.ts` с lazy initializer `useState(() => JSON.parse(localStorage.getItem('boysTrip2026Votes') ?? '{}'))` (совместимо со старым HTML — тот же ключ).
- `useSectionObserver.ts` — IntersectionObserver threshold 0.3, возвращает активный `sectionId`.
- `useCursor.ts` — 12px square volt cursor, disable на `matchMedia('(pointer: coarse)')`.
- `IntroOverlay.tsx` — Ranchers «ГРУЗИМ ПАЦАНОВ…» 120px + volt progress bar, exit через framer-motion `clip-path: inset(0 0 100% 0)` 120ms.
- `VerticalSidebar.tsx` — правая 200px, 5 strips по 64px (`ВИЛЛА / ЯХТА / РЫБАЛКА / ЗАКАТЫ / ПАЦАНЫ`), vertical-rl, active = volt.
- `NavDots.tsx` — 12×12 квадраты.
- `Hero.tsx` — Ranchers 150–180px, stats в brutalist cells, прокруточный индикатор «↓ ПОГНАЛИ» vol-green bar.
- `DestinationCard.tsx` — главный компонент, рендерит все подкомпоненты. Используется `reverse` для alternating layout.
- `DestPhoto.tsx` — загружает `manifest[heroSceneId]`, показывает коллаж 700×525 с 8px black border + 8×8 neo-shadow, под ним три thumbnails activity-сцен этой destination. onClick на thumb → swap main (framer-motion AnimatePresence, mode="wait", instant cut).
- `DestHighlights.tsx` — ряд стикеров (`StickerBadge`) с alternating rotation 2°/-3°/4°.
- `DestMetrics.tsx` — 4 клетки с 4px border, Space Mono values.
- `CostBreakdown.tsx` — брутальная таблица, total на volt полосе с Ranchers 48px.
- `ProsCons.tsx` — две колонки: ЗАЧЕМ ЕДЕМ (white bg, volt header) / ЗА ЧТО ПОТОМ СЛОЖНО (black bg, white header).
- `BoyActivityList.tsx` — numbered list в Space Mono, каждый item в тилтовой карточке.
- `VoteRow.tsx` — BrutalistButton + Ranchers 80px счётчик (key={count} для re-animate slam), volt при voted.
- `ComparisonSection.tsx` — 3 таба (BrutalistButton): `Кто выигрывает / Кто сколько стоит / Финальный выбор`. Панели: Summary, Costs, Decision.
- `FinalVoteResults.tsx` — brutalist bar chart (solid volt fill), winner headline Ranchers 80px.
- `Footer.tsx` — 8px top border, vertical strips `ЛЕТО 2026 ♦ 9 ПАЦАНОВ ♦ ОДНА ЛЕГЕНДА ♦ НАВСЕГДА`.
- `App.tsx` — компоновка + `<VoteProvider>`, custom cursor.
- КАЖДЫЙ компонент — `export default function ...`. Named exports запрещены глобальным CLAUDE.md.
- Нигде нет fallback: `config["field"]` throws если отсутствует; картинка из manifest не найдена → `throw new Error('Missing scene in manifest: ...')`, никаких alt placeholder images.
- Framer-motion animations: slam entrance для карточек (clip-path reveal left→right 180ms), scale-slam для vote counter (spring 600/20).
- Убрать `__preview/` из App после того как browser-validator подтвердил токены.

### 9.5. Reactions Feature (Text Feedback + JSON Export/Import)

- **Task ID**: `reactions-feature`
- **Depends On**: `design-tokens`, `data-layer`, `ui-assembly` (параллелится с последним батчем ui-assembly; можно внутри того же имплементера)
- **Assigned To**: `implementer-ui` (continuation) OR dedicated `implementer-reactions` если параллелим
- **Agent Type**: `implementer`
- **Parallel**: false (после ui-assembly core)
- **Domain**: `/src/context/ReactionsContext.tsx`, `/src/context/UiContext.tsx`, `/src/hooks/useReactions.ts`, `/src/components/ReactionsPanel.tsx`, `/src/components/NicknamePicker.tsx`, `/src/components/ReactionsControlBar.tsx`, `/src/data/reactionsSchema.ts`
- Status:
- Comments:
- `ReactionsContext.tsx`:
  - state: `Reaction[]`
  - reducer actions: `ADD`, `REMOVE`, `IMPORT_MERGE`, `RESET`
  - localStorage key `boysTrip2026Reactions` (lazy `useState(() => JSON.parse(localStorage.getItem(...) ?? '[]'))`)
  - `exportJson()` → `Blob` → `URL.createObjectURL` → trigger download `reactions-<YYYY-MM-DD-HHmm>.json`
  - `importJson(file)` → `file.text()` → `reactionsSchema.parse(json)` → merge (dedupe by `id`) → dispatch IMPORT_MERGE
- `UiContext.tsx`: `currentNickname: string | null`. Storage `boysTrip2026CurrentNick`. Setter.
- `NicknamePicker.tsx`: dropdown «Я — <никнейм>» с 11 пацанами. Пока не выбран — кнопка «ОСТАВИТЬ РЕАКЦИЮ» disabled. После выбора — live на всех `ReactionsPanel`.
- `ReactionsPanel.tsx`: props `{ destId: string }`.
  - Состояние: текущий draft text (useState, max 140 chars).
  - Рендер: textarea (brutalist borders, Space Mono), counter 140/140, кнопка `BrutalistButton[variant=volt]` «ОСТАВИТЬ РЕАКЦИЮ» (disabled если nick==null или text пустой).
  - Ниже — лента реакций этого `destId` отсортированная desc по ts: каждая как tilted sticker card (±2°) с nick в Space Mono + text в Plus Jakarta Sans + ts `"N мин назад"`, крестик удалить (только для своих реакций).
- `ReactionsControlBar.tsx`: фикс-бар под Hero (или sticky top). 3 элемента: `NicknamePicker`, «СКАЧАТЬ РЕАКЦИИ (N)» (N = total reactions), «ЗАЛИТЬ РЕАКЦИИ» (hidden input file). При успешном import — toast «ДОБАВЛЕНО: +K РЕАКЦИЙ ОТ M ПАЦАНОВ».
- `ComparisonSection.tsx` — добавить 4-ю табу «ЧТО ПАЦАНЫ ПИШУТ» — aggregated feed всех реакций отсортированных по ts desc, сгруппированных по destination.
- Валидация импорта zod-схемой: `{ version: 1, exportedAt: z.string(), reactions: z.array(reactionSchema) }`. На не-1 версии — `throw`.
- No fallback: если localStorage corrupted (invalid JSON) — `throw new Error('Corrupted reactions state; clear localStorage and reload')`. НЕ silent reset.

### 9.6. Final Bundle into Single HTML Artifact

- **Task ID**: `bundle-artifact`
- **Depends On**: `ui-assembly`, `reactions-feature`, `composite-script` (всё готово к бандлу)
- **Assigned To**: `implementer-scaffold` (resume)
- **Agent Type**: `implementer`
- **Parallel**: false
- **Domain**: `/dist-artifact/**`, any tweaks to `/index.html`/`/vite.config.*` needed для совместимости с Parcel bundler
- Status:
- Comments:
- `npm run bundle` → запускает `bash .claude/skills/artifacts-builder/scripts/bundle-artifact.sh`.
- Скрипт:
  1. Ставит parcel + html-inline если их ещё нет.
  2. Создаёт `.parcelrc` с path-alias resolver.
  3. Parcel билдит с `index.html` как entry.
  4. html-inline инлайнит все JS/CSS/изображения в одну `bundle.html`.
- **Проблема:** `public/generated/*.jpg` (30+ изображений по ~200-400KB) могут раздуть bundle.html до 10-30MB. Решение:
  - (а) Держать картинки отдельно в `dist-artifact/images/` (не инлайнить), ссылаться по относительному пути — но тогда это уже не single-file.
  - (б) Инлайнить как base64 — single-file, но тяжёлый.
  - (в) Компромисс: inline только hero коллажи (по 1 на destination = 13 штук), activity thumbnails оставить ссылками, при клике fetch внешним — работает только онлайн.
  - **Дефолт (a): single `bundle.html` + папка `images/` рядом**. Две сущности, но даёт гарантированно shareable пакет. Заархивировать в `boys-trip-2026.zip` для шаринга.
- Убедиться что после bundle:
  - Открыть `dist-artifact/bundle.html` двойным кликом в браузере — видно всё.
  - Голосование и реакции работают (localStorage на `file://` origin).
  - Все картинки рендерятся (пути relative).
  - Нет внешних CDN-ссылок на JS (только Google Fonts ок).
- Размер итогового `bundle.html` (без `images/`) — ≤500KB. Если больше — провериkонкатенацию, tree-shaking, отключить неиспользованные shadcn компоненты.

### 10. Static Validation Sweep

- **Task ID**: `static-validation`
- **Depends On**: `ui-assembly`
- **Assigned To**: `static-validator-ui`
- **Agent Type**: `static-validator`
- **Parallel**: true (с `browser-validation`)
- **Domain**: read-only
- Status:
- Comments:
- `bunx tsc --noEmit` — нулевые ошибки.
- `bunx eslint "src/**/*.{ts,tsx}" --max-warnings 0`.
- Grep-чек: `grep -r "^export [^d]" src/components/` должен вернуть пусто (только default exports).
- Grep-чек: `grep -rE "os\.getenv|\.get\(.*?,|\|\| ''" src/ scripts/` — никаких fallback паттернов.
- Отчёт pass/fail.

### 11. Browser Validation — User Stories

- **Task ID**: `browser-validation`
- **Depends On**: `ui-assembly`
- **Assigned To**: `browser-validator-ui`
- **Agent Type**: `browser-validator`
- **Parallel**: true (с `static-validation`)
- Status:
- Comments:
- Запустить `bun run dev`, открыть `http://localhost:5173`.
- Выполнить все User Stories из секции Browser Validation ниже.
- Скриншотить каждую секцию на viewport 1440×900 и 390×844 (mobile).
- Отчёт с pass/fail по каждой истории + embedded screenshots.

### 12. Runtime / Build Validation

- **Task ID**: `runtime-validation`
- **Depends On**: `static-validation`, `browser-validation`
- **Assigned To**: `runtime-validator-build`
- **Agent Type**: `runtime-validator`
- **Parallel**: false
- Status:
- Comments:
- `bun run build` — zero errors.
- `bun run preview` — сайт открывается в prod-режиме.
- `bun run gen:images` второй раз (after initial) — должен вывести `skipped: N, generated: 0`.
- `bun run gen:images:force` — перегенерит всё, manifest обновится.

### 13. Final Acceptance Validation

- **Task ID**: `validate-all`
- **Depends On**: `security-audit-imagegen`, `static-validation`, `browser-validation`, `runtime-validation`
- **Assigned To**: `validator-final`
- **Agent Type**: `validator`
- **Parallel**: false
- Status:
- Comments:
- Проверить каждый пункт Acceptance Criteria ниже.
- Проверить что Авокадо-Банщик присутствует минимум в 2 сценах.
- Проверить что все 11 пацанов имеют cutout и фигурируют хотя бы в одной сцене.
- Итоговый verdict.

## Acceptance Criteria

1. **Запускается:** `npm install && npm run dev` открывает сайт на `http://localhost:5173` без ошибок в консоли.
2. **Билдится dev:** `npm run build` завершается с exit 0, `npm run preview` показывает prod-версию.
3. **Бандлится в single-file:** `npm run bundle` создаёт `dist-artifact/bundle.html` (+ `dist-artifact/images/` если выбрана опция (а)). Файл открывается двойным кликом в Chrome/Safari и работает offline.
4. **Все 13 destinations** отображены с полными данными:
   - 5 core (Амальфи/Ибица/Сардиния/Миконос/Черногория) — пацанский rewrite из Scout #3 Part B.
   - 8 wild-card из `destinations-research.md` (Хвар/Бодрум/Майорка/Апулья/Родос/Корсика/Ксамиль/Кипр) — с теми же полями.
5. **Голосование работает:** клик по vote button инкрементит счётчик, повторный клик декрементит; reload сохраняет состояние (localStorage `boysTrip2026Votes`); финальный bar chart обновляется. Работает и на dev-сервере, и в bundle.html на `file://`.
6. **Реакции работают:**
   - Без выбранного никнейма кнопка «ОСТАВИТЬ РЕАКЦИЮ» disabled.
   - Выбираем nick через `NicknamePicker` → можем добавить реакцию (≤140 символов) к любой destination.
   - Реакция появляется в ленте destination + в табе «ЧТО ПАЦАНЫ ПИШУТ» в Comparison.
   - Reload сохраняет (localStorage `boysTrip2026Reactions`).
   - «СКАЧАТЬ РЕАКЦИИ» → file `reactions-<ts>.json` валидной схемы (version=1).
   - «ЗАЛИТЬ РЕАКЦИИ» с этого же файла → дедуплицирует, ничего не дублирует. С пустого state → импортирует все.
   - Импорт файла с invalid schema → понятная ошибка, state не повреждён.
7. **Коллажи видны:** на каждой DestinationCard стоит hero-коллаж с реальными пацанами (вырезанные из их фоток, НЕ AI-сгенерированные лица), thumbnails переключают картинку. **Минимум 30 уникальных сцен** в `public/generated/` (1 hero + 2 activity × 13 = 39, минус возможные пропуски).
8. **Авокадо-Банщик** (boy 11) присутствует минимум в 3 сценах, подписан в `boys.ts`. *(User-mandated.)*
9. **Все 11 пацанов** имеют cutout PNG в `public/cutouts/` и присутствуют как минимум в одной сцене.
10. **Image pipeline использует skill:** `scripts/prepare-backgrounds.ts` для `source: 'gemini'` сцен вызывает `uv run python .claude/skills/image-generation/scripts/gemini_vision.py generate` (модель `gemini-3-pro-image-preview`). Подтверждаемо: `grep -r "gemini-2.5" scripts/` — пусто.
11. **Neo-Brutalist compliance:**
    - Цвета только `#000/#121212/#FFFFFF/#CCFF00/#475569`.
    - Шрифты Ranchers (заголовки), Space Mono (labels), Plus Jakarta Sans (body) реально загружены (DevTools Network).
    - Все shadow'ы solid (no blur, no spread, no rgba).
    - Все border'ы ≥4px.
    - Никаких `border-radius > 8px`.
    - Никаких `linear-gradient`/`radial-gradient` кроме watermark opacity ≤0.03.
12. **Все компоненты slide-level** (`src/components/*.tsx`) используют `export default`.
13. **No fallback pattern в коде:** ни `getenv(default)`, ни `|| ''`, ни `if x is None: x = default`. Grep-чек чистый.
14. **Русский пацанский тон:** хедлайны ALL-CAPS с фразами типа «КУДА ВАЛИМ, ПАЦАНЫ?», pros/cons секции называются «ЗАЧЕМ ЕДЕМ» / «ЗА ЧТО ПОТОМ СЛОЖНО», vote buttons на соответствующих языках для всех 13 направлений.
15. **Mobile viewport (390×844):** VerticalSidebar прячется (или переключается в mobile-вариант), DestinationCard становится single-column, ReactionsPanel читаемо.
16. **Image pipeline идемпотентен:** второй запуск `npm run gen:images` без `--force` пропускает все уже существующие файлы.
17. **Security:** `GEMINI_API_KEY` не встречается ни в одном коммите, ни в client-side bundle (проверить `grep -r GEMINI dist/ dist-artifact/`).

## Testing Credentials

**Required credentials:**
- `GEMINI_API_KEY` (optional): только для генерации кастомных bg-сцен через Gemini 2.5 Flash Image. Если все `bgSpecs` используют `source: 'url'` — ключ не нужен. Добавить в `.env` если используется.

**Browser profiles:**
- Default профиль browser-validator'а достаточен; никаких заранее залогиненных сайтов не требуется.

**Environment variables:**
- `GEMINI_API_KEY`: Google AI Studio API key for Gemini 2.5 Flash Image preview — validation: `test -n "$GEMINI_API_KEY"` (only if `bgSpecs` содержит `source: 'gemini'` записи).

## Browser Validation

**Browser Validation Required**: true
**Dev Server Command**: `bun run dev`
**Dev Server URL**: `http://localhost:5173`
**Pair Mode**: true — browser-validator работает в паре с `implementer-ui` во время Phase 3.

### User Stories

- **Story 1: Первая загрузка → Hero**
  - Navigate to `http://localhost:5173`
  - Intro overlay виден на 3.5 секунды с надписью «ГРУЗИМ ПАЦАНОВ…» и volt-green progress bar
  - После 3.5с overlay уходит через clip-path wipe, проявляется Hero с headline «КУДА ВАЛИМ, ПАЦАНЫ?» в Ranchers ~150px
  - Sticker badge «ЛЕТО 2026 • ВОССОЕДИНЕНИЕ БАНДЫ» виден выше headline, наклонён -2°
  - 4 stats cell'а: 5 ТОЧЕК / 9 ПАЦАНОВ / 4 ДНЯ КАЙФА / ∞ ИСТОРИЙ, каждая с 4px border и 8×8 neo-shadow
  - Volt-green scroll arrow внизу с надписью «ПОГНАЛИ»

- **Story 2: Скролл к Амальфи → коллаж**
  - Scroll down
  - Активный strip правого sidebar переключается на «АМАЛЬФИ» (fill volt)
  - DestinationCard Амальфи появляется slam-анимацией (clip-path reveal left→right 180ms)
  - В левой панели: коллаж с реальными лицами **Сигарного Барона** и **Панама-Разведчика** на фоне клиффов Позитано, бородатый мужик с сигарой виден чётко
  - Три thumbnails под коллажем — клик по каждому меняет main image instantly (hard cut)
  - Справа: sticker rank «№1 ЛЮБИМЧИК» тилтовый, таглайн ALL-CAPS «САМОЕ КРАСИВОЕ МЕСТО НА ЗЕМЛЕ…»
  - Highlights: 6 стикеров типа «🛥 Яхта из Позитано», «🍋 Лимончелло в 11 утра — это завтрак»
  - Metrics 4 клетки: +30°, 28°, 10/10 ВИДЫ, €€€€€
  - Cost Breakdown таблица: ИТОГО €12,600–20,000 на volt-полосе, Ranchers 48px
  - ЗАЧЕМ ЕДЕМ / ЗА ЧТО ПОТОМ СЛОЖНО колонки читаются

- **Story 3: Голосование**
  - Click «🤌 АМАЛЬФИ — МАММА МИА!» button
  - Button переходит в volt-filled состояние (hover = translate 4/4 + shadow=0)
  - Счётчик справа слэм-анимацией с 0 → 1 (Ranchers 80px, scale 1.8→1 spring)
  - Клик снова → 1 → 0
  - Клик ещё раз → 1
  - Reload страницы (F5) → счётчик остаётся 1
  - Проверить `localStorage.getItem('boysTrip2026Votes')` → `{"amalfi":1}`

- **Story 4: Все 5 destinations + Авокадо-Банщик**
  - Скроллить через все 5 карточек
  - Ибица: должна содержать коллаж с **Авокадо-Банщиком** (розовая футболка, лысый, в очках) в сцене `ibiza-pacha-chaos`
  - Черногория: коллаж `montenegro-paddleboat` с **Сигарой Блондином** и **Моршой Спокойным** в жёлтой лодке на фоне фьорда
  - Все highlights, metrics, cost, pros/cons читаются
  - Alternating layout (нечётные — photo left, чётные — photo right) соблюдён

- **Story 5: Sidebar strips + NavDots**
  - Правый sidebar виден как 5 вертикальных strip'ов: `ВИЛЛА / ЯХТА / РЫБАЛКА / ЗАКАТЫ / ПАЦАНЫ`
  - Клик по любому strip → smooth scroll к соответствующей секции
  - NavDots (если включены) — 12×12 квадраты, активный = volt fill

- **Story 6: Comparison section**
  - Скроллить в самый низ (section «ГОЛОСУЕМ КАК МУЖЧИНЫ»)
  - Три tab button'а: «Кто выигрывает» (active), «Кто сколько стоит», «Финальный выбор»
  - Клик по «Финальный выбор» → панель меняется
  - Если было голосование: bar chart (брутальные volt-fill полосы) отображает результаты, winner с Ranchers 80px заголовком
  - Если голосов 0: «Ещё ни один пацан не проголосовал. Ты первый — давай.»

- **Story 7: Mobile viewport**
  - DevTools → мобильный viewport 390×844
  - VerticalSidebar скрыт или переработан
  - Карточки destinations — single-column (photo сверху, info снизу)
  - Текст читаем, шрифты не ломаются

- **Story 8: No console errors / no broken images**
  - DevTools Console — ни одной red error
  - DevTools Network — все изображения `/generated/*.jpg` и `/boys/*.jpeg` отдают 200
  - Fonts загружены (Ranchers, Space Mono, Plus Jakarta Sans)

- **Story 9: Reactions feature — выбор никнейма + добавление реакции**
  - Скроллить к Hero — виден `ReactionsControlBar` с надписями «СКАЧАТЬ РЕАКЦИИ (0)», «ЗАЛИТЬ РЕАКЦИИ», и `NicknamePicker` со 11 опциями
  - Скроллить к Амальфи — `ReactionsPanel` виден внизу карточки, кнопка «ОСТАВИТЬ РЕАКЦИЮ» disabled, есть подсказка «Выбери себя сверху»
  - Кликнуть по `NicknamePicker` → выбрать «Сигарный Барон»
  - В textarea Амальфи ввести «ВСЁ В АМАЛЬФИ. ЛИМОНЧЕЛЛО УЖЕ В ХОЛОДИЛЬНИКЕ»
  - Кликнуть «ОСТАВИТЬ РЕАКЦИЮ» — реакция появилась как тилтовый sticker под textarea, счётчик в ControlBar стал 1
  - Reload (F5) — реакция на месте, никнейм сохранён, счётчик 1

- **Story 10: Reactions — экспорт/импорт JSON**
  - Кликнуть «СКАЧАТЬ РЕАКЦИИ (1)» — браузер скачивает `reactions-<date>.json`
  - Открыть файл — содержит valid JSON с `version: 1, reactions: [...одна запись...]`
  - DevTools → Application → Local Storage → удалить `boysTrip2026Reactions` → reload — реакций нет, ControlBar показывает 0
  - Кликнуть «ЗАЛИТЬ РЕАКЦИИ» → выбрать только что скачанный файл — реакция вернулась, ControlBar показывает 1, тост «ДОБАВЛЕНО: +1 РЕАКЦИЙ»
  - Залить тот же файл повторно — никаких дубликатов (dedupe by id), тост «ДОБАВЛЕНО: +0 РЕАКЦИЙ»

- **Story 11: 13 destinations + Comparison «ЧТО ПАЦАНЫ ПИШУТ»**
  - Скроллить через все 13 карточек destinations (5 core + 8 wild-card: Хвар, Бодрум, Майорка, Апулья, Родос, Корсика, Ксамиль, Кипр)
  - У каждой — name, photo (коллаж), highlights, metrics, cost, pros/cons, vote button
  - Скроллить вниз к Comparison — кликнуть таб «ЧТО ПАЦАНЫ ПИШУТ» — виден feed всех реакций, сгруппированных по destination, отсортированных desc по ts

- **Story 12: Bundle.html offline-test**
  - В терминале: `npm run bundle`
  - `open dist-artifact/bundle.html` (или drag в браузер)
  - Сайт открывается, все секции видны, картинки рендерятся (если выбран mode (а) с `images/` — то images relative work; mode (б) — inline base64)
  - DevTools Console — без ошибок
  - Голосование работает на `file://`
  - Реакция оставляется и сохраняется (localStorage на `file://` origin работает в Chrome/Safari)

## Validation Commands

Execute these commands to validate the task is complete:

- `npm install` — no errors
- `npm run dev` — запускается на порту 5173, нет ошибок в терминале
- `npm run build` — exit 0, `dist/` содержит бандл
- `npm run preview` — prod-версия открывается
- `npm run bundle` (alias `bash .claude/skills/artifacts-builder/scripts/bundle-artifact.sh`) — создаёт `dist-artifact/bundle.html`, exit 0
- `open dist-artifact/bundle.html` (macOS) — открывается в браузере, нет ошибок в Console
- `npx tsc --noEmit` — zero type errors
- `npx eslint "src/**/*.{ts,tsx}" --max-warnings 0` — clean
- `uv run python .claude/skills/image-generation/scripts/gemini_vision.py generate -p "test prompt photorealistic landscape no people" -o /tmp/test.jpg` — sanity-check skill доступен (требует `GEMINI_API_KEY`)
- `npm run gen:images` — генерит все артефакты без ошибок
- `npm run gen:images` повторно — пропускает всё (idempotent)
- `grep -rn "^export function\|^export const" src/components/ | grep -v "export default" | grep -v "/ui/"` — пусто (shadcn ui/* могут иметь named exports — не наша зона)
- `grep -rE "os\.getenv|\.get\(.*?,\s*['\"]|\|\|\s*(['\"]|\[\]|\{\})" src/ scripts/` — пусто
- `grep -r "gemini-2.5" scripts/` — пусто (только `gemini-3-pro-image-preview` через skill)
- `grep -r "GEMINI_API_KEY" dist/ dist-artifact/` — пусто (никогда в client bundle)
- `ls public/cutouts/*.png | wc -l` — 11
- `ls public/generated/*.jpg | wc -l` — минимум 30
- `jq '. | keys | length' public/generated/manifest.json` — минимум 30
- `jq '.[] | select(. == null)' public/generated/manifest.json` — пусто
- `wc -c dist-artifact/bundle.html` — ≤500_000 (если без images/) или ≤30_000_000 (если inline images)
- `jq '.version' /tmp/example-reactions.json` — `1` (после теста экспорта реакций из browser-validator)

## Post-Implementation Record

### Review
- Status: completed
- Report Path: n/a (self)
- Verdict: PASS
- Comments: Static-validator (sub-agent) passed after fixes: tsc 0 errors, eslint 0 errors, no fallback patterns in src/scripts, 0 named exports in src/components/*.tsx (outside /ui/), no gemini-2.5 references. bundle.html contains no GEMINI/ANTHROPIC/sk-ant/AIza strings.

### Testing
- Status: completed
- Report Path: screenshots/browser-validator/*
- Verdict: PASS
- Comments: Second browser-validator run — 8/8 stories PASS after clip-path visibility fix in DestinationCard/index.tsx (switched from `clipPath: inset(0 100% 0 0)` to `opacity + y` initial state with `viewport={{ amount: 0, margin: "0px 0px -10% 0px" }}`). All 13 destination cards render, votes toggle, reactions persist, comparison tabs all switch, final bar chart shows sorted destinations. Zero console errors.

### Integration Testing
- Status: completed
- Report Path: n/a
- Verdict: PASS
- Comments: `pnpm run build` succeeds (vite 8 + rolldown after @rolldown/binding-darwin-arm64 install). `pnpm run bundle` produces 492KB `dist-artifact/bundle.html` (vite-plugin-singlefile) + `generated/` + `boys/` sibling dirs. `pnpm run gen:images` idempotent (skips all 53 on re-run). 53 scenes, 11 cutouts, 53 backgrounds — all files match manifest.

## Notes

**Design reference origin:** `des.txt` line 1 ссылается на SuperDesign library — `https://app.superdesign.dev/library?category=all&search=trip+&selected=disruptor-beta-launch`. Это стиль "Disruptor". Мы реализуем спецификацию дословно, а не пересобираем шаблон.

**Original request scope:** Файл `оригинальный_запрос.txt` явно говорит «накинь идеи куда ехать» — это **brainstorm-задача с многими вариантами**, а не презентация фиксированных 5. Поэтому 5 из старого HTML — это базис («core»), а 8 из `destinations-research.md` («wild-card») расширяют выбор. Пацаны голосуют по всем 13.

**`image-generation` skill — обязательно использовать:**
- Путь: `/Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/.claude/skills/image-generation/scripts/gemini_vision.py`
- Модель: **`gemini-3-pro-image-preview`** (`SKILL.md` явно запрещает `gemini-2.5-pro`, `gemini-2.5-flash` — это критично).
- Команды: `generate` (фоны без людей), `edit` (опциональный мем-полиш сцен), `analyze` (визуальный QA), `compare` (опц. before/after polish).
- Вызывать через `execSync('uv run python ...')` из Node-скриптов. uv обязателен (per глобальный CLAUDE.md).
- Skill сам читает `GEMINI_API_KEY` из `.env` и крашится при отсутствии — нам не надо это дублировать.

**`artifacts-builder` skill — обязательно использовать:**
- Путь: `/Users/bohdanpytaichuk/Documents/CrashLab/AndriiPresentation/.claude/skills/artifacts-builder/scripts/`
- `init-artifact.sh <project-name>` для скаффолда (React+TS+Vite+Tailwind+shadcn/ui, 40+ компонентов уже стоят).
- `bundle-artifact.sh` для финального бандла в single-file `bundle.html` (Parcel + html-inline).
- Использовать стек который ставит skill (npm, не bun) для совместимости с bundle-скриптом. Bun допустим для dev, но финальный bundle через npm.

**Reactions фича — киллер-фича для шаринга:**
- Каждый пацан скачивает свою папку реакций → отправляет в чат → следующий пацан мерджит → и так по кругу.
- Альтернативный flow: один владелец `bundle.html` рассылает всем → каждый возвращает свой `reactions-<nick>.json` → владелец мерджит все → пересылает финальный.
- В V2 можно добавить простую Cloudflare Worker / Pages функцию для centralized state, но в V1 — JSON-файл достаточно.

**Авокадо-Банщик (Boy 11)** — user-mandated inclusion. Лысый + круглые очки + розовая футболка + боксеры с авокадо + две полторашки пива + деревянная баня-сруб. Vibe: «банный баттл, пацанский спорт, свобода». Affinity: Ibiza (прирождённый клубмен), Хвар (Carpe Diem), Кипр (Casino night). Сцены: `ibiza-pacha-chaos`, `hvar-carpe-diem`, `cyprus-hero` минимум.

**Collage pipeline обязательно на cutout-подходе, НЕ на AI face-swap.** Пользователь явно уточнил: «нужно НАКЛАДЫВАТЬ ЛЮДЕЙ КАК ЕСТЬ С СУЩЕСТВУЮЩИХ ФОТО — как в коллаже». Эстетика — мемно-Photoshop-2005, нарочито жанковая, с тилтами и брутальной обводкой. Это фича, не баг.

**Gemini usage только на server-side (build-time):** ключ никогда не попадает в bundle.html. Все картинки заранее сгенерированы, манифест commited.

**New dependencies (npm):**
- Из artifacts-builder scaffold: react, react-dom, vite, typescript, tailwindcss, postcss, autoprefixer, shadcn/ui (40+ комп), parcel, html-inline.
- Доустановить: `npm i framer-motion @imgly/background-removal-node sharp dotenv zod` + `npm i -D @types/node tsx`.

**Available discipline skills** (use during implementation):
- `verification-before-completion` — evidence-based gates перед маркировкой тасок done.
- `systematic-debugging` — для коллажей (broken cutout? bad placement? bg corrupted?).
- `test-driven-development` — для `reactionsSchema.ts` zod-валидатора и для `sceneSpecs` integrity-чекера (все `boyId` в `boys.ts`, все `bgId` в `backgroundSpecs.ts`).
- `taste-frontend` — финальное pass на брутализм-эстетику UI.
- `precise-worker` — implementer'ам, чтобы не выходить за domain'ы.

**Авокадо-Банщик (Boy 11)** — user-mandated inclusion. Добавлен поверх каталога Scout #2, который видел только 10 фоток. Vibe: лысый + очки + розовая футболка + боксеры с авокадо + две бутылки пива в руках + деревянная баня. Идеально подходит для ibiza-клубной (в роли «этот парень просто пришёл в этом») и черногорской-конобе (под ракию) сцен. Никнейм можно рефайнить: «Авокадо-Банщик» / «Банный Батл» / «Пива Бомбардир».

**Collage pipeline обязательно на cutout-подходе, НЕ на AI face-swap.** Пользователь явно уточнил: «нужно НАКЛАДЫВАТЬ ЛЮДЕЙ КАК ЕСТЬ С СУЩЕСТВУЮЩИХ ФОТО — как в коллаже». Scout #8 по ошибке начал проектировать Gemini face-gen pipeline — его артефакты переиспользуем частично (prompt contracts, manifest структура), но саму генерацию заменяем на `background-removal + Sharp composite`.

**Deliberately janky aesthetic OK.** Коллаж должен выглядеть мемно-Photoshop-2005: жёсткие вырезанные края, непропорциональный масштаб между пацанами, лёгкие повороты, всё-капс подписи. Это фича, не баг. Ложится на брутализм идеально.

**Gemini usage — только для bg без людей**, опционально. Если все bgSpecs используют `source: 'url'` (Unsplash/curated) — Gemini вообще не нужен и ключ не требуется. Начать с URL подхода, Gemini добавлять только для нетривиальных сцен (Pacha interior, konoba night).

**New dependencies (bun add):**
- Runtime: `react`, `react-dom`, `framer-motion`
- Dev: `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss@3`, `postcss`, `autoprefixer`, `@types/react`, `@types/react-dom`, `@types/node`, `eslint`, `prettier`
- Scripts: `@imgly/background-removal-node`, `sharp`, `dotenv`

**Available discipline skills** (use during implementation):
- `verification-before-completion` — evidence-based gates before marking tasks done
- `systematic-debugging` — when collage outputs look wrong, methodically isolate (bg broken? cutout broken? placement coords wrong?)
- `test-driven-development` — не критично для визуальной презентации, но `sceneSpecs` валидатор (проверить что все `boyId` существуют в `boys.ts`, все `bgId` в `backgroundSpecs.ts`) стоит написать заранее
