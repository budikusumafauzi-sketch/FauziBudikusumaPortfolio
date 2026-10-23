import * as React from "react";

/* ==========================================================================
   Container Primitive
   ========================================================================== */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Container({
  as: Component = "div",
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ==========================================================================
   Button Primitive
   ========================================================================== */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  download?: string | boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded tracking-wider uppercase font-mono gap-1.5 min-h-[36px]",
    md: "px-5 py-2.5 text-sm rounded-md tracking-wide font-sans gap-2 min-h-[44px]",
    lg: "px-6 py-3 text-base rounded-md tracking-wide font-sans gap-2.5 min-h-[48px]",
  }[size];

  const variantStyles = {
    primary:
      "bg-accent text-text-strong font-semibold hover:bg-accent-hover active:bg-accent-active dark:shadow-[0_0_24px_var(--color-accent-glow)] border border-accent",
    secondary:
      "bg-surface-card border border-border-default text-text-primary hover:border-accent hover:text-text-strong active:bg-surface-raised",
    outline:
      "bg-transparent border border-border-default text-text-secondary hover:text-text-primary hover:border-accent",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised",
  }[variant];

  const combinedClasses = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`;

  if (href) {
    const anchorProps = { ...props } as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    delete (anchorProps as { type?: unknown }).type;
    return (
      <a
        href={href}
        className={combinedClasses}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        aria-disabled={disabled}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

/* ==========================================================================
   IconButton Primitive
   ========================================================================== */
export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: "default" | "active" | "ghost";
  size?: "sm" | "md";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      "aria-label": ariaLabel,
      variant = "default",
      size = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md border transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-40";

    const sizeStyles = {
      sm: "h-9 w-9 min-h-[36px] min-w-[36px]",
      md: "h-11 w-11 min-h-[44px] min-w-[44px]", // ≥ 44px touch target on mobile (A11Y)
    }[size];

    const variantStyles = {
      default:
        "bg-surface-card border-border-default text-text-secondary hover:text-text-primary hover:border-accent active:bg-surface-raised",
      active:
        "bg-surface-raised border-accent text-accent",
      ghost:
        "bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised",
    }[variant];

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

/* ==========================================================================
   Card Primitive
   ========================================================================== */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({
  interactive = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles =
    "bg-surface-card border border-border-default rounded-xl transition-all duration-200 overflow-hidden";
  const hoverStyles = interactive
    ? "hover:border-accent hover:-translate-y-0.5 cursor-pointer"
    : "";

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ==========================================================================
   Chip Primitive
   ========================================================================== */
export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "neutral" | "outline";
  dot?: boolean;
  dotColor?: "accent" | "success" | "muted";
}

export function Chip({
  variant = "neutral",
  dot = false,
  dotColor = "accent",
  className = "",
  children,
  ...props
}: ChipProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs uppercase tracking-wider select-none";

  const variantStyles = {
    accent: "bg-accent-chip-bg text-accent-text border border-accent/25 font-semibold",
    neutral: "bg-surface-raised text-text-secondary border border-border-default",
    outline: "bg-transparent text-text-muted border border-border-default",
  }[variant];

  const dotColorClass = {
    accent: "bg-accent",
    success: "bg-emerald-500",
    muted: "bg-text-muted",
  }[dotColor];

  return (
    <span
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColorClass} animate-pulse`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

/* ==========================================================================
   SectionHeader Primitive (C-11 compliant: no numeric index prefixes)
   ========================================================================== */
export interface SectionHeaderProps {
  title: string;
  descriptor?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  descriptor,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`w-full mb-8 sm:mb-12 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-border-default">
        <div>
          <h2 className="font-display font-bold uppercase tracking-tight text-2xl sm:text-3xl lg:text-4xl text-text-strong">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {descriptor && (
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {descriptor}
            </span>
          )}
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   CornerFrame Primitive (L-shaped decorative brackets)
   ========================================================================== */
export interface CornerFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  bracketVariant?: "all-crimson" | "two-tone";
}

export function CornerFrame({
  bracketVariant = "all-crimson",
  className = "",
  children,
  ...props
}: CornerFrameProps) {
  const topLeftColor = "text-accent";
  const topRightColor = bracketVariant === "two-tone" ? "text-text-faint" : "text-accent";
  const bottomLeftColor = bracketVariant === "two-tone" ? "text-text-faint" : "text-accent";
  const bottomRightColor = "text-accent";

  return (
    <div
      className={`relative rounded-2xl border border-border-default p-3 sm:p-4 bg-surface-card/40 ${className}`}
      {...props}
    >
      {/* Top-Left Bracket */}
      <span
        aria-hidden="true"
        className={`absolute -top-1 -left-1 h-3.5 w-3.5 border-t-2 border-l-2 ${topLeftColor}`}
      />
      {/* Top-Right Bracket */}
      <span
        aria-hidden="true"
        className={`absolute -top-1 -right-1 h-3.5 w-3.5 border-t-2 border-r-2 ${topRightColor}`}
      />
      {/* Bottom-Left Bracket */}
      <span
        aria-hidden="true"
        className={`absolute -bottom-1 -left-1 h-3.5 w-3.5 border-b-2 border-l-2 ${bottomLeftColor}`}
      />
      {/* Bottom-Right Bracket */}
      <span
        aria-hidden="true"
        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 border-b-2 border-r-2 ${bottomRightColor}`}
      />
      {children}
    </div>
  );
}
