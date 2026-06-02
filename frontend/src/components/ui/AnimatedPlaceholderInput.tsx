"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface AnimatedPlaceholderInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
  rightButton?: React.ReactNode;
}

export const AnimatedPlaceholderInput = forwardRef<HTMLInputElement, AnimatedPlaceholderInputProps>(
  ({ icon, error, rightButton, placeholder, className, onChange, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const placeholderRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Check initial value
    useEffect(() => {
      if (props.value !== undefined) {
        setHasValue(String(props.value).length > 0);
      } else if (props.defaultValue !== undefined) {
        setHasValue(String(props.defaultValue).length > 0);
      }
    }, [props.value, props.defaultValue]);

    // Check if placeholder is overflowing
    useEffect(() => {
      if (!placeholderRef.current || !containerRef.current || !placeholder) return;

      const checkOverflow = () => {
        const placeholderWidth = placeholderRef.current!.scrollWidth;
        const containerWidth = containerRef.current!.clientWidth;
        setIsOverflowing(placeholderWidth > containerWidth);
      };

      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }, [placeholder]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    const showPlaceholder = !isFocused && !hasValue && placeholder;

    return (
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            "w-full py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base text-gray-900",
            icon ? "pl-10" : "pl-4",
            rightButton ? "pr-12" : "pr-4",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-gray-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10",
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {/* Animated Placeholder Overlay */}
        {showPlaceholder && (
          <div 
            ref={containerRef}
            className={cn(
              "absolute inset-y-0 flex items-center pointer-events-none overflow-hidden",
              icon ? "left-10" : "left-4",
              rightButton ? "right-12" : "right-4"
            )}
          >
            {isOverflowing ? (
              // Infinite marquee untuk placeholder yang kepotong
              <div className="flex animate-marquee-infinite">
                <span ref={placeholderRef} className="text-base text-gray-400 whitespace-nowrap pr-8">
                  {placeholder}
                </span>
                <span className="text-base text-gray-400 whitespace-nowrap pr-8">
                  {placeholder}
                </span>
              </div>
            ) : (
              // Static untuk placeholder yang tidak kepotong
              <span ref={placeholderRef} className="text-base text-gray-400 whitespace-nowrap">
                {placeholder}
              </span>
            )}
          </div>
        )}

        {rightButton && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center z-10">
            {rightButton}
          </div>
        )}

        <style jsx>{`
          @keyframes marquee-infinite {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-marquee-infinite {
            animation: marquee-infinite 8s linear infinite;
          }
        `}</style>
      </div>
    );
  }
);

AnimatedPlaceholderInput.displayName = "AnimatedPlaceholderInput";
