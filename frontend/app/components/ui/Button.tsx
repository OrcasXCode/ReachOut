import { cn } from "../../lib/utils"; // Ensure this exists
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "filled"; // Optional, defaults to "filled"
  children: ReactNode;
  className?: string;
}

export function Button({ variant = "filled", children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition",
        variant === "outline"
          ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
          : "bg-indigo-600 text-white hover:bg-indigo-700",
        className
      )}
      {...props} // This allows passing the 'type' prop or any other button attributes like 'onClick'
    >
      {children}
    </button>
  );
}
