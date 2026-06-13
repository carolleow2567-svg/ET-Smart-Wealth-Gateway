import ModuleShell, { StatCard, Panel, StatusBadge } from "./ModuleShell";

const releases = [
  { tag: "v4.12.0", env: "Production", gate: "approved" as const, sign: "M. Lee", date: "2026-06-12" },
  { tag: "v4.13.0-rc1", env: "Pre-Prod", gate: "pending" as const, sign: "—", date: "2026-06-13" },
  { tag: "v4.11.4", env: "Production", gate: "approved" as const, sign: "D. Wong", date: "2026-06-09" },
  { tag: "v4.13.0-rc0", env: "Pre-Prod", gate: "rejected" as const, sign: "M. Lee", date: "2026-06-11" },
];

const gates = [
  ["Staging review signed off", true],
  ["Security scan cleared", true],
  ["Data drift within tolerance", true],
  ["Change advisory approval", false],
  ["Rollback plan attached", false],
] as const;

export default function DeploymentReleaseControl() {
  return (
    <ModuleShell
      process="Processes 4.0 & 5.0 — Gatekeeping Mechanism"
      title="Deployment Release Control"
      subtitle="Final gatekeeping authority over releases — enforce sign-offs and promote builds from pre-prod to production."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Awaiting Gate" value="1" hint="Release candidates" />
        <StatCard label="Approved (30d)" value="9" hint="Promoted to prod" />
        <StatCard label="Blocked" value="2" hint="Failed gate checks" />
        <StatCard label="Mean Lead Time" value="2.4d" hint="Entry → production" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Panel title="Release Pipeline">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Build</th>
                    <th className="pb-3 pr-4 font-semibold">Environment</th>
                    <th className="pb-3 pr-4 font-semibold">Sign-off</th>
                    <th className="pb-3 pr-4 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {releases.map((r) => (
                    <tr key={r.tag} className="text-slate-200">
                      <td className="py-3 pr-4 font-mono text-xs">{r.tag}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.env}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.sign}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.date}</td>
                      <td className="py-3"><StatusBadge status={r.gate} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-1">
          <Panel title="Gate Checklist — v4.13.0-rc1">
            <ul className="space-y-3 text-sm">
              {gates.map(([label, done]) => (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                      done ? "bg-emerald-500 text-[#0B192C]" : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {done ? "✓" : ""}
                  </span>
                  <span className={done ? "text-slate-200" : "text-slate-500"}>{label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-md bg-emerald-500 px-3 py-2 text-xs font-bold text-[#0B192C] hover:bg-emerald-400 disabled:opacity-40" disabled>
                Approve Release
              </button>
              <button className="flex-1 rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20">
                Block
              </button>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              All gate items must pass before promotion to production is permitted.
            </p>
          </Panel>
        </div>
      </div>
    </ModuleShell>
  );
}
