"use client";

import { useState } from "react";
import { ShieldCheck, ChevronRight } from "lucide-react";

// ── Risk Questionnaire Data ───────────────────────────────────
const QUESTIONS = [
  {
    id: "q1",
    question: "Berapa lama horizon investasi Anda?",
    options: [
      { label: "Kurang dari 2 tahun", score: 1 },
      { label: "2 – 5 tahun", score: 2 },
      { label: "Lebih dari 5 tahun", score: 3 },
    ],
  },
  {
    id: "q2",
    question: "Bagaimana reaksi Anda jika portofolio turun 20%?",
    options: [
      { label: "Jual semua untuk hindari kerugian lebih", score: 1 },
      { label: "Tahan dan tunggu pemulihan", score: 2 },
      { label: "Beli lebih banyak, harga diskon!", score: 3 },
    ],
  },
  {
    id: "q3",
    question: "Apa tujuan utama investasi Anda?",
    options: [
      { label: "Menjaga modal tetap aman", score: 1 },
      { label: "Pertumbuhan moderat dengan risiko terkontrol", score: 2 },
      { label: "Maksimalkan return meskipun risiko tinggi", score: 3 },
    ],
  },
  {
    id: "q4",
    question: "Berapa persen pendapatan yang siap diinvestasikan?",
    options: [
      { label: "Kurang dari 10%", score: 1 },
      { label: "10% – 30%", score: 2 },
      { label: "Lebih dari 30%", score: 3 },
    ],
  },
  {
    id: "q5",
    question: "Pengalaman investasi Anda sebelumnya?",
    options: [
      { label: "Belum pernah investasi", score: 1 },
      { label: "Reksa dana / deposito", score: 2 },
      { label: "Saham / crypto / derivatif", score: 3 },
    ],
  },
];

type RiskProfile = "conservative" | "moderate" | "aggressive";

function calculateProfile(answers: Record<string, number>): RiskProfile {
  const total = Object.values(answers).reduce((sum, v) => sum + v, 0);
  if (total <= 7) return "conservative";
  if (total <= 11) return "moderate";
  return "aggressive";
}

const PROFILE_LABELS: Record<RiskProfile, { label: string; color: string; emoji: string; desc: string }> = {
  conservative: {
    label: "Konservatif",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    emoji: "🛡️",
    desc: "Prioritas menjaga modal. Cocok untuk deposito & obligasi.",
  },
  moderate: {
    label: "Moderat",
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    emoji: "⚖️",
    desc: "Keseimbangan risiko & return. Cocok untuk reksa dana campuran.",
  },
  aggressive: {
    label: "Agresif",
    color: "bg-red-500/10 text-red-600 border-red-200",
    emoji: "🚀",
    desc: "Kejar return maksimal. Cocok untuk saham & instrumen high-risk.",
  },
};

// ── Component ────────────────────────────────────────────────
interface RiskQuestionnaireInlineProps {
  onComplete: (profile: RiskProfile, answers: Record<string, number>) => void;
  initialProfile?: RiskProfile | null;
}

export function RiskQuestionnaireInline({ onComplete, initialProfile }: RiskQuestionnaireInlineProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isOpen, setIsOpen] = useState(!initialProfile);
  const [submitted, setSubmitted] = useState(!!initialProfile);

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);
  const currentProfile = initialProfile || (allAnswered ? calculateProfile(answers) : null);

  const handleSelect = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    const profile = calculateProfile(answers);
    setSubmitted(true);
    setIsOpen(false);
    onComplete(profile, answers);
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Kuisioner Profil Risiko</p>
            <p className="text-xs text-muted-foreground">
              {submitted && currentProfile
                ? `Profil: ${PROFILE_LABELS[currentProfile].emoji} ${PROFILE_LABELS[currentProfile].label}`
                : `${Object.keys(answers).length}/${QUESTIONS.length} pertanyaan dijawab`}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      {/* Body — expandable */}
      {isOpen && (
        <div className="p-4 pt-0 space-y-4 border-t border-border">
          {QUESTIONS.map((q, qi) => (
            <div key={q.id} className="pt-4">
              <p className="text-sm font-medium text-foreground mb-3">
                {qi + 1}. {q.question}
              </p>
              <div className="grid gap-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => handleSelect(q.id, opt.score)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                        selected
                          ? "border-primary bg-primary/5 text-foreground font-medium ring-1 ring-primary/30"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-linear-to-r from-violet-500 to-violet-600 text-white hover:shadow-lg hover:shadow-violet-500/25"
            >
              Hitung Profil Risiko
            </button>
          </div>
        </div>
      )}

      {/* Result badge — shown when submitted */}
      {submitted && currentProfile && !isOpen && (
        <div className={`mx-4 mb-4 p-3 rounded-lg border ${PROFILE_LABELS[currentProfile].color}`}>
          <p className="text-sm font-medium">
            {PROFILE_LABELS[currentProfile].emoji} {PROFILE_LABELS[currentProfile].label}
          </p>
          <p className="text-xs mt-1 opacity-80">
            {PROFILE_LABELS[currentProfile].desc}
          </p>
        </div>
      )}
    </div>
  );
}
