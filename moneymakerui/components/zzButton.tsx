// components/Button.tsx
import React from "react";
import classNames from "classnames";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  // Base styling applied to every button
  const baseClasses =
    "px-4 py-2 rounded font-semibold transition-colors focus:outline-none";

  // Variant-specific styling pulled from your global theme (set in tailwind.config.js)
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primaryHover",
    secondary: "bg-secondary text-white hover:bg-gray-500",
    danger: "bg-danger text-white hover:bg-red-700",
  };

  return (
    <button
      className={classNames(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
