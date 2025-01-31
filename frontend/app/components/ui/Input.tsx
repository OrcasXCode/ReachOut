import { cn } from "../../lib/utils"; // Ensure you have the `cn` utility

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type: "text" | "email" | "password" | "number" | "tel" | "url"; // Restrict to valid input types
  placeholder?: string;
  className?: string;
}

export function Input({
  id,
  type,
  placeholder,
  className,
  required,
  ...props
}: InputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      className={cn(
        "border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500",
        className // Allowing for custom class names
      )}
      {...props} // Forwarding all other props like onChange, onFocus, etc.
    />
  );
}
