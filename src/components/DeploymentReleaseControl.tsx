import { useState } from "react";
import ModuleShell, { StatCard, Panel, StatusBadge } from "./ModuleShell";
import {
  useRecordControls,
  FilterChips,
  SearchInput,
  SortControl,
  PaginationBar,
  Toolbar,
} from "./records/tableControls";

const releases = [
  { tag: "v4.12.0", env: "Production", gate: "Approved", sign: "M. Lee", date: "2026-06-12" },
  { tag: "v4.13.0-rc1", env: "Pre-Prod", gate: "Pending", sign: "—", date: "2026-06-13" },
  { tag: "v4.11.4", env: "Production", gate: "Approved", sign: "D. Wong", date: "2026-06-09" },
  { tag: "v4.13.0-rc0", env: "Pre-Prod", gate: "Rejected", sign: "M. Lee", date: "2026-06-11" },
  { tag: "v4.11.3", env: "Production", gate: "Approved", sign: "D. Wong", date: "2026-06-05" },
  { tag: "v4.11.2-rc2", env: "Pre-Prod", gate: "Rejected", sign: "W. Tan", date: "2026-06-03" },
  { tag: "v4.11.2", env: "Production", gate: "Approved", sign: "M. Lee", date: "2026-06-01" },
  { tag: "v4.12.1-rc1", env: "Pre-Prod", gate: "Pending", sign: "—", date: "2026-06-13" },
  { tag: "v4.10.9", env: "Production", gate: "Approved", sign: "D. Wong", date: "2026-05-28" },
  { tag: "v4.10.8-rc1", env: "Pre-Prod", gate: "Pending", sign: "—", date: "2026-05-26" },
  { tag: "v4.10.7", env: "Production", gate: "Approved", sign: "W. Tan", date: "2026-05-22" },
];

const gates = [
  ["Staging review signed off", true],
  ["Security scan cleared", true],
  ["Data drift within tolerance", true],
  ["Change advisory approval", false],
  ["Rollback plan attached", false],
] as const;

export default function DeploymentReleaseControl() {
  const ctrl = useRecordControls(releases, {
    searchKeys: (r) => [r.tag, r.env, r.sign, r.gate],
    status: (r) => r.gate,
    date: (r) => r.date,
    name: (r) => r.tag,
  });

  return (
    <ModuleShell
      process="Processes 4.0 & 5.0 — Gatekeeping Mechanism"
      title="Deployment Release Control"
      subtitle="Final gatekeeping authority over releases — enforce sign-offs and promote builds from pre-prod to production."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Builds" value={String(ctrl.counts.All)} hint="Matching current search" />
        <StatCard label="Awaiting Gate" value={String(ctrl.counts.Pending ?? 0)} hint="Release candidates" />
        <StatCard label="Approved" value={String(ctrl.counts.Approved ?? 0)} hint="Promoted to prod" />
        <StatCard label="Blocked" value={String(ctrl.counts.Rejected ?? 0)} hint="Failed gate checks" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Panel title="Release Pipeline">
            <Toolbar>
              <FilterChips
                statuses={ctrl.statuses}
                counts={ctrl.counts}
                active={ctrl.statusFilter}
                onChange={ctrl.setStatusFilter}
              />
              <SearchInput
                value={ctrl.search}
                onChange={ctrl.setSearch}
                placeholder="Build, environment, sign-off..."
              />
            </Toolbar>
            <div className="mb-3">
              <SortControl
                sortKey={ctrl.sortKey}
                sortDir={ctrl.sortDir}
                onSort={ctrl.setSort}
                withName={false}
              />
            </div>
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
                  {ctrl.view.map((r) => (
                    <tr key={r.tag} className="text-slate-200">
                      <td className="py-3 pr-4 font-mono text-xs">{r.tag}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.env}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.sign}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.date}</td>
                      <td className="py-3">
                        <StatusBadge status={r.gate.toLowerCase() as "approved" | "pending" | "rejected"} />
                      </td>
                    </tr>
                  ))}
                  {ctrl.view.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                        No builds match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <PaginationBar
              rangeStart={ctrl.rangeStart}
              rangeEnd={ctrl.rangeEnd}
              total={ctrl.total}
              page={ctrl.page}
              pageCount={ctrl.pageCount}
              pageSize={ctrl.pageSize}
              onPage={ctrl.setPage}
              onPageSize={ctrl.setPageSize}
            />
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