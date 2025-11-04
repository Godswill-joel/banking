// src/components/Icon.tsx
import React from "react";

type IconProps = {
  name: string;
  className?: string;
  "aria-hidden"?: boolean;
};

export default function Icon({ name, className = "w-5 h-5", ...rest }: IconProps) {
  switch (name) {
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
          <path d="M22 5.92c-.66.3-1.37.5-2.12.6a3.7 3.7 0 0 0 1.63-2.04 7.4 7.4 0 0 1-2.35.9 3.7 3.7 0 0 0-6.3 3.37A10.5 10.5 0 0 1 3.2 4.8a3.7 3.7 0 0 0 1.14 4.94 3.6 3.6 0 0 1-1.68-.46v.05a3.7 3.7 0 0 0 2.97 3.63 3.7 3.7 0 0 1-1.67.06 3.7 3.7 0 0 0 3.45 2.57A7.42 7.42 0 0 1 2 19.5a10.5 10.5 0 0 0 5.67 1.66c6.8 0 10.53-5.64 10.53-10.53v-.48A7.5 7.5 0 0 0 22 5.92z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
          <path d="M4.98 3.5a2.49 2.49 0 1 1 0 4.98 2.49 2.49 0 0 1 0-4.98zM3.5 9h3v12h-3zM10 9h2.9v1.7h.04c.4-.75 1.37-1.55 2.82-1.55 3.02 0 3.58 1.99 3.58 4.58V21h-3v-5.1c0-1.22-.02-2.8-1.7-2.8-1.7 0-1.96 1.33-1.96 2.7V21H10z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
          <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.25.8-.56v-2c-3.3.72-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.08-.7.08-.7 1.1.08 1.7 1.1 1.7 1.1 1 .1 1.7.74 2.2 1.25.7-.06 1.4-.28 2-.55-2.6-.3-5.3-1.3-5.3-5.8 0-1.28.46-2.32 1.2-3.14-.12-.3-.52-1.53.12-3.2 0 0 .98-.32 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.52 3.2-1.2 3.2-1.2.64 1.67.24 2.9.12 3.2.74.82 1.2 1.86 1.2 3.14 0 4.5-2.7 5.5-5.3 5.8.44.36.82 1.08.82 2.18v3.24c0 .3.18.66.82.56A12 12 0 0 0 12 .5z" />
        </svg>
      );
    case "newsletter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
          <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1l-10 6L2 7V6zM2 9v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9l-10 6L2 9z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}
