import ModuleShell, { StatCard, Panel, StatusBadge } from "./ModuleShell";

const datasets = [
  { name: "EOD Pricing Batch — 2026-06-13", records: "1,842", drift: "0.2%", status: "approved" as const },
  { name: "Corporate Actions Feed", records: "57", drift: "1.8%", status: "pending" as const },
  { name: "Index Constituents Refresh", records: "412", drift: "0.0%", status: "approved" as const },
  { name: "Foreign Exchange Snapshot", records: "34", drift: "4.6%", status: "rejected" as const },
];

export default function StagingAnalyticsReview() {
  return (
    <ModuleShell
      process="Process 3.0 — Staging Environment Management"
      title="Staging Analytics Review"
      subtitle="Inspect validated datasets in the staging environment and confirm analytical integrity before release."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Datasets in Staging" value="18" hint="Promoted from data entry" />
        <StatCard label="Pending Review" value="5" hint="Analyst sign-off needed" />
        <StatCard label="Anomalies Detected" value="2" hint="Above drift threshold" />
        <StatCard label="Avg. Data Drift" value="1.3%" hint="Vs. prior baseline" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Panel
            title="Staged Datasets"
            action={
              <button className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800">
                Run Drift Analysis
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Dataset</th>
                    <th className="pb-3 pr-4 font-semibold">Records</th>
                    <th className="pb-3 pr-4 font-semibold">Drift</th>
                    <th className="pb-3 font-semibold">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {datasets.map((d) => (
                    <tr key={d.name} className="text-slate-200">
                      <td className="py-3 pr-4 font-semibold">{d.name}</td>
                      <td className="py-3 pr-4 text-slate-400">{d.records}</td>
                      <td className="py-3 pr-4 text-slate-400">{d.drift}</td>
                      <td className="py-3"><StatusBadge status={d.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-1">
          <Panel title="Integrity Checks">
            <ul className="space-y-3 text-sm">
              {[
                ["Schema conformance", "Passed"],
                ["Duplicate detection", "Passed"],
                ["Null-rate threshold", "Passed"],
                ["Cross-source reconciliation", "1 warning"],
                ["Outlier scan", "2 anomalies"],
              ].map(([label, result]) => (
                <li key={label} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0">
                  <span className="text-slate-300">{label}</span>
                  <span className="text-xs font-semibold text-slate-400">{result}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </ModuleShell>
  );
}
