import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        bullish: "border-signal-bullish/30 bg-signal-bullish/10 text-signal-bullish",
        caution: "border-signal-caution/30 bg-signal-caution/10 text-signal-caution",
        bearish: "border-signal-bearish/30 bg-signal-bearish/10 text-signal-bearish",
        neutral: "border-signal-neutral/30 bg-signal-neutral/10 text-signal-neutral",
        premium: "border-primary/30 bg-primary/10 text-primary",
        glass: "border-white/10 bg-white/5 backdrop-blur-md text-white shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
