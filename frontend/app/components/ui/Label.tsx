import { cn } from "../../lib/utils";
import { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-gray-700 dark:text-gray-300",
        className
      )}
      {...props}
    />
  );
}
