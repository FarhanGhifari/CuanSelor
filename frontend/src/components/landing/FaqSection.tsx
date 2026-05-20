"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { T, FONT } from "./tokens";
import { FAQS } from "@/lib/constants/landing-page";

/** Single accordion item for FAQ. */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: `1px solid ${T.hairline}` }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-5 text-left gap-6"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.4,
            color: T.ink,
          }}
        >
          {q}
        </span>
        <ChevronDown
          style={{
            color: open ? T.blue : T.inkMuted,
            flexShrink: 0,
            width: 18,
            height: 18,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease",
          }}
        />
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              paddingBottom: 24,
              fontFamily: FONT,
              fontSize: 17,
              fontWeight: 400,
              letterSpacing: "-0.374px",
              lineHeight: 1.5,
              color: T.inkMuted,
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

/** FAQ section with Wealthfront-style two-column layout. */
export default function FaqSection() {
  return (
    <section
      className="flex flex-col items-center justify-center min-h-screen py-[60px] md:py-[80px] px-6 md:px-[5%] box-border"
      style={{ background: T.canvas }}
    >
      <div className="flex flex-col md:flex-row flex-wrap gap-10 md:gap-[60px] items-start w-full max-w-[1400px] mx-auto">
        {/* Left column */}
        <div className="w-full md:flex-1 md:min-w-[300px] text-left">
          <h2
            style={{
              fontSize: "clamp(48px, 6vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: T.blueDark,
              marginBottom: 24,
            }}
          >
            Pertanyaan?<br />5 hal yang perlu diketahui dalam 5 menit.
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, lineHeight: 1.5, color: T.inkMuted }}>
            Untuk mempelajari lebih lanjut tentang CuanSelor, baca{" "}
            <a href="#" style={{ textDecoration: "underline", color: T.inkMuted }}>panduan kami</a>{" "}
            atau kunjungi{" "}
            <a href="#" style={{ textDecoration: "underline", color: T.inkMuted }}>pusat bantuan</a>.
          </p>
        </div>

        {/* Right column */}
        <div className="w-full md:flex-[1.5] md:min-w-[400px] flex flex-col">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
