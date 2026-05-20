"use client";

import { useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { T, FONT } from "./tokens";
import { STATS } from "@/features/landing/data/landing-page";

const ANIMATION_DURATION = 2000;

export default function StatsSection() {
  return (
    <section
      className="py-[60px] md:py-[120px] px-6 md:px-[5%]"
      style={{ background: T.tileDark }}
    >
      <div className="w-full max-w-[1400px] mx-auto text-center">
        <p
          style={{
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: T.mutedDark,
            marginBottom: 48,
          }}
        >
          Mengapa ini penting
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {STATS.map((stat) => (
            <div key={stat.value}>
              <p
                style={{
                  fontSize: "clamp(48px, 6vw, 64px)",
                  fontWeight: 600,
                  letterSpacing: "-0.28px",
                  lineHeight: 1.07,
                  color: T.onDark,
                  marginBottom: 8,
                }}
              >
                <AnimatedStat value={stat.value} />
              </p>

              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: "-0.224px",
                  lineHeight: 1.43,
                  color: T.mutedDark,
                }}
              >
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type AnimatedStatProps = {
  value: string;
};

function AnimatedStat({ value }: AnimatedStatProps) {
  const elementRef = useRef<HTMLSpanElement | null>(null);

  const hasAnimatedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const pathname = usePathname();

  /**
   * Extract numeric value once
   */
  const parsedValue = useMemo(() => {
    const match = value.match(/(\d+(?:\.\d+)?)/);

    if (!match) {
      return null;
    }

    return {
      raw: match[0],
      number: parseFloat(match[0]),
      isFloat: match[0].includes("."),
    };
  }, [value]);

  /**
   * Reset animation when route changes
   */
  useEffect(() => {
    hasAnimatedRef.current = false;

    if (elementRef.current) {
      elementRef.current.textContent = getInitialDisplay(value);
    }
  }, [pathname, value]);

  /**
   * Main animation observer
   */
  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const startAnimation = () => {
      if (!parsedValue) {
        element.textContent = value;
        return;
      }

      const { raw, number, isFloat } = parsedValue;

      const startNumber =
        number > 1000
          ? Math.max(0, number * 0.92)
          : 0;

      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!elementRef.current) return;

        if (!startTime) {
          startTime = timestamp;
        }

        const progress = Math.min(
          (timestamp - startTime) / ANIMATION_DURATION,
          1
        );

        /**
         * easeOutQuad
         */
        const easedProgress =
          progress * (2 - progress);

        const currentValue =
          startNumber +
          (number - startNumber) * easedProgress;

        const formattedValue = isFloat
          ? currentValue.toFixed(1)
          : Math.round(currentValue).toString();

        element.textContent = value.replace(
          raw,
          formattedValue
        );

        if (progress < 1) {
          animationFrameRef.current =
            requestAnimationFrame(animate);
        } else {
          element.textContent = value;
        }
      };

      animationFrameRef.current =
        requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible =
          entry.isIntersecting ||
          entry.boundingClientRect.top < 0;

        if (
          isVisible &&
          !hasAnimatedRef.current
        ) {
          hasAnimatedRef.current = true;

          startAnimation();

          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, [parsedValue, pathname, value]);

  return (
    <span ref={elementRef}>
      {getInitialDisplay(value)}
    </span>
  );
}

function getInitialDisplay(value: string) {
  return value.replace(/(\d+(?:\.\d+)?)/, "0");
}