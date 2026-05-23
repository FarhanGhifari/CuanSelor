import type { RiskProfileOption } from "../types/simulation-preview.types";

export const RISK_PROFILES: RiskProfileOption[] = [
  {
    id: "conservative",
    label: "Konservatif",
    description: "Stabil, risiko rendah",
    estimatedReturn: 0.05,
  },
  {
    id: "moderate",
    label: "Moderat",
    description: "Seimbang, risiko menengah",
    estimatedReturn: 0.08,
  },
  {
    id: "aggressive",
    label: "Agresif",
    description: "Growth, risiko tinggi",
    estimatedReturn: 0.11,
  },
];