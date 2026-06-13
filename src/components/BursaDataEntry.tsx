import { useState } from "react";
import ModuleShell, { StatCard, Panel, StatusBadge } from "./ModuleShell";

const queue = [
  { id: "BRS-20460", instrument: "MAYBANK (1155)", field: "Closing Price", value: "RM 9.84", status: "pending" as const },
  { id: "BRS-20461", instrument: "TENAGA (5347)", field: "Volume", value: "4,210,500", status: "approved" as const },
  { id: "BRS-20462", instrument: "CIMB (1023)", field: "Closing Price", value: "RM 6.71", status: "rejected" as const },
  { id: "BRS-20463", instrument: "PBBANK (1295)", field: "Dividend", value: "RM 0.19", status: "pending" as const },
];

export default function BursaDataEntry() {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");

  return (
    <ModuleShell
      process="Process 2.0 — Financial Data Validation Submodule"
      title="Bursa Data Entry"
      subtitle="Capture and validate Bursa Malaysia market data before it is promoted to the staging environment."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Submitted Today" value="318" hint="Across all instruments" />
        <StatCard label="Awaiting Validation" value="24" hint="In review queue" />
        <StatCard label="Validation Errors" value="6" hint="Flagged by rules engine" />
        <StatCard label="Pass Rate" value="98.1%" hint="Last 30 days" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Panel title="New Data Submission">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Instrument Symbol
                </label>
                <input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. MAYBANK (1155)"
                  className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Closing Price (RM)
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
                />
              </div>
              <button className="w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0B192C] hover:bg-emerald-400">
                Submit for Validation
              </button>
              <p className="text-[11px] text-slate-500">
                Submissions run through automated range, format, and consistency checks before staging.
              </p>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel title="Validation Queue">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Ref</th>
                    <th className="pb-3 pr-4 font-semibold">Instrument</th>
                    <th className="pb-3 pr-4 font-semibold">Field</th>
                    <th className="pb-3 pr-4 font-semibold">Value</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {queue.map((r) => (
                    <tr key={r.id} className="text-slate-200">
                      <td className="py-3 pr-4 font-mono text-xs text-slate-400">{r.id}</td>
                      <td className="py-3 pr-4 font-semibold">{r.instrument}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.field}</td>
                      <td className="py-3 pr-4">{r.value}</td>
                      <td className="py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </ModuleShell>
  );
}
