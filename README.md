# BOYS TRIP 2026 — Neo-Brutalist React Proposal Site

Презентация-сайт на 13 направлений в Средиземноморье для 9 пацанов. Neo-Brutalist стиль (Disruptor), пацанский тон, голосование, реакции, коллажи с вырезанными пацанами на процедурных фонах.

## Стек

- React 19 + TypeScript + Vite 8 + Tailwind 3 + shadcn/ui
- framer-motion для slam-анимаций
- sharp + @imgly/background-removal-node для генерации коллажей
- zod для валидации импорта реакций
- pnpm (через локальный `artifacts-builder` skill)

## Запуск

```bash
pnpm install
pnpm run dev           # http://localhost:5173
```

## Генерация коллажей

Изображения генерируются один раз перед первым запуском. Коммитятся в `public/generated/`.

```bash
pnpm run prep:cutouts      # 11 boys → public/cutouts/*.png (background removal)
pnpm run prep:bg           # 53 procedural brutalist backgrounds → public/backgrounds/*.jpg
pnpm run comp:scenes       # 53 collages → public/generated/*.jpg + manifest.json
pnpm run gen:images        # все шаги сразу
pnpm run gen:images:force  # перегенерация с нуля
```

## Сборка

```bash
pnpm run build             # dist/ — production бандл
pnpm run preview           # проверка prod билда
pnpm run lint              # eslint
```

## Bundle (single-file HTML артефакт)

```bash
pnpm run bundle            # через artifacts-builder skill
```

## Структура

```
src/
  components/              # все слайды (default export каждый)
    DestinationCard/       # подкомпоненты карточки направления
    ui/                    # shadcn/ui (40+, не трогаем)
  context/                 # VoteContext, ReactionsContext, UiContext
  data/                    # destinations, boys, sceneSpecs, backgroundSpecs, reactionsSchema
  hooks/                   # useSectionObserver, useCursor
  types/                   # TypeScript interfaces
scripts/                   # prepare-cutouts, prepare-backgrounds, composite-scenes, gen-all
public/
  boys/                    # исходные JPG (11 штук, короткие имена)
  cutouts/                 # PNG с прозрачным фоном (background removal)
  backgrounds/             # процедурные brutalist фоны (SVG → JPG через Sharp)
  generated/               # финальные коллажи + manifest.json
```

## Реакции — как шарить

1. Один пацан — владелец bundle.html. Рассылает всем.
2. Каждый выбирает себя в `NicknamePicker`, оставляет реакции на каждом направлении.
3. Каждый жмёт «СКАЧАТЬ РЕАКЦИИ» → получает `reactions-<date>.json`.
4. Владелец импортирует все присланные файлы через «ЗАЛИТЬ РЕАКЦИИ». Дубли отбрасываются по `id`.

## No fallback policy

Отсутствие обязательного поля → crash с понятным сообщением. Никаких silent defaults.
