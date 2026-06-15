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

const datasets = [
  { name: "EOD Pricing Batch — 2026-06-13", records: "1,842", drift: "0.2%", status: "Approved", date: "2026-06-13" },
  { name: "Corporate Actions Feed", records: "57", drift: "1.8%", status: "Pending", date: "2026-06-13" },
  { name: "Index Constituents Refresh", records: "412", drift: "0.0%", status: "Approved", date: "2026-06-12" },
  { name: "Foreign Exchange Snapshot", records: "34", drift: "4.6%", status: "Rejected", date: "2026-06-12" },
  { name: "Dividend Schedule Import", records: "128", drift: "0.4%", status: "Approved", date: "2026-06-11" },
  { name: "Sector Classification Map", records: "96", drift: "0.0%", status: "Pending", date: "2026-06-11" },
  { name: "Bond Yield Curve", records: "240", drift: "2.1%", status: "Pending", date: "2026-06-10" },
  { name: "Warrant Pricing Batch", records: "318", drift: "5.2%", status: "Rejected", date: "2026-06-09" },
  { name: "ESG Score Refresh", records: "510", drift: "0.7%", status: "Approved", date: "2026-06-08" },
  { name: "Liquidity Metrics", records: "144", drift: "1.2%", status: "Approved", date: "2026-06-07" },
  { name: "Short Interest Feed", records: "62", drift: "3.4%", status: "Pending", date: "2026-06-06" },
  { name: "Analyst Ratings Import", records: "201", drift: "0.9%", status: "Approved", date: "2026-06-05" },
];

export default function StagingAnalyticsReview() {
  const ctrl = useRecordControls(datasets, {
    searchKeys: (r) => [r.name, r.status, r.drift],
    status: (r) => r.status,
    date: (r) => r.date,
    name: (r) => r.name,
  });

  return (
    <ModuleShell
      process="Process 3.0 — Staging Environment Management"
      title="Staging Analytics Review"
      subtitle="Inspect validated datasets in the staging environment and confirm analytical integrity before release."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Datasets in Staging" value={String(ctrl.counts.All)} hint="Matching current search" />
        <StatCard label="Pending Review" value={String(ctrl.counts.Pending ?? 0)} hint="Analyst sign-off needed" />
        <StatCard label="Approved" value={String(ctrl.counts.Approved ?? 0)} hint="Integrity confirmed" />
        <StatCard label="Rejected" value={String(ctrl.counts.Rejected ?? 0)} hint="Above drift threshold" />
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
                placeholder="Dataset, status, drift..."
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
                    <th className="pb-3 pr-4 font-semibold">Dataset</th>
                    <th className="pb-3 pr-4 font-semibold">Records</th>
                    <th className="pb-3 pr-4 font-semibold">Drift</th>
                    <th className="pb-3 pr-4 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ctrl.view.map((d) => (
                    <tr key={d.name} className="text-slate-200">
                      <td className="py-3 pr-4 font-semibold">{d.name}</td>
                      <td className="py-3 pr-4 text-slate-400">{d.records}</td>
                      <td className="py-3 pr-4 text-slate-400">{d.drift}</td>
                      <td className="py-3 pr-4 text-slate-400">{d.date}</td>
                      <td className="py-3">
                        <StatusBadge status={d.status.toLowerCase() as "approved" | "pending" | "rejected"} />
                      </td>
                    </tr>
                  ))}
                  {ctrl.view.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                        No datasets match your filters.
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