
import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  error?:     string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, leftIcon, rightIcon, error, className, ...props }, ref) => (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition",
            leftIcon  ? "pl-10" : "pl-4",
            rightIcon ? "pr-10" : "pr-4",
            error
              ? "border-red-400 focus:ring-red-400 bg-red-50"
              : "border-gray-200",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-3.5 flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  )
);
Input.displayName = "Input";