import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "secondary";
  [key: string]: any;
};

export function Button({ children, className = "", variant = "default", ...props }: ButtonProps) {
  const styles = variant === "secondary" ? "bg-gray-200 text-gray-800" : "bg-green-500 text-white";
  return (
    <button className={`${styles} rounded-lg px-4 py-2 ${className}`} {...props}>
      {children}
    </button>
  );
}
