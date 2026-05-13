export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { step: 1, label: "Data Diri" },
    { step: 2, label: "Info Finansial" },
    { step: 3, label: "Proyeksi Pensiun" },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map(({ step, label }, i) => {
        const done = current > step;
        const active = current === step;
        return (
          <div key={step} className="flex items-center gap-2">
            {i > 0 && (
              <div className={`h-px w-8 sm:w-12 transition-colors ${done ? "bg-emerald-400" : "bg-gray-200"}`} />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  done ? "bg-emerald-500 text-white" : active ? "text-white" : "bg-gray-100 text-gray-400"
                }`}
                style={active ? { background: "linear-gradient(135deg, #10b981, #14b8a6)" } : undefined}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : step}
              </div>
              <span className={`text-sm hidden sm:block transition-colors ${
                active ? "text-gray-900 font-medium" : done ? "text-emerald-500" : "text-gray-400"
              }`}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}