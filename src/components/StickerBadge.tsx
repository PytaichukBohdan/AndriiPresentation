import type { ReactNode } from "react";

interface StickerBadgeProps {
  children: ReactNode;
  rotation?: number;
  variant?: "volt" | "chalk" | "black";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES: Record<NonNullable<StickerBadgeProps["size"]>, string> = {
  sm: "px-3 py-1 text-mono-xs",
  md: "px-4 py-2 text-mono-sm",
  lg: "px-6 py-3 text-mono-md",
};

const VARIANTS: Record<NonNullable<StickerBadgeProps["variant"]>, string> = {
  volt: "bg-volt text-void border-void shadow-[6px_6px_0_0_#000]",
  chalk: "bg-chalk text-void border-void shadow-[6px_6px_0_0_#000]",
  black: "bg-void text-chalk border-chalk shadow-[6px_6px_0_0_#CCFF00]",
};

export default function StickerBadge({
  children,
  rotation = 3,
  variant = "chalk",
  size = "md",
  className = "",
}: StickerBadgeProps) {
  const rotateStyle = { transform: `rotate(${rotation}deg)` };
  return (
    <span
      style={rotateStyle}
      className={[
        "inline-block font-mono uppercase font-bold tracking-widest",
        "border-hard-sm rounded-none select-none",
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
