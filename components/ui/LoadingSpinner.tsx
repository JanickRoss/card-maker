"use client";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`
          ${sizes[size]}
          border-primary/30 border-t-primary
          rounded-full
          animate-spin
        `}
      />
      {text && <p className="text-text-secondary animate-pulse">{text}</p>}
    </div>
  );
}
