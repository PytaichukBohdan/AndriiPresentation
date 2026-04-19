export type BackgroundSource = "procedural";
export type AspectRatio = "4:3" | "16:9";

export interface ProceduralBackground {
  id: string;
  source: "procedural";
  aspectRatio: AspectRatio;
  flag: string;
  country: string;
  headline: string;
  subline: string;
  stripeColor: "volt" | "chalk";
  baseTone: "carbon" | "void";
  angleDeg: number;
}

export type BackgroundSpec = ProceduralBackground;

export const BACKGROUNDS: BackgroundSpec[] = [
  // AMALFI
  { id: "amalfi-coast", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "ITALIA", headline: "AMALFI", subline: "COSTIERA · POSITANO · RAVELLO", stripeColor: "volt", baseTone: "carbon", angleDeg: -4 },
  { id: "amalfi-lemons", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "LIMONCELLO", headline: "LIMONI", subline: "CAFÉ TERRAZZA · 28°C", stripeColor: "chalk", baseTone: "carbon", angleDeg: 3 },
  { id: "amalfi-grot", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "GROTTA", headline: "EMERALDO", subline: "JUMP OFF THE YACHT", stripeColor: "volt", baseTone: "void", angleDeg: -2 },
  { id: "amalfi-stairs", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "POSITANO", headline: "SCALE", subline: "1000 STEPS OF FASHION", stripeColor: "chalk", baseTone: "carbon", angleDeg: 5 },

  // IBIZA
  { id: "ibiza-coast", source: "procedural", aspectRatio: "4:3", flag: "🇪🇸", country: "IBIZA", headline: "BALEARIC", subline: "PACHA · USHUAIA · AMNESIA", stripeColor: "volt", baseTone: "void", angleDeg: -3 },
  { id: "ibiza-pacha", source: "procedural", aspectRatio: "4:3", flag: "🇪🇸", country: "NIGHTCLUB", headline: "PACHA", subline: "128 BPM · STROBE", stripeColor: "volt", baseTone: "void", angleDeg: 0 },
  { id: "ibiza-beach", source: "procedural", aspectRatio: "4:3", flag: "🇪🇸", country: "FORMENTERA", headline: "BEACH CLUB", subline: "BLUE MARLIN · SUN", stripeColor: "chalk", baseTone: "carbon", angleDeg: 2 },
  { id: "ibiza-vedra", source: "procedural", aspectRatio: "4:3", flag: "🇪🇸", country: "ES VEDRA", headline: "SUNSET", subline: "CAFÉ DEL MAR · VIBE", stripeColor: "volt", baseTone: "carbon", angleDeg: -5 },

  // SARDINIA
  { id: "sardinia-coast", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "SARDEGNA", headline: "SMERALDA", subline: "PORTO CERVO · MADDALENA", stripeColor: "volt", baseTone: "carbon", angleDeg: 4 },
  { id: "sardinia-yacht", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "YACHT", headline: "GULET", subline: "VERMENTINO ON DECK", stripeColor: "chalk", baseTone: "void", angleDeg: -3 },
  { id: "sardinia-maddalena", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "LA MADDALENA", headline: "ISOLE", subline: "GRANITE BAYS · 25°C", stripeColor: "volt", baseTone: "carbon", angleDeg: 2 },
  { id: "sardinia-cervo", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "PORTO CERVO", headline: "BILLIONAIRE", subline: "MARINA · DINNER", stripeColor: "chalk", baseTone: "carbon", angleDeg: -2 },

  // MYKONOS
  { id: "mykonos-coast", source: "procedural", aspectRatio: "4:3", flag: "🇬🇷", country: "MYKONOS", headline: "CHORA", subline: "WHITE & BLUE · WIND", stripeColor: "chalk", baseTone: "void", angleDeg: -4 },
  { id: "mykonos-windmills", source: "procedural", aspectRatio: "4:3", flag: "🇬🇷", country: "WINDMILLS", headline: "KATO MILI", subline: "THE ICONIC POSE", stripeColor: "volt", baseTone: "void", angleDeg: 3 },
  { id: "mykonos-alleys", source: "procedural", aspectRatio: "4:3", flag: "🇬🇷", country: "CHORA ALLEY", headline: "LABYRINTH", subline: "BOUGAINVILLEA · BLUE DOORS", stripeColor: "chalk", baseTone: "carbon", angleDeg: 5 },
  { id: "mykonos-scorpios", source: "procedural", aspectRatio: "4:3", flag: "🇬🇷", country: "SCORPIOS", headline: "SUNSET DJ", subline: "PARADISE · COCKTAIL", stripeColor: "volt", baseTone: "carbon", angleDeg: -2 },

  // MONTENEGRO
  { id: "montenegro-bay", source: "procedural", aspectRatio: "4:3", flag: "🇲🇪", country: "KOTOR", headline: "FJORD", subline: "PERAST · TIVAT · BUDVA", stripeColor: "volt", baseTone: "carbon", angleDeg: -3 },
  { id: "montenegro-walls", source: "procedural", aspectRatio: "4:3", flag: "🇲🇪", country: "KOTOR WALLS", headline: "LESTVICE", subline: "1350 SKALINA · VIEW", stripeColor: "chalk", baseTone: "void", angleDeg: 4 },
  { id: "montenegro-boat", source: "procedural", aspectRatio: "4:3", flag: "🇲🇪", country: "BOAT DAY", headline: "BAY CRUISE", subline: "OUR LADY OF ROCKS", stripeColor: "volt", baseTone: "carbon", angleDeg: 2 },
  { id: "montenegro-porto", source: "procedural", aspectRatio: "4:3", flag: "🇲🇪", country: "PORTO MNE", headline: "MARINA", subline: "YACHTS · CIGARS · RAKIJA", stripeColor: "chalk", baseTone: "carbon", angleDeg: -4 },

  // HVAR
  { id: "hvar-island", source: "procedural", aspectRatio: "4:3", flag: "🇭🇷", country: "HRVATSKA", headline: "HVAR", subline: "PAKLENI · CARPE DIEM", stripeColor: "volt", baseTone: "carbon", angleDeg: 3 },
  { id: "hvar-carpe", source: "procedural", aspectRatio: "4:3", flag: "🇭🇷", country: "CARPE DIEM", headline: "BEACH CLUB", subline: "ADRIATIC · PARTY · 25°", stripeColor: "volt", baseTone: "void", angleDeg: -2 },
  { id: "hvar-pakleni", source: "procedural", aspectRatio: "4:3", flag: "🇭🇷", country: "PAKLENI", headline: "ISLANDS", subline: "PALMIZANA · VELA", stripeColor: "chalk", baseTone: "carbon", angleDeg: 4 },
  { id: "hvar-fortress", source: "procedural", aspectRatio: "4:3", flag: "🇭🇷", country: "SPANJOLA", headline: "TVRDJAVA", subline: "SUNSET OVER CHORA", stripeColor: "volt", baseTone: "carbon", angleDeg: -3 },

  // BODRUM
  { id: "bodrum-coast", source: "procedural", aspectRatio: "4:3", flag: "🇹🇷", country: "TURKIYE", headline: "BODRUM", subline: "GULET · GÖCEK · HAMAM", stripeColor: "chalk", baseTone: "carbon", angleDeg: -4 },
  { id: "bodrum-gulet", source: "procedural", aspectRatio: "4:3", flag: "🇹🇷", country: "GULET", headline: "SAILING", subline: "BUTTERFLY VALLEY · TURQUOISE", stripeColor: "volt", baseTone: "void", angleDeg: 2 },
  { id: "bodrum-bar", source: "procedural", aspectRatio: "4:3", flag: "🇹🇷", country: "BAR STREET", headline: "HALIKARNAS", subline: "NIGHT · RAKI · BASS", stripeColor: "volt", baseTone: "carbon", angleDeg: -3 },
  { id: "bodrum-castle", source: "procedural", aspectRatio: "4:3", flag: "🇹🇷", country: "CASTLE", headline: "BODRUM CASTLE", subline: "KNIGHTS OF ST. JOHN", stripeColor: "chalk", baseTone: "carbon", angleDeg: 4 },

  // MALLORCA
  { id: "mallorca-coast", source: "procedural", aspectRatio: "4:3", flag: "🇪🇸", country: "MALLORCA", headline: "BALEARES", subline: "PALMA · DEIA · ANDRATX", stripeColor: "volt", baseTone: "carbon", angleDeg: -3 },
  { id: "mallorca-tramuntana", source: "procedural", aspectRatio: "4:3", flag: "🇪🇸", country: "TRAMUNTANA", headline: "SIERRA", subline: "UNESCO · CLIFFS", stripeColor: "chalk", baseTone: "void", angleDeg: 4 },
  { id: "mallorca-estrenc", source: "procedural", aspectRatio: "4:3", flag: "🇪🇸", country: "ES TRENC", headline: "KARIBIK", subline: "WHITE SAND · BLUE WATER", stripeColor: "volt", baseTone: "carbon", angleDeg: 2 },
  { id: "mallorca-andratx", source: "procedural", aspectRatio: "4:3", flag: "🇪🇸", country: "ANDRATX", headline: "MARINA", subline: "YACHTS · SUNSET · WINE", stripeColor: "chalk", baseTone: "carbon", angleDeg: -2 },

  // PUGLIA
  { id: "puglia-coast", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "PUGLIA", headline: "TACCO ITALIA", subline: "OSTUNI · LECCE · SALENTO", stripeColor: "volt", baseTone: "carbon", angleDeg: 3 },
  { id: "puglia-trulli", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "TRULLI", headline: "ALBEROBELLO", subline: "UNESCO · STONE CONES", stripeColor: "chalk", baseTone: "void", angleDeg: -4 },
  { id: "puglia-salento", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "POLIGNANO", headline: "FALESIA", subline: "CLIFF DINING · GROT", stripeColor: "volt", baseTone: "carbon", angleDeg: 2 },
  { id: "puglia-masseria", source: "procedural", aspectRatio: "4:3", flag: "🇮🇹", country: "MASSERIA", headline: "FARMHOUSE", subline: "OLIVE GROVE · PRIMITIVO", stripeColor: "chalk", baseTone: "carbon", angleDeg: -3 },

  // RHODES
  { id: "rhodes-coast", source: "procedural", aspectRatio: "4:3", flag: "🇬🇷", country: "RODOS", headline: "MEDIEVAL", subline: "OLD TOWN · LINDOS", stripeColor: "volt", baseTone: "carbon", angleDeg: -4 },
  { id: "rhodes-oldtown", source: "procedural", aspectRatio: "4:3", flag: "🇬🇷", country: "OLD TOWN", headline: "UNESCO", subline: "KNIGHTS GATE · STONE STREETS", stripeColor: "chalk", baseTone: "void", angleDeg: 3 },
  { id: "rhodes-lindos", source: "procedural", aspectRatio: "4:3", flag: "🇬🇷", country: "LINDOS", headline: "ACROPOLIS", subline: "WHITE VILLAGE · BAY", stripeColor: "volt", baseTone: "carbon", angleDeg: 2 },
  { id: "rhodes-faliraki", source: "procedural", aspectRatio: "4:3", flag: "🇬🇷", country: "FALIRAKI", headline: "CLUB STRIP", subline: "DUSK TO DAWN", stripeColor: "chalk", baseTone: "carbon", angleDeg: -3 },

  // CORSICA
  { id: "corsica-coast", source: "procedural", aspectRatio: "4:3", flag: "🇫🇷", country: "CORSE", headline: "BONIFACIO", subline: "CLIFFS · PORTO-VECCHIO", stripeColor: "volt", baseTone: "carbon", angleDeg: 4 },
  { id: "corsica-scandola", source: "procedural", aspectRatio: "4:3", flag: "🇫🇷", country: "SCANDOLA", headline: "RESERVE", subline: "UNESCO · RED CLIFFS", stripeColor: "chalk", baseTone: "void", angleDeg: -3 },
  { id: "corsica-palombaggia", source: "procedural", aspectRatio: "4:3", flag: "🇫🇷", country: "PALOMBAGGIA", headline: "LAGOON", subline: "TURQUOISE · PINES", stripeColor: "volt", baseTone: "carbon", angleDeg: 2 },
  { id: "corsica-portovecchio", source: "procedural", aspectRatio: "4:3", flag: "🇫🇷", country: "PORTO-VECCHIO", headline: "MARINA", subline: "DINNER · WINE · NIGHT", stripeColor: "chalk", baseTone: "carbon", angleDeg: -4 },

  // KSAMIL
  { id: "ksamil-coast", source: "procedural", aspectRatio: "4:3", flag: "🇦🇱", country: "SHQIPERIA", headline: "KSAMIL", subline: "BUDGET MALDIVES · TURQUOISE", stripeColor: "volt", baseTone: "carbon", angleDeg: -2 },
  { id: "ksamil-shipwreck", source: "procedural", aspectRatio: "4:3", flag: "🇦🇱", country: "SHIPWRECK", headline: "SUNKEN", subline: "SNORKEL · FREE DIVE", stripeColor: "chalk", baseTone: "void", angleDeg: 3 },
  { id: "ksamil-butrint", source: "procedural", aspectRatio: "4:3", flag: "🇦🇱", country: "BUTRINT", headline: "UNESCO", subline: "ANCIENT CITY", stripeColor: "volt", baseTone: "carbon", angleDeg: -4 },
  { id: "ksamil-saranda", source: "procedural", aspectRatio: "4:3", flag: "🇦🇱", country: "SARANDA", headline: "NIGHT BAY", subline: "BAR STRIP · GRILL", stripeColor: "chalk", baseTone: "carbon", angleDeg: 5 },

  // CYPRUS
  { id: "cyprus-coast", source: "procedural", aspectRatio: "4:3", flag: "🇨🇾", country: "CYPRUS", headline: "LIMASSOL", subline: "MARINA · CASINO · SUN", stripeColor: "volt", baseTone: "carbon", angleDeg: 3 },
  { id: "cyprus-bluelagoon", source: "procedural", aspectRatio: "4:3", flag: "🇨🇾", country: "BLUE LAGOON", headline: "AKAMAS", subline: "BOAT DAY · TURQUOISE", stripeColor: "chalk", baseTone: "void", angleDeg: -3 },
  { id: "cyprus-marina", source: "procedural", aspectRatio: "4:3", flag: "🇨🇾", country: "MARINA NIGHT", headline: "CITY OF DREAMS", subline: "CASINO · ROULETTE", stripeColor: "volt", baseTone: "carbon", angleDeg: 4 },
  { id: "cyprus-ayianapa", source: "procedural", aspectRatio: "4:3", flag: "🇨🇾", country: "AYIA NAPA", headline: "NIGHTLIFE", subline: "CLUB PAMBOS · BASS", stripeColor: "chalk", baseTone: "carbon", angleDeg: -2 },

  // GROUP
  { id: "group-shot", source: "procedural", aspectRatio: "16:9", flag: "🌍", country: "BOYS TRIP 2026", headline: "ВОССОЕДИНЕНИЕ", subline: "9 ПАЦАНОВ · 4 ДНЯ · ∞ ИСТОРИЙ", stripeColor: "volt", baseTone: "void", angleDeg: -2 },
];

export const BACKGROUNDS_BY_ID: Record<string, BackgroundSpec> = Object.fromEntries(
  BACKGROUNDS.map((b) => [b.id, b]),
);
