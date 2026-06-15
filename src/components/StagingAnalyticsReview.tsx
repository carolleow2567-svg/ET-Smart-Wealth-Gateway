import { useState, useEffect, useMemo, useCallback } from "react";
import ModuleShell, { StatCard, Panel, StatusBadge } from "./ModuleShell";
import {
  useRecordControls,
  FilterChips,
  SearchInput,
  SortControl,
  PaginationBar,
  Toolbar,
} from "./records/tableControls";
import DatasetPreview from "./DatasetPreview";
import type { StagingDataset, ReviewEntry, ValidationCheck } from "../lib/api/staging";
import { stagingService } from "../lib/api/staging";

type ModalType = "preview" | "review" | "approve" | "reject" | null;

interface ModalState {
  type: ModalType;
  dataset?: StagingDataset;
}

function ValidationBadge({ status }: { status: "Passed" | "Warning" | "Failed" }) {
  const styles: Record<string, string> = {
    Passed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Failed: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function StagingAnalyticsReview() {
  const [datasets, setDatasets] = useState<StagingDataset[]>([]);
  const [reviewHistory, setReviewHistory] = useState<ReviewEntry[]>([]);
  const [validationChecks, setValidationChecks] = useState<Record<string, ValidationCheck[]>>({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewerName, setReviewerName] = useState("System Admin");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ds, history, checks] = await Promise.all([
        stagingService.list(),
        stagingService.getReviewHistory(),
        stagingService.getValidationChecks(),
      ]);
      setDatasets(ds);
      setReviewHistory(history);
      setValidationChecks(checks);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Map datasets to the shape useRecordControls expects
  const tableRows = useMemo(
    () =>
      datasets.map((d) => ({
        id: d.id,
        name: d.datasetName,
        records: d.recordCount,
        validation: d.validationStatus,
        drift: d.dataDriftPct,
        date: d.lastUpdated,
        reviewer: d.reviewer,
        reviewStatus: d.reviewStatus,
        status: d.reviewStatus,
      })),
    [datasets],
  );

  // Compute counts from ALL datasets
  const totalDatasets = datasets.length;
  const pendingReview = datasets.filter((d) => d.reviewStatus === "Pending").length;
  const approved = datasets.filter((d) => d.reviewStatus === "Approved").length;
  const rejected = datasets.filter((d) => d.reviewStatus === "Rejected").length;

  const ctrl = useRecordControls(tableRows, {
    searchKeys: (r) => [r.name, r.validation, String(r.drift), r.reviewer, r.reviewStatus],
    status: (r) => r.status,
    date: (r) => r.date,
    name: (r) => r.name,
    statuses: ["Approved", "Pending", "Rejected"],
  });

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleApprove = async () => {
    if (!modal.dataset) return;
    await stagingService.review(modal.dataset.id, "Approved", reviewNotes, reviewerName);
    await loadData();
    setSuccessMessage(`"${modal.dataset.datasetName}" has been approved.`);
    setModal({ type: null });
    setReviewNotes("");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleReject = async () => {
    if (!modal.dataset) return;
    await stagingService.review(modal.dataset.id, "Rejected", reviewNotes, reviewerName);
    await loadData();
    setSuccessMessage(`"${modal.dataset.datasetName}" has been rejected.`);
    setModal({ type: null });
    setReviewNotes("");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <ModuleShell
      process="Process 3.0 — Staging Environment Management"
      title="Staging Analytics Review"
      subtitle="Inspect validated datasets in the staging environment and confirm analytical integrity before release."
    >
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Records in Staging" value={String(totalDatasets)} hint="Total datasets staged" />
        <StatCard label="Pending Review" value={String(pendingReview)} hint="Awaiting analyst sign-off" />
        <StatCard label="Approved" value={String(approved)} hint="Integrity confirmed" />
        <StatCard label="Rejected" value={String(rejected)} hint="Below quality threshold" />
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Table Panel */}
        <div className="lg:col-span-2">
          <Panel
            title="Staged Datasets"
            action={
              <button
                onClick={() => loadData()}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                Refresh Data
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
                placeholder="Dataset, status, reviewer..."
              />
            </Toolbar>

            <div className="mb-3">
              <SortControl
                sortKey={ctrl.sortKey}
                sortDir={ctrl.sortDir}
                onSort={ctrl.setSort}
                nameLabel="Dataset"
                withDate={true}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Dataset Name</th>
                    <th className="pb-3 pr-4 font-semibold">Records</th>
                    <th className="pb-3 pr-4 font-semibold">Validation</th>
                    <th className="pb-3 pr-4 font-semibold">Data Drift %</th>
                    <th className="pb-3 pr-4 font-semibold">Last Updated</th>
                    <th className="pb-3 pr-4 font-semibold">Reviewer</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ctrl.view.map((row) => {
                    const ds = datasets.find((d) => d.id === row.id)!;
                    return (
                      <tr key={row.id} className="text-slate-200">
                        <td className="py-3 pr-4 font-semibold whitespace-nowrap">{row.name}</td>
                        <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{row.records.toLocaleString()}</td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          <ValidationBadge status={ds.validationStatus} />
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          <span
                            className={`font-mono text-xs ${
                              ds.dataDriftPct > 3
                                ? "text-rose-400"
                                : ds.dataDriftPct > 1
                                  ? "text-amber-400"
                                  : "text-slate-400"
                            }`}
                          >
                            {ds.dataDriftPct.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{row.date}</td>
                        <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{row.reviewer}</td>
                        <td className="py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setModal({ type: "preview", dataset: ds })}
                              className="rounded-md border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                              title="Preview dataset"
                            >
                              Preview
                            </button>
                            {ds.reviewStatus === "Pending" && (
                              <>
                                <button
                                  onClick={() => {
                                    setModal({ type: "approve", dataset: ds });
                                    setReviewNotes("");
                                  }}
                                  className="rounded-md border border-emerald-700 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/30"
                                  title="Approve dataset"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setModal({ type: "reject", dataset: ds });
                                    setReviewNotes("");
                                  }}
                                  className="rounded-md border border-rose-700 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-900/30"
                                  title="Reject dataset"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {ds.reviewStatus !== "Pending" && (
                              <button
                                onClick={() => setModal({ type: "review", dataset: ds })}
                                className="rounded-md border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                                title="View review details"
                              >
                                Details
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {ctrl.view.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
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

        {/* Right Column: Validation + Review History */}
        <div className="lg:col-span-1 space-y-6">
          {/* Validation Results */}
          <Panel title="Validation Results">
            {loading ? (
              <p className="text-xs text-slate-500">Loading...</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(validationChecks).map(([category, checks]) => (
                  <div key={category}>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {category}
                    </h4>
                    <ul className="space-y-2">
                      {checks.map((check) => (
                        <li key={check.label} className="flex items-center gap-2 text-xs">
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                              check.status === "Passed"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : check.status === "Warning"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {check.status === "Passed" ? "✓" : check.status === "Warning" ? "!" : "✕"}
                          </span>
                          <span className="text-slate-300">{check.label}</span>
                          <span
                            className={`ml-auto shrink-0 text-[10px] font-semibold ${
                              check.status === "Passed"
                                ? "text-emerald-500"
                                : check.status === "Warning"
                                  ? "text-amber-500"
                                  : "text-rose-500"
                            }`}
                          >
                            {check.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Review History */}
          <Panel title="Review History">
            {loading ? (
              <p className="text-xs text-slate-500">Loading...</p>
            ) : reviewHistory.length === 0 ? (
              <p className="text-xs text-slate-500">No reviews yet.</p>
            ) : (
              <div className="space-y-0">
                {reviewHistory.map((r) => (
                  <div
                    key={r.id}
                    className="border-b border-slate-800 py-3 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{r.reviewer}</span>
                      <StatusBadge
                        status={
                          r.action.toLowerCase() as "approved" | "pending" | "rejected"
                        }
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {r.datasetName}
                    </p>
                    {r.notes && (
                      <p className="mt-1 text-xs italic text-slate-500">"{r.notes}"</p>
                    )}
                    <p className="mt-0.5 text-[11px] text-slate-600">{r.date}</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      {/* ── Dataset Preview Modal ──────────────────────────────────────────── */}
      {modal.type === "preview" && modal.dataset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{modal.dataset.datasetName}</h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  {modal.dataset.recordCount.toLocaleString()} records · {modal.dataset.dataDriftPct.toFixed(1)}% drift · Last updated {modal.dataset.lastUpdated}
                </p>
              </div>
              <button
                onClick={() => setModal({ type: null })}
                className="rounded-md border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
            <DatasetPreview preview={modal.dataset.preview} />
          </div>
        </div>
      )}

      {/* ── Review Details Modal ───────────────────────────────────────────── */}
      {modal.type === "review" && modal.dataset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Review Details</h3>
            <p className="mt-1 text-sm font-semibold text-slate-200">{modal.dataset.datasetName}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Review Status:</span>
                <StatusBadge
                  status={modal.dataset.reviewStatus.toLowerCase() as "approved" | "pending" | "rejected"}
                />
              </div>
              <div>
                <span className="text-xs text-slate-400">Reviewer:</span>
                <p className="text-sm text-slate-200">{modal.dataset.reviewer || "Not assigned"}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Notes:</span>
                <p className="text-sm text-slate-200">
                  {modal.dataset.notes || "No notes provided."}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModal({ type: null })}
                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Approve / Reject Modal ─────────────────────────────────────────── */}
      {(modal.type === "approve" || modal.type === "reject") && modal.dataset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">
              {modal.type === "approve" ? "Approve Dataset" : "Reject Dataset"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{modal.dataset.datasetName}</p>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Reviewer Name
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
              />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Review Notes
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
                placeholder="Add your review notes here..."
                className="w-full resize-none rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setModal({ type: null })}
                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={modal.type === "approve" ? handleApprove : handleReject}
                className={`rounded-md px-4 py-2 text-sm font-bold text-[#0B192C] ${
                  modal.type === "approve"
                    ? "bg-emerald-500 hover:bg-emerald-400"
                    : "bg-rose-500 hover:bg-rose-400"
                }`}
              >
                {modal.type === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}