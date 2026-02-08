import { ReactNode } from "react";

export function Button({ children, className = "", variant = "default", ...props }: { children: ReactNode; className?: string; variant?: string; [key: string]: any }) {
  const styles = variant === "secondary" ? "bg-gray-200 text-gray-800" : "bg-green-500 text-white";
  return (
    <button className={`${styles} rounded-lg px-4 py-2 ${className}`} {...props}>
      {children}
    </button>
  );
}
