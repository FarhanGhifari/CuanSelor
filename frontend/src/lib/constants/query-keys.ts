export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"],
  },
  PROFILE: {
    GET: ["profile"],
  },
  RISK: {
    QUESTIONS: ["risk", "questions"],
    RESULT:    ["risk", "result"],
  },
  PROJECTION: {
    GET: (params: Record<string, unknown>) => ["projection", params],
  },
  SIMULATION: {
    HISTORY: ["simulation", "history"],
  },
  INVESTMENT: {
    RECOMMENDATIONS: (label: string) => ["investment", "recommendations", label],
  },
} as const;