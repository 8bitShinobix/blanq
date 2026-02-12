import type { SVGProps } from "react";

const VARIANT_COLORS = {
  dark: "#0a0a0a",
  light: "#faf9f6",
  white: "#ffffff",
  accent: "#6366f1",
} as const;

type LogoVariant = keyof typeof VARIANT_COLORS;

interface BlanqLogoProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  size?: number;
  variant?: LogoVariant;
}

export function BlanqLogo({
  size = 32,
  variant = "dark",
  ...props
}: BlanqLogoProps) {
  const fill = VARIANT_COLORS[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-label="Blanq logo"
      {...props}
    >
      <circle cx="6" cy="6" r="3.5" fill={fill} />
      <circle cx="18" cy="6" r="3.5" fill={fill} />
      <circle cx="30" cy="6" r="3.5" fill={fill} />
      <circle cx="6" cy="18" r="3.5" fill={fill} />
      <circle cx="18" cy="18" r="3.5" fill={fill} opacity="0.25" />
      <circle cx="30" cy="18" r="3.5" fill={fill} opacity="0.1" />
      <circle cx="6" cy="30" r="3.5" fill={fill} />
      <circle cx="18" cy="30" r="3.5" fill={fill} />
      <circle cx="30" cy="30" r="3.5" fill={fill} />
    </svg>
  );
}

interface BlanqWordmarkProps {
  className?: string;
  variant?: LogoVariant;
  style?: React.CSSProperties;
}

export function BlanqWordmark({
  className,
  variant = "dark",
  style,
}: BlanqWordmarkProps) {
  const color = VARIANT_COLORS[variant];

  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-display), Outfit, sans-serif",
        fontWeight: 300,
        letterSpacing: "-0.025em",
        color,
        ...style,
      }}
    >
      blanq
    </span>
  );
}

interface BlanqLogoLockupProps {
  size?: number;
  variant?: LogoVariant;
  layout?: "horizontal" | "stacked";
  className?: string;
}

export function BlanqLogoLockup({
  size = 32,
  variant = "dark",
  layout = "horizontal",
  className,
}: BlanqLogoLockupProps) {
  const isStacked = layout === "stacked";
  const wordmarkSize = size * 0.625;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: isStacked ? "column" : "row",
        alignItems: "center",
        gap: isStacked ? size * 0.25 : size * 0.375,
      }}
    >
      <BlanqLogo size={size} variant={variant} />
      <BlanqWordmark
        variant={variant}
        style={{ fontSize: `${wordmarkSize}px` }}
      />
    </div>
  );
}
