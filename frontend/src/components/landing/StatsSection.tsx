"use client";

import { useEffect, useRef, useState } from "react";
import { T, FONT } from "./tokens";
import { STATS } from "@/lib/constants/landing-page";

/** Stats section with dark background and animated counter stats. */
export default function StatsSection() {
  return (
    <section className="py-[60px] md:py-[120px] px-6 md:px-[5%]" style={{ background: T.tileDark }}>
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
          {STATS.map((s) => (
            <div key={s.value}>
              <p style={{ fontSize: "clamp(48px, 6vw, 64px)", fontWeight: 600, letterSpacing: "-0.28px", lineHeight: 1.07, color: T.onDark, marginBottom: 8 }}>
                <AnimatedStat value={s.value} />
              </p>
              <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, letterSpacing: "-0.224px", lineHeight: 1.43, color: T.mutedDark }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedStat({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const match = value.match(/(\d+(?:\.\d+)?)/);
    if (!match) {
      requestAnimationFrame(() => setDisplayed(value));
      return;
    }

    const targetNum = parseFloat(match[0]);
    const isFloat = match[0].includes(".");
    const startNum = targetNum > 1000 ? targetNum - 150 : 0; 
    
    let startTime: number | null = null;
    const duration = 2000; // Smooth 2s count-up

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // easeOutQuad
      const easeProgress = progress * (2 - progress);
      const currentNum = startNum + (targetNum - startNum) * easeProgress;
      
      const formattedNum = isFloat 
        ? currentNum.toFixed(1) 
        : Math.round(currentNum).toString();

      setDisplayed(value.replace(match[0], formattedNum));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayed(value);
      }
    };

    requestAnimationFrame(animate);
  }, [hasAnimated, value]);

  return <span ref={elementRef}>{displayed}</span>;
}
