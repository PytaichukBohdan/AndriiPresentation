import type { SceneSpec } from "@/types/scene";

// All scenes composite 2–4 boy cutouts onto a procedural background.
// Placements in normalized 0..1 coordinates (x,y = top-left anchor of cutout).
// scaleW = cutout width as fraction of canvas width.
export const SCENES: SceneSpec[] = [
  // ===== AMALFI =====
  {
    id: "amalfi-hero",
    destinationId: "amalfi",
    bgId: "amalfi-coast",
    caption: "МАММА МИА!",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "03-sigarny-baron", x: 0.05, y: 0.25, scaleW: 0.34, rotate: -3, zIndex: 2 },
      { boyId: "02-panama-razvedchik", x: 0.56, y: 0.2, scaleW: 0.35, rotate: 4, zIndex: 1 },
    ],
  },
  {
    id: "amalfi-lemon-terrace",
    destinationId: "amalfi",
    bgId: "amalfi-lemons",
    caption: "ЛИМОНЧЕЛЛО В 11 УТРА",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "06-lyonya-pereulka", x: 0.08, y: 0.22, scaleW: 0.36, rotate: 2, zIndex: 1 },
      { boyId: "09-ulybka-off-white", x: 0.55, y: 0.24, scaleW: 0.34, rotate: -3, zIndex: 2 },
    ],
  },
  {
    id: "amalfi-grot",
    destinationId: "amalfi",
    bgId: "amalfi-grot",
    caption: "ПРЫЖОК С ЯХТЫ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "05-morsha-spokoyny", x: 0.12, y: 0.2, scaleW: 0.35, rotate: -4, zIndex: 1 },
      { boyId: "03-sigarny-baron", x: 0.55, y: 0.26, scaleW: 0.34, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "amalfi-positano-steps",
    destinationId: "amalfi",
    bgId: "amalfi-stairs",
    caption: "ЛЕСТНИЦА ИЗ ТЫСЯЧИ СТУПЕНЕЙ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.07, y: 0.2, scaleW: 0.32, rotate: 2, zIndex: 1 },
      { boyId: "06-lyonya-pereulka", x: 0.38, y: 0.25, scaleW: 0.3, rotate: -2, zIndex: 2 },
      { boyId: "09-ulybka-off-white", x: 0.65, y: 0.22, scaleW: 0.32, rotate: 3, zIndex: 3 },
    ],
  },

  // ===== IBIZA =====
  {
    id: "ibiza-hero",
    destinationId: "ibiza",
    bgId: "ibiza-coast",
    caption: "ДО РАССВЕТА",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "01-kepka-balansyaga", x: 0.06, y: 0.22, scaleW: 0.35, rotate: -3, zIndex: 1 },
      { boyId: "04-usaty-rozovye-ochki", x: 0.55, y: 0.25, scaleW: 0.35, rotate: 4, zIndex: 2 },
    ],
  },
  {
    id: "ibiza-pacha-chaos",
    destinationId: "ibiza",
    bgId: "ibiza-pacha",
    caption: "СРЕДА В ПАЧЕ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "08-stil-zapreschyonnykh", x: 0.06, y: 0.18, scaleW: 0.3, rotate: -2, zIndex: 1 },
      { boyId: "11-avokado-banschik", x: 0.36, y: 0.22, scaleW: 0.32, rotate: 3, zIndex: 2 },
      { boyId: "01-kepka-balansyaga", x: 0.66, y: 0.2, scaleW: 0.3, rotate: -4, zIndex: 3 },
    ],
  },
  {
    id: "ibiza-beach-club",
    destinationId: "ibiza",
    bgId: "ibiza-beach",
    caption: "БИЧ-КЛУБ FORMENTERA",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "04-usaty-rozovye-ochki", x: 0.08, y: 0.26, scaleW: 0.34, rotate: 2, zIndex: 1 },
      { boyId: "07-tsar-garazha", x: 0.55, y: 0.22, scaleW: 0.35, rotate: -3, zIndex: 2 },
    ],
  },
  {
    id: "ibiza-sunset-vedra",
    destinationId: "ibiza",
    bgId: "ibiza-vedra",
    caption: "ЗАКАТ У СКАЛЫ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "01-kepka-balansyaga", x: 0.1, y: 0.25, scaleW: 0.33, rotate: -2, zIndex: 1 },
      { boyId: "08-stil-zapreschyonnykh", x: 0.55, y: 0.22, scaleW: 0.34, rotate: 3, zIndex: 2 },
    ],
  },

  // ===== SARDINIA =====
  {
    id: "sardinia-hero",
    destinationId: "sardinia",
    bgId: "sardinia-coast",
    caption: "КАРИБЫ ЕВРОПЫ",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "03-sigarny-baron", x: 0.06, y: 0.22, scaleW: 0.35, rotate: -3, zIndex: 2 },
      { boyId: "10-sigara-blondin", x: 0.55, y: 0.24, scaleW: 0.35, rotate: 4, zIndex: 1 },
    ],
  },
  {
    id: "sardinia-yacht-deck",
    destinationId: "sardinia",
    bgId: "sardinia-yacht",
    caption: "ВЕРМАНТИНО НА БОРТУ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "07-tsar-garazha", x: 0.08, y: 0.22, scaleW: 0.32, rotate: 2, zIndex: 1 },
      { boyId: "10-sigara-blondin", x: 0.38, y: 0.25, scaleW: 0.3, rotate: -3, zIndex: 2 },
      { boyId: "03-sigarny-baron", x: 0.64, y: 0.2, scaleW: 0.32, rotate: 3, zIndex: 3 },
    ],
  },
  {
    id: "sardinia-maddalena",
    destinationId: "sardinia",
    bgId: "sardinia-maddalena",
    caption: "МАДДАЛЕНА, ПРЫЖОК",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.1, y: 0.22, scaleW: 0.36, rotate: 3, zIndex: 1 },
      { boyId: "05-morsha-spokoyny", x: 0.55, y: 0.25, scaleW: 0.34, rotate: -2, zIndex: 2 },
    ],
  },
  {
    id: "sardinia-porto-cervo-dinner",
    destinationId: "sardinia",
    bgId: "sardinia-cervo",
    caption: "BILLIONAIRE NIGHT",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "03-sigarny-baron", x: 0.08, y: 0.2, scaleW: 0.34, rotate: -2, zIndex: 1 },
      { boyId: "09-ulybka-off-white", x: 0.54, y: 0.23, scaleW: 0.34, rotate: 3, zIndex: 2 },
    ],
  },

  // ===== MYKONOS =====
  {
    id: "mykonos-hero",
    destinationId: "mykonos",
    bgId: "mykonos-coast",
    caption: "ОПА-ОПА!",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "09-ulybka-off-white", x: 0.06, y: 0.22, scaleW: 0.35, rotate: -3, zIndex: 2 },
      { boyId: "04-usaty-rozovye-ochki", x: 0.55, y: 0.25, scaleW: 0.35, rotate: 4, zIndex: 1 },
    ],
  },
  {
    id: "mykonos-windmills-pose",
    destinationId: "mykonos",
    bgId: "mykonos-windmills",
    caption: "МЕЛЬНИЦЫ — ГЛАВНОЕ ФОТО",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "09-ulybka-off-white", x: 0.1, y: 0.22, scaleW: 0.33, rotate: 2, zIndex: 1 },
      { boyId: "01-kepka-balansyaga", x: 0.55, y: 0.24, scaleW: 0.33, rotate: -3, zIndex: 2 },
    ],
  },
  {
    id: "mykonos-white-alleys",
    destinationId: "mykonos",
    bgId: "mykonos-alleys",
    caption: "ЛАБИРИНТ ХОРЫ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "08-stil-zapreschyonnykh", x: 0.1, y: 0.2, scaleW: 0.35, rotate: -2, zIndex: 1 },
      { boyId: "04-usaty-rozovye-ochki", x: 0.55, y: 0.25, scaleW: 0.34, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "mykonos-scorpios",
    destinationId: "mykonos",
    bgId: "mykonos-scorpios",
    caption: "СКОРПИОС НА ЗАКАТ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "09-ulybka-off-white", x: 0.08, y: 0.23, scaleW: 0.33, rotate: -2, zIndex: 1 },
      { boyId: "01-kepka-balansyaga", x: 0.55, y: 0.22, scaleW: 0.35, rotate: 3, zIndex: 2 },
    ],
  },

  // ===== MONTENEGRO =====
  {
    id: "montenegro-hero",
    destinationId: "montenegro",
    bgId: "montenegro-bay",
    caption: "РАКИЯ ЕСТЬ",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.06, y: 0.22, scaleW: 0.36, rotate: -3, zIndex: 2 },
      { boyId: "05-morsha-spokoyny", x: 0.56, y: 0.24, scaleW: 0.34, rotate: 3, zIndex: 1 },
    ],
  },
  {
    id: "montenegro-kotor-walls",
    destinationId: "montenegro",
    bgId: "montenegro-walls",
    caption: "1350 СТУПЕНЕЙ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "06-lyonya-pereulka", x: 0.1, y: 0.25, scaleW: 0.34, rotate: 2, zIndex: 1 },
      { boyId: "05-morsha-spokoyny", x: 0.55, y: 0.22, scaleW: 0.34, rotate: -3, zIndex: 2 },
    ],
  },
  {
    id: "montenegro-paddleboat",
    destinationId: "montenegro",
    bgId: "montenegro-boat",
    caption: "ФЬОРД ВЕСЬ ДЕНЬ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "05-morsha-spokoyny", x: 0.1, y: 0.22, scaleW: 0.33, rotate: -2, zIndex: 1 },
      { boyId: "10-sigara-blondin", x: 0.55, y: 0.25, scaleW: 0.33, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "montenegro-porto-dinner",
    destinationId: "montenegro",
    bgId: "montenegro-porto",
    caption: "PORTO MONTENEGRO",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.08, y: 0.22, scaleW: 0.34, rotate: 3, zIndex: 1 },
      { boyId: "06-lyonya-pereulka", x: 0.55, y: 0.24, scaleW: 0.34, rotate: -2, zIndex: 2 },
    ],
  },

  // ===== HVAR =====
  {
    id: "hvar-hero",
    destinationId: "hvar",
    bgId: "hvar-island",
    caption: "ПАКЛЕНИ, ПОГНАЛИ",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.06, y: 0.22, scaleW: 0.35, rotate: -3, zIndex: 1 },
      { boyId: "08-stil-zapreschyonnykh", x: 0.55, y: 0.25, scaleW: 0.35, rotate: 4, zIndex: 2 },
    ],
  },
  {
    id: "hvar-carpe-diem",
    destinationId: "hvar",
    bgId: "hvar-carpe",
    caption: "CARPE DIEM BEACH",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "11-avokado-banschik", x: 0.08, y: 0.24, scaleW: 0.34, rotate: -2, zIndex: 2 },
      { boyId: "04-usaty-rozovye-ochki", x: 0.55, y: 0.22, scaleW: 0.34, rotate: 3, zIndex: 1 },
    ],
  },
  {
    id: "hvar-pakleni-yacht",
    destinationId: "hvar",
    bgId: "hvar-pakleni",
    caption: "ЯХТА ПО ПАКЛЕНИ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "08-stil-zapreschyonnykh", x: 0.1, y: 0.22, scaleW: 0.33, rotate: 2, zIndex: 1 },
      { boyId: "07-tsar-garazha", x: 0.55, y: 0.25, scaleW: 0.33, rotate: -3, zIndex: 2 },
    ],
  },
  {
    id: "hvar-fortress-sunset",
    destinationId: "hvar",
    bgId: "hvar-fortress",
    caption: "ЗАКАТ СО СТЕН",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.08, y: 0.22, scaleW: 0.32, rotate: -2, zIndex: 1 },
      { boyId: "06-lyonya-pereulka", x: 0.38, y: 0.25, scaleW: 0.3, rotate: 2, zIndex: 2 },
      { boyId: "09-ulybka-off-white", x: 0.66, y: 0.23, scaleW: 0.3, rotate: -3, zIndex: 3 },
    ],
  },

  // ===== BODRUM =====
  {
    id: "bodrum-hero",
    destinationId: "bodrum",
    bgId: "bodrum-coast",
    caption: "ГУЛЕТ ЖДЁТ",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "03-sigarny-baron", x: 0.07, y: 0.22, scaleW: 0.35, rotate: -2, zIndex: 1 },
      { boyId: "10-sigara-blondin", x: 0.55, y: 0.24, scaleW: 0.35, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "bodrum-gulet-deck",
    destinationId: "bodrum",
    bgId: "bodrum-gulet",
    caption: "3 ДНЯ В БУХТАХ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "07-tsar-garazha", x: 0.08, y: 0.22, scaleW: 0.32, rotate: 2, zIndex: 1 },
      { boyId: "10-sigara-blondin", x: 0.38, y: 0.25, scaleW: 0.3, rotate: -2, zIndex: 2 },
      { boyId: "09-ulybka-off-white", x: 0.66, y: 0.22, scaleW: 0.3, rotate: 3, zIndex: 3 },
    ],
  },
  {
    id: "bodrum-bar-street",
    destinationId: "bodrum",
    bgId: "bodrum-bar",
    caption: "HALIKARNAS НОЧЬЮ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "09-ulybka-off-white", x: 0.08, y: 0.23, scaleW: 0.33, rotate: -3, zIndex: 1 },
      { boyId: "10-sigara-blondin", x: 0.55, y: 0.22, scaleW: 0.34, rotate: 2, zIndex: 2 },
    ],
  },
  {
    id: "bodrum-castle",
    destinationId: "bodrum",
    bgId: "bodrum-castle",
    caption: "ЗАМОК РЫЦАРЕЙ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.1, y: 0.22, scaleW: 0.34, rotate: 3, zIndex: 1 },
      { boyId: "03-sigarny-baron", x: 0.56, y: 0.24, scaleW: 0.34, rotate: -2, zIndex: 2 },
    ],
  },

  // ===== MALLORCA =====
  {
    id: "mallorca-hero",
    destinationId: "mallorca",
    bgId: "mallorca-coast",
    caption: "ВАМОС!",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "07-tsar-garazha", x: 0.06, y: 0.22, scaleW: 0.34, rotate: -3, zIndex: 1 },
      { boyId: "01-kepka-balansyaga", x: 0.55, y: 0.25, scaleW: 0.35, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "mallorca-serra-tramuntana",
    destinationId: "mallorca",
    bgId: "mallorca-tramuntana",
    caption: "СКАЛЫ НА ЗАКАТ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "05-morsha-spokoyny", x: 0.1, y: 0.22, scaleW: 0.33, rotate: 2, zIndex: 1 },
      { boyId: "07-tsar-garazha", x: 0.55, y: 0.24, scaleW: 0.34, rotate: -3, zIndex: 2 },
    ],
  },
  {
    id: "mallorca-es-trenc",
    destinationId: "mallorca",
    bgId: "mallorca-estrenc",
    caption: "ПЛЯЖ ES TRENC",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "01-kepka-balansyaga", x: 0.08, y: 0.24, scaleW: 0.34, rotate: -2, zIndex: 1 },
      { boyId: "04-usaty-rozovye-ochki", x: 0.55, y: 0.22, scaleW: 0.34, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "mallorca-andratx-night",
    destinationId: "mallorca",
    bgId: "mallorca-andratx",
    caption: "ANDRATX — МАРИНА",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "07-tsar-garazha", x: 0.08, y: 0.22, scaleW: 0.33, rotate: 3, zIndex: 1 },
      { boyId: "03-sigarny-baron", x: 0.55, y: 0.24, scaleW: 0.34, rotate: -2, zIndex: 2 },
    ],
  },

  // ===== PUGLIA =====
  {
    id: "puglia-hero",
    destinationId: "puglia",
    bgId: "puglia-coast",
    caption: "ОРЕКЬЕТТЕ ЖДУТ",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "06-lyonya-pereulka", x: 0.06, y: 0.22, scaleW: 0.34, rotate: -2, zIndex: 1 },
      { boyId: "03-sigarny-baron", x: 0.55, y: 0.24, scaleW: 0.35, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "puglia-trulli",
    destinationId: "puglia",
    bgId: "puglia-trulli",
    caption: "АЛЬБЕРОБЕЛЛО",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.1, y: 0.22, scaleW: 0.32, rotate: 2, zIndex: 1 },
      { boyId: "09-ulybka-off-white", x: 0.38, y: 0.25, scaleW: 0.3, rotate: -3, zIndex: 2 },
      { boyId: "06-lyonya-pereulka", x: 0.66, y: 0.22, scaleW: 0.3, rotate: 3, zIndex: 3 },
    ],
  },
  {
    id: "puglia-salento-sea",
    destinationId: "puglia",
    bgId: "puglia-salento",
    caption: "ПОЛИНЬЯНО — ГРОТ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "06-lyonya-pereulka", x: 0.1, y: 0.24, scaleW: 0.34, rotate: -2, zIndex: 1 },
      { boyId: "05-morsha-spokoyny", x: 0.55, y: 0.22, scaleW: 0.34, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "puglia-masseria-dinner",
    destinationId: "puglia",
    bgId: "puglia-masseria",
    caption: "УЖИН НА МАСЕРИИ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "03-sigarny-baron", x: 0.08, y: 0.22, scaleW: 0.33, rotate: 2, zIndex: 1 },
      { boyId: "10-sigara-blondin", x: 0.55, y: 0.25, scaleW: 0.33, rotate: -2, zIndex: 2 },
    ],
  },

  // ===== RHODES =====
  {
    id: "rhodes-hero",
    destinationId: "rhodes",
    bgId: "rhodes-coast",
    caption: "ДАВАЙ, ОПА!",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.06, y: 0.22, scaleW: 0.34, rotate: -3, zIndex: 1 },
      { boyId: "04-usaty-rozovye-ochki", x: 0.55, y: 0.24, scaleW: 0.35, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "rhodes-old-town",
    destinationId: "rhodes",
    bgId: "rhodes-oldtown",
    caption: "ВОРОТА РЫЦАРЕЙ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.1, y: 0.22, scaleW: 0.33, rotate: 2, zIndex: 1 },
      { boyId: "08-stil-zapreschyonnykh", x: 0.55, y: 0.25, scaleW: 0.33, rotate: -3, zIndex: 2 },
    ],
  },
  {
    id: "rhodes-lindos",
    destinationId: "rhodes",
    bgId: "rhodes-lindos",
    caption: "АКРОПОЛЬ ЛИНДОСА",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "05-morsha-spokoyny", x: 0.1, y: 0.22, scaleW: 0.33, rotate: -2, zIndex: 1 },
      { boyId: "09-ulybka-off-white", x: 0.55, y: 0.24, scaleW: 0.34, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "rhodes-faliraki",
    destinationId: "rhodes",
    bgId: "rhodes-faliraki",
    caption: "ФАЛИРАКИ ДО УТРА",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "04-usaty-rozovye-ochki", x: 0.08, y: 0.22, scaleW: 0.34, rotate: 3, zIndex: 1 },
      { boyId: "01-kepka-balansyaga", x: 0.55, y: 0.24, scaleW: 0.34, rotate: -2, zIndex: 2 },
    ],
  },

  // ===== CORSICA =====
  {
    id: "corsica-hero",
    destinationId: "corsica",
    bgId: "corsica-coast",
    caption: "АЛЛЕ!",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "03-sigarny-baron", x: 0.06, y: 0.22, scaleW: 0.34, rotate: -2, zIndex: 1 },
      { boyId: "02-panama-razvedchik", x: 0.55, y: 0.24, scaleW: 0.34, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "corsica-scandola",
    destinationId: "corsica",
    bgId: "corsica-scandola",
    caption: "SCANDOLA С ВОДЫ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.1, y: 0.22, scaleW: 0.33, rotate: 3, zIndex: 1 },
      { boyId: "10-sigara-blondin", x: 0.55, y: 0.25, scaleW: 0.34, rotate: -2, zIndex: 2 },
    ],
  },
  {
    id: "corsica-palombaggia",
    destinationId: "corsica",
    bgId: "corsica-palombaggia",
    caption: "ПЛЯЖ PALOMBAGGIA",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "05-morsha-spokoyny", x: 0.1, y: 0.24, scaleW: 0.33, rotate: -3, zIndex: 1 },
      { boyId: "07-tsar-garazha", x: 0.55, y: 0.22, scaleW: 0.34, rotate: 2, zIndex: 2 },
    ],
  },
  {
    id: "corsica-porto-vecchio",
    destinationId: "corsica",
    bgId: "corsica-portovecchio",
    caption: "УЖИН НА МАРИНЕ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "03-sigarny-baron", x: 0.08, y: 0.22, scaleW: 0.34, rotate: 3, zIndex: 1 },
      { boyId: "06-lyonya-pereulka", x: 0.55, y: 0.25, scaleW: 0.33, rotate: -2, zIndex: 2 },
    ],
  },

  // ===== KSAMIL =====
  {
    id: "ksamil-hero",
    destinationId: "ksamil",
    bgId: "ksamil-coast",
    caption: "МАЛЬДИВЫ ЗА ТРЁШКУ",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "06-lyonya-pereulka", x: 0.06, y: 0.22, scaleW: 0.34, rotate: -2, zIndex: 1 },
      { boyId: "11-avokado-banschik", x: 0.55, y: 0.25, scaleW: 0.35, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "ksamil-sunken-ship",
    destinationId: "ksamil",
    bgId: "ksamil-shipwreck",
    caption: "ЗАТОНУВШИЙ КОРАБЛЬ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "05-morsha-spokoyny", x: 0.1, y: 0.22, scaleW: 0.33, rotate: 3, zIndex: 1 },
      { boyId: "07-tsar-garazha", x: 0.55, y: 0.24, scaleW: 0.34, rotate: -3, zIndex: 2 },
    ],
  },
  {
    id: "ksamil-butrint",
    destinationId: "ksamil",
    bgId: "ksamil-butrint",
    caption: "РУИНЫ БУТРИНТА",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "02-panama-razvedchik", x: 0.1, y: 0.22, scaleW: 0.33, rotate: -2, zIndex: 1 },
      { boyId: "06-lyonya-pereulka", x: 0.55, y: 0.24, scaleW: 0.34, rotate: 3, zIndex: 2 },
    ],
  },
  {
    id: "ksamil-saranda-night",
    destinationId: "ksamil",
    bgId: "ksamil-saranda",
    caption: "САРАНДА НОЧЬЮ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "08-stil-zapreschyonnykh", x: 0.1, y: 0.23, scaleW: 0.33, rotate: 2, zIndex: 1 },
      { boyId: "10-sigara-blondin", x: 0.55, y: 0.22, scaleW: 0.34, rotate: -3, zIndex: 2 },
    ],
  },

  // ===== CYPRUS =====
  {
    id: "cyprus-hero",
    destinationId: "cyprus",
    bgId: "cyprus-coast",
    caption: "СТАВИМ НА ЧЁРНОЕ",
    kind: "hero",
    aspectRatio: "4:3",
    boys: [
      { boyId: "11-avokado-banschik", x: 0.06, y: 0.22, scaleW: 0.35, rotate: -2, zIndex: 2 },
      { boyId: "03-sigarny-baron", x: 0.55, y: 0.24, scaleW: 0.34, rotate: 3, zIndex: 1 },
    ],
  },
  {
    id: "cyprus-blue-lagoon",
    destinationId: "cyprus",
    bgId: "cyprus-bluelagoon",
    caption: "ГОЛУБАЯ ЛАГУНА",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "05-morsha-spokoyny", x: 0.1, y: 0.22, scaleW: 0.33, rotate: 3, zIndex: 1 },
      { boyId: "08-stil-zapreschyonnykh", x: 0.55, y: 0.24, scaleW: 0.33, rotate: -2, zIndex: 2 },
    ],
  },
  {
    id: "cyprus-marina-night",
    destinationId: "cyprus",
    bgId: "cyprus-marina",
    caption: "МАРИНА И КАЗИНО",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "03-sigarny-baron", x: 0.1, y: 0.22, scaleW: 0.34, rotate: -3, zIndex: 1 },
      { boyId: "09-ulybka-off-white", x: 0.55, y: 0.24, scaleW: 0.34, rotate: 2, zIndex: 2 },
    ],
  },
  {
    id: "cyprus-ayianapa",
    destinationId: "cyprus",
    bgId: "cyprus-ayianapa",
    caption: "АЙЯ-НАПА КЛУБЫ",
    kind: "activity",
    aspectRatio: "4:3",
    boys: [
      { boyId: "04-usaty-rozovye-ochki", x: 0.08, y: 0.22, scaleW: 0.34, rotate: 3, zIndex: 1 },
      { boyId: "10-sigara-blondin", x: 0.55, y: 0.24, scaleW: 0.34, rotate: -2, zIndex: 2 },
    ],
  },

  // ===== GROUP SHOT =====
  {
    id: "all-boys-group",
    destinationId: "group",
    bgId: "group-shot",
    caption: "9 ПАЦАНОВ · ОДНА ЛЕГЕНДА",
    kind: "group",
    aspectRatio: "16:9",
    boys: [
      { boyId: "01-kepka-balansyaga", x: 0.02, y: 0.3, scaleW: 0.14, rotate: -4, zIndex: 1 },
      { boyId: "02-panama-razvedchik", x: 0.13, y: 0.25, scaleW: 0.14, rotate: 3, zIndex: 2 },
      { boyId: "03-sigarny-baron", x: 0.24, y: 0.3, scaleW: 0.14, rotate: -2, zIndex: 3 },
      { boyId: "04-usaty-rozovye-ochki", x: 0.35, y: 0.26, scaleW: 0.14, rotate: 4, zIndex: 4 },
      { boyId: "05-morsha-spokoyny", x: 0.46, y: 0.3, scaleW: 0.14, rotate: -3, zIndex: 5 },
      { boyId: "06-lyonya-pereulka", x: 0.57, y: 0.25, scaleW: 0.14, rotate: 2, zIndex: 6 },
      { boyId: "07-tsar-garazha", x: 0.68, y: 0.3, scaleW: 0.14, rotate: -4, zIndex: 7 },
      { boyId: "08-stil-zapreschyonnykh", x: 0.15, y: 0.55, scaleW: 0.14, rotate: 3, zIndex: 8 },
      { boyId: "09-ulybka-off-white", x: 0.3, y: 0.55, scaleW: 0.14, rotate: -2, zIndex: 9 },
      { boyId: "10-sigara-blondin", x: 0.45, y: 0.55, scaleW: 0.14, rotate: 4, zIndex: 10 },
      { boyId: "11-avokado-banschik", x: 0.6, y: 0.55, scaleW: 0.14, rotate: -3, zIndex: 11 },
    ],
  },
];

export const SCENES_BY_ID: Record<string, SceneSpec> = Object.fromEntries(SCENES.map((s) => [s.id, s]));
