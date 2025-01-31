import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-xl border bg-white p-4 shadow-md", className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

// Static component inside Card
Card.Content = function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
};

// You can also add a default export if necessary
export default Card;
