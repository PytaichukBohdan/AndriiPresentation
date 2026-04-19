export type SceneKind = "hero" | "activity" | "group";
export type AspectRatio = "4:3" | "16:9";

export interface BoyPlacement {
  boyId: string;
  x: number;
  y: number;
  scaleW: number;
  rotate?: number;
  flipH?: boolean;
  zIndex: number;
}

export interface StickerOverlay {
  text: string;
  x: number;
  y: number;
  rotate: number;
  variant: "volt" | "chalk";
}

export interface SceneSpec {
  id: string;
  destinationId: string;
  bgId: string;
  caption: string;
  kind: SceneKind;
  aspectRatio: AspectRatio;
  boys: BoyPlacement[];
  stickers?: StickerOverlay[];
}
