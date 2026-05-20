/**
 * Design tokens for the landing page.
 * "Light Premium Fintech" — White, emerald accents, soft indigo secondary.
 */
export const T = {
  // ── Backgrounds ──
  bgDeep:     "#FFFFFF",   // Pure white base
  bgBase:     "#F8FAFC",   // Very light slate/gray
  bgCard:     "#FFFFFF",   // Crisp white cards
  bgElevated: "#F1F5F9",   // Section offsets

  // ── Text ──
  ink:        "#0F172A",           // Primary deep slate text
  inkMuted:   "rgba(15,23,42,0.65)", // Muted slate text
  inkMuted48: "rgba(15,23,42,0.45)", // Micro slate text
  onDark:     "#ffffff",
  mutedDark:  "rgba(255, 255, 255, 0.70)",

  // ── Primary (Emerald / Teal — Finance, Growth, Trust) ──
  emerald:    "#10B981",
  emeraldDim: "rgba(16,185,129,0.08)",
  teal:       "#14B8A6",

  // ── Secondary (Indigo / Violet — AI, Futuristic, Intelligence) ──
  indigo:     "#6366F1",
  violet:     "#8B5CF6",
  indigoDim:  "rgba(99,102,241,0.08)",

  // ── Legacy compat ──
  blue:       "#006241",
  blueDark:   "#00754A",
  canvas:     "#ffffff",
  parchment:  "#f2f0eb",
  tileDark:   "#1E3932",
  tileDark2:  "#2b5148",
  black:      "#000000",

  // ── Glass & Borders (Light Mode) ──
  glass:      "rgba(255,255,255,0.70)",
  glassBorder:"rgba(15,23,42,0.06)",
  glassHeavy: "rgba(255,255,255,0.85)",

  // ── Hairlines ──
  hairline:   "#e7e7e7",
  hairlineDark: "rgba(15,23,42,0.06)",
  divSoft:    "rgba(0,0,0,0.04)",

  // ── Shadows & Glows (Light Mode) ──
  glowEmerald: "0 20px 80px rgba(16,185,129,0.08), 0 4px 20px rgba(16,185,129,0.03)",
  glowIndigo:  "0 20px 80px rgba(99,102,241,0.08), 0 4px 20px rgba(99,102,241,0.03)",
  glowCard:    "0 20px 40px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)",
} as const;

export const FONT = "'Plus Jakarta Sans', 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
