import { cn } from "@/lib/utils"; // ✅ যদি utils ফাইল না থাকে নিচে বিকল্প দিচ্ছি
import { cva } from "class-variance-authority";
import * as React from "react";

// 🎨 Badge Variants
const badgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-transparent hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80",
        destructive:
          "bg-red-500/10 text-red-700 border border-red-200 hover:bg-red-500/20",
        outline:
          "text-gray-700 border border-gray-300 dark:text-gray-200 dark:border-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// 🏷️ Badge Component
function Badge({ className, variant, ...props }) {
  return (
    <div
      className={cn(badgeVariants({ variant }), "px-3 py-1", className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
