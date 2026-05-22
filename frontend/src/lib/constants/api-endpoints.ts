const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const ML   = process.env.NEXT_PUBLIC_ML_API_URL ?? "http://localhost:8000";

export const API = {
  AUTH: {
    LOGIN:    `${BASE}/api/auth/login`,
    REGISTER: `${BASE}/api/auth/register`,
    LOGOUT:   `${BASE}/api/auth/logout`,
    ME:       `${BASE}/api/auth/me`,
    REFRESH:  `${BASE}/api/auth/refresh`,
  },
  PROFILE: {
    GET:    `${BASE}/api/profile`,
    UPDATE: `${BASE}/api/profile`,
  },
  ONBOARDING: {
    STATUS:    `${BASE}/api/onboarding/status`,
    FINANCIAL: `${BASE}/api/onboarding/financial`,
    PENSION:   `${BASE}/api/onboarding/pension`,
  },
  RISK: {
    QUESTIONS: `${BASE}/api/risk/questions`,
    SUBMIT:    `${BASE}/api/risk/assess`,
    RESULT:    `${BASE}/api/risk/result`,
  },
  ML: {
    PROJECTION:   `${ML}/predict/pension`,
    RISK_PROFILE: `${ML}/predict/risk-profile`,
  },
  ADVISOR: {
    CHAT:   `${BASE}/api/advisor/chat`,
    ADVICE: `${BASE}/api/advisor/advice`,
  },
  SIMULATION: {
    CREATE:  `${BASE}/api/simulation`,
    HISTORY: `${BASE}/api/simulation/history`,
  },
  PROJECTION_CALC: {
    GET: `${BASE}/api/projection`,
  },
} as const;
