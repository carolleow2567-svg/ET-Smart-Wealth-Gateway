import { useState } from "react";

const steps = [
  { title: "Business Details", desc: "Legal entity name, registration number, and jurisdiction." },
  { title: "Beneficial Owners", desc: "Identify individuals owning 25% or more of the company." },
  { title: "Document Upload", desc: "Certificate of incorporation and proof of address." },
  { title: "Identity Verification", desc: "Automated checks against global watchlists." },
  { title: "Review & Submit", desc: "Confirm details and submit for approval." },
];

export default function AutomatedOnboardingWizard() {
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-[#0B192C] text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Automated Onboarding Wizard</h1>
          <p className="mt-1 text-slate-400">Complete your e-KYC verification to activate your account.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps */}
          <ol className="lg:col-span-1 space-y-2">
            {steps.map((s, i) => {
              const isActive = i === active;
              const isDone = i < active;
              return (
                <li key={s.title}>
                  <button
                    onClick={() => setActive(i)}
                    className={`w-full text-left flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                      isActive
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-900/40 hover:bg-slate-800/60"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isActive || isDone ? "bg-emerald-500 text-[#0B192C]" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </span>
                    <span className="text-sm font-medium">{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Panel */}
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-bold">{steps[active].title}</h2>
            <p className="mt-1 text-sm text-slate-400">{steps[active].desc}</p>

            <div className="mt-6 space-y-4">
              <input
                placeholder="Enter information..."
                className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500 focus:ring-2"
              />
              <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
                Drag &amp; drop documents here, or click to browse
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setActive((i) => Math.max(0, i - 1))}
                disabled={active === 0}
                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setActive((i) => Math.min(steps.length - 1, i + 1))}
                className="rounded-md bg-emerald-500 px-5 py-2 text-sm font-bold text-[#0B192C] hover:bg-emerald-400 transition-colors"
              >
                {active === steps.length - 1 ? "Submit" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
