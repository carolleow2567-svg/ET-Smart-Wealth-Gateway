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
import type {
  ReleaseRecord,
  ReleaseLogEntry,
  DeployChecklistItem,
} from "../lib/api/deployment";
import { deploymentService } from "../lib/api/deployment";

type ModalType = "checklist" | "promote" | "schedule" | "rollback" | "logs" | null;

interface ModalState {
  type: ModalType;
  release?: ReleaseRecord;
}

function DeployStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Released: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    "Ready For Release": "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Failed: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    "Rolled Back": "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        styles[status] ?? "bg-slate-800 text-slate-400 border-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function DeploymentReleaseControl() {
  const [releases, setReleases] = useState<ReleaseRecord[]>([]);
  const [releaseLogs, setReleaseLogs] = useState<ReleaseLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [checklist, setChecklist] = useState<DeployChecklistItem[]>([]);
  const [userName, setUserName] = useState("System Admin");
  const [rollbackReason, setRollbackReason] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [r, logs] = await Promise.all([
        deploymentService.list(),
        deploymentService.getReleaseLogs(),
      ]);
      setReleases(r);
      setReleaseLogs(logs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute dashboard counts
  const readyForRelease = releases.filter((r) => r.status === "Ready For Release").length;
  const released = releases.filter((r) => r.status === "Released").length;
  const failed = releases.filter((r) => r.status === "Failed").length;
  const rolledBack = releases.filter((r) => r.status === "Rolled Back").length;

  const tableRows = useMemo(
    () =>
      releases.map((r) => ({
        id: r.id,
        releaseId: r.releaseId,
        environment: r.environment,
        version: r.version,
        status: r.status,
        approvedBy: r.approvedBy,
        releaseDate: r.releaseDate,
      })),
    [releases],
  );

  const ctrl = useRecordControls(tableRows, {
    searchKeys: (r) => [r.releaseId, r.version, r.environment, r.status, r.approvedBy],
    status: (r) => r.status,
    date: (r) => r.releaseDate,
    name: (r) => r.releaseId,
    statuses: ["Ready For Release", "Released", "Failed", "Rolled Back"],
  });

  // ── Actions ──────────────────────────────────────────────────────────────

  const openChecklist = async (release: ReleaseRecord) => {
    const items = await deploymentService.getChecklist(release.id);
    setChecklist(items);
    setModal({ type: "checklist", release });
  };

  const toggleChecklistItem = async (key: string) => {
    if (!modal.release) return;
    const items = await deploymentService.toggleChecklistItem(modal.release.id, key);
    setChecklist(items);
  };

  const handlePromote = async () => {
    if (!modal.release) return;
    await deploymentService.promoteToProduction(modal.release.id, userName);
    await loadData();
    setSuccessMessage(`${modal.release.version} promoted to Production.`);
    setModal({ type: null });
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSchedule = async () => {
    if (!modal.release || !scheduleDate) return;
    await deploymentService.scheduleRelease(modal.release.id, scheduleDate, userName);
    await loadData();
    setSuccessMessage(`${modal.release.version} scheduled for ${scheduleDate}.`);
    setModal({ type: null });
    setScheduleDate("");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleRollback = async () => {
    if (!modal.release) return;
    await deploymentService.rollbackRelease(modal.release.id, userName, rollbackReason);
    await loadData();
    setSuccessMessage(`${modal.release.version} rolled back.`);
    setModal({ type: null });
    setRollbackReason("");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const openLogs = async (release?: ReleaseRecord) => {
    setModal({ type: "logs", release });
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <ModuleShell
      process="Processes 4.0 & 5.0 — Gatekeeping Mechanism"
      title="Deployment Release Control"
      subtitle="Final gatekeeping authority over releases — enforce sign-offs and promote builds from staging to production."
    >
      {/* Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Ready For Release" value={String(readyForRelease)} hint="Awaiting deployment" />
        <StatCard label="Released" value={String(released)} hint="Promoted to production" />
        <StatCard label="Failed Releases" value={String(failed)} hint="Deployment failures" />
        <StatCard label="Rollbacks" value={String(rolledBack)} hint="Reverted deployments" />
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2">
          <Panel title="Release Pipeline" action={null}>
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
                placeholder="Release ID, version, environment..."
              />
            </Toolbar>

            <div className="mb-3">
              <SortControl
                sortKey={ctrl.sortKey}
                sortDir={ctrl.sortDir}
                onSort={ctrl.setSort}
                nameLabel="Release"
                withName={false}
                withDate={true}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Release ID</th>
                    <th className="pb-3 pr-4 font-semibold">Version</th>
                    <th className="pb-3 pr-4 font-semibold">Environment</th>
                    <th className="pb-3 pr-4 font-semibold">Status</th>
                    <th className="pb-3 pr-4 font-semibold">Approved By</th>
                    <th className="pb-3 pr-4 font-semibold">Release Date</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ctrl.view.map((row) => {
                    const release = releases.find((r) => r.id === row.id)!;
                    const isPreProd = row.environment === "Pre-Prod";
                    const isReady = row.status === "Ready For Release";
                    const isReleased = row.status === "Released";

                    return (
                      <tr key={row.id} className="text-slate-200">
                        <td className="py-3 pr-4 font-mono text-xs whitespace-nowrap">
                          {row.releaseId}
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs whitespace-nowrap">
                          {row.version}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          <span
                            className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              row.environment === "Production"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            }`}
                          >
                            {row.environment}
                          </span>
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          <DeployStatusBadge status={row.status} />
                        </td>
                        <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">
                          {row.approvedBy}
                        </td>
                        <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">
                          {row.releaseDate}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openChecklist(release)}
                              className="rounded-md border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                            >
                              Checklist
                            </button>
                            {isPreProd && isReady && (
                              <button
                                onClick={() => {
                                  setModal({ type: "promote", release });
                                }}
                                className="rounded-md border border-emerald-700 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/30"
                              >
                                Promote
                              </button>
                            )}
                            {isPreProd && (
                              <button
                                onClick={() => {
                                  setScheduleDate("");
                                  setModal({ type: "schedule", release });
                                }}
                                className="rounded-md border border-blue-700 px-2.5 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-900/30"
                              >
                                Schedule
                              </button>
                            )}
                            {isReleased && (
                              <button
                                onClick={() => {
                                  setRollbackReason("");
                                  setModal({ type: "rollback", release });
                                }}
                                className="rounded-md border border-rose-700 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-900/30"
                              >
                                Rollback
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
                        No releases match your filters.
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

        {/* Right Sidebar: Release Logs */}
        <div className="lg:col-span-1">
          <Panel
            title="Release History"
            action={
              <button
                onClick={() => openLogs()}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                View All
              </button>
            }
          >
            {loading ? (
              <p className="text-xs text-slate-500">Loading...</p>
            ) : releaseLogs.length === 0 ? (
              <p className="text-xs text-slate-500">No logs yet.</p>
            ) : (
              <div className="space-y-0">
                {releaseLogs.slice(0, 6).map((log) => (
                  <div
                    key={log.id}
                    className="border-b border-slate-800 py-3 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-white">
                        {log.version}
                      </span>
                      <DeployStatusBadge status={log.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{log.action}</p>
                    <p className="mt-0.5 text-[11px] text-slate-600">
                      {log.user} · {log.date}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      {/* ── Checklist Modal ────────────────────────────────────────────────── */}
      {modal.type === "checklist" && modal.release && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Deployment Checklist</h3>
            <p className="mt-1 text-sm text-slate-300">
              {modal.release.version} · {modal.release.releaseId}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{modal.release.environment}</p>

            <ul className="mt-5 space-y-3">
              {checklist.map((item) => (
                <li key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        item.passed
                          ? "bg-emerald-500 text-[#0B192C]"
                          : "bg-slate-700 text-slate-400"
                      }`}
                      onClick={() => toggleChecklistItem(item.key)}
                    >
                      {item.passed ? "✓" : ""}
                    </span>
                    <span className={item.passed ? "text-slate-200" : "text-slate-500"}>
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      item.passed ? "text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    {item.passed ? "Passed" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <div className="flex items-center justify-between rounded-md bg-slate-800/60 px-4 py-3">
                <span className="text-xs text-slate-400">Gate Status</span>
                <span
                  className={`text-xs font-bold ${
                    checklist.every((c) => c.passed)
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {checklist.every((c) => c.passed) ? "All Checks Passed" : "Pending Items"}
                </span>
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

      {/* ── Promote Modal ──────────────────────────────────────────────────── */}
      {modal.type === "promote" && modal.release && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Promote to Production</h3>
            <p className="mt-1 text-sm text-slate-300">
              {modal.release.version} · {modal.release.releaseId}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              This will deploy {modal.release.version} from Pre-Prod to Production.
            </p>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
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
                onClick={handlePromote}
                className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0B192C] hover:bg-emerald-400"
              >
                Promote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Schedule Modal ─────────────────────────────────────────────────── */}
      {modal.type === "schedule" && modal.release && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Schedule Release</h3>
            <p className="mt-1 text-sm text-slate-300">{modal.release.version}</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:ring-2"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setModal({ type: null })}
                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!scheduleDate}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-400 disabled:opacity-50"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Rollback Modal ─────────────────────────────────────────────────── */}
      {modal.type === "rollback" && modal.release && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Rollback Release</h3>
            <p className="mt-1 text-sm text-slate-300">
              {modal.release.version} · {modal.release.releaseId}
            </p>
            <p className="mt-0.5 text-xs text-rose-400">
              Warning: This will revert {modal.release.version} from Production.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Reason for Rollback
                </label>
                <textarea
                  value={rollbackReason}
                  onChange={(e) => setRollbackReason(e.target.value)}
                  rows={3}
                  placeholder="Describe why this release needs to be rolled back..."
                  className="w-full resize-none rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-rose-500 focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-rose-500 focus:ring-2"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setModal({ type: null })}
                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRollback}
                disabled={!rollbackReason.trim()}
                className="rounded-md bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-400 disabled:opacity-50"
              >
                Rollback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Logs Modal ─────────────────────────────────────────────────────── */}
      {modal.type === "logs" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Release History</h3>
              <button
                onClick={() => setModal({ type: null })}
                className="rounded-md border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800 text-left text-xs uppercase text-slate-500">
                    <th className="px-3 py-2 font-semibold">Version</th>
                    <th className="px-3 py-2 font-semibold">User</th>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {releaseLogs.map((log) => (
                    <tr key={log.id} className="text-slate-200">
                      <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                        {log.version}
                      </td>
                      <td className="px-3 py-2 text-xs whitespace-nowrap">{log.user}</td>
                      <td className="px-3 py-2 text-xs text-slate-400 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <DeployStatusBadge status={log.status} />
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-400">{log.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}