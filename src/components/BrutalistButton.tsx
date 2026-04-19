import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "volt" | "ghost" | "chalk";

interface BrutalistButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  active?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<BrutalistButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-mono-sm",
  md: "px-6 py-3 text-mono-md",
  lg: "px-8 py-4 text-mono-lg",
};

function variantClasses(variant: Variant, active: boolean): string {
  if (active) {
    return "bg-volt text-void border-void shadow-[8px_8px_0_0_#000]";
  }
  switch (variant) {
    case "volt":
      return "bg-volt text-void border-void shadow-[8px_8px_0_0_#000]";
    case "chalk":
      return "bg-chalk text-void border-void shadow-[8px_8px_0_0_#000]";
    case "ghost":
      return "bg-transparent text-chalk border-chalk shadow-[8px_8px_0_0_#CCFF00]";
    case "primary":
    default:
      return "bg-void text-chalk border-chalk shadow-[8px_8px_0_0_#CCFF00]";
  }
}

export default function BrutalistButton({
  children,
  variant = "primary",
  active = false,
  size = "md",
  className = "",
  ...rest
}: BrutalistButtonProps) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center gap-2",
        "font-mono uppercase font-bold tracking-widest",
        "border-hard-sm rounded-none",
        "transition-[transform,box-shadow] duration-100 ease-out",
        "hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none",
        "active:translate-x-[8px] active:translate-y-[8px] active:shadow-none",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0",
        variantClasses(variant, active),
        SIZE[size],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
