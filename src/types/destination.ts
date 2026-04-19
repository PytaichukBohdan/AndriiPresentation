export type DestinationTier = "core" | "wild-card";

export interface Highlight {
  emoji: string;
  text: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface CostItem {
  label: string;
  detail: string;
  amount: string;
}

export interface Activity {
  index: number;
  text: string;
}

export interface Destination {
  id: string;
  flag: string;
  country: string;
  name: string;
  tagline: string;
  description: string;
  rankBadge: string;
  tier: DestinationTier;
  highlights: Highlight[];
  metrics: Metric[];
  cost: {
    items: CostItem[];
    totalLabel: string;
    totalAmount: string;
  };
  pros: string[];
  cons: string[];
  voteButtonLabel: string;
  activities: Activity[];
  heroSceneId: string;
  activitySceneIds: string[];
  reverse: boolean;
}
