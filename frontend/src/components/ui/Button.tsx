import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   "primary" | "outline" | "ghost";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  isLoading,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "py-3.5 rounded-full text-sm font-semibold transition-all duration-200 " +
    "active:scale-[0.98] flex items-center justify-center gap-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary: "text-white hover:opacity-90 shadow-md shadow-emerald-200",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white",
    ghost:   "text-gray-500 hover:bg-gray-100",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      style={
        variant === "primary"
          ? { background: "linear-gradient(90deg, #10b981, #14b8a6)" }
          : undefined
      }
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Memproses...
        </>
      ) : (
        children
      )}
    </button>
  );
}