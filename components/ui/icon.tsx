import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { ICONS, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  "aria-hidden"?: boolean;
}

/**
 * Single icon primitive used across the whole app.
 * Wraps Hugeicons so components reference icons by intent (`name`)
 * and inherit `currentColor` by default.
 */
export function Icon({
  name,
  size = 20,
  strokeWidth = 1.7,
  className,
  color = "currentColor",
  ...rest
}: IconProps) {
  return (
    <HugeiconsIcon
      icon={ICONS[name] as IconSvgElement}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={cn("shrink-0", className)}
      aria-hidden
      {...rest}
    />
  );
}
