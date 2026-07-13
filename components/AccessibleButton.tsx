import type React from "react";

type AccessibleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function AccessibleButton({ className = "", variant = "primary", ...props }: AccessibleButtonProps) {
  return <button className={`button button-${variant} ${className}`} {...props} />;
}
