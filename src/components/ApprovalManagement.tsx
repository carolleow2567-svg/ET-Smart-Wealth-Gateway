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
import ApprovalTimeline from "./ApprovalTimeline";
import type { ApprovalRecord, ApprovalTimelineEntry, ApprovalHistoryEntry } from "../lib/api/approvals";
import { approvalService, ALL_STAGES } from "../lib/api/approvals";

type ModalType = "timeline" | "history" | "action" | null;

interface ModalState {
  type: ModalType;
  record?: ApprovalRecord;
  actionType?: "approve" | "reject" | "revision";
}

export default function ApprovalManagement() {
  const [records, setRecords] = useState<ApprovalRecord[]>([]);
  const [allHistory, setAllHistory] = useState<ApprovalHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("System Admin");
  const [userRole, setUserRole] = useState("System Administrator");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Timeline & history loaded for modal display
  const [modalTimeline, setModalTimeline] = useState<ApprovalTimelineEntry[]>([]);
  const [modalHistory, setModalHistory] = useState<ApprovalHistoryEntry[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [r, h] = await Promise.all([
        approvalService.list(),
        approvalService.getAllHistory(),
      ]);
      setRecords(r);
      setAllHistory(h);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute counts
  const totalRecords = records.length;
  const dataValidation = records.filter((r) => r.currentStage === "Data Department Validation").length;
  const techValidation = records.filter((r) => r.currentStage === "Tech Department Validation").length;
  const finalApproved = records.filter((r) => r.currentStage === "Deployment Ready").length;

  // Map for table
  const tableRows = useMemo(
    () =>
      records.map((r) => ({
        id: r.id,
        reportId: r.reportId,
        company: r.company,
        submittedBy: r.submittedBy,
        currentStage: r.currentStage,
        reviewer: r.reviewer,
        date: r.date,
        // For status-based filtering we use a synthetic status
        stageIdx: ALL_STAGES.indexOf(r.currentStage),
      })),
    [records],
  );

  const ctrl = useRecordControls(tableRows, {
    searchKeys: (r) => [r.reportId, r.company, r.submittedBy, r.currentStage, r.reviewer],
    status: (r) => r.currentStage,
    date: (r) => r.date,
    name: (r) => r.company,
    statuses: ALL_STAGES,
  });

  // ── Actions ──────────────────────────────────────────────────────────────

  const openActionModal = async (record: ApprovalRecord, actionType: "approve" | "reject" | "revision") => {
    setComment("");
    setModal({ type: "action", record, actionType });
  };

  const handleAction = async () => {
    if (!modal.record || !modal.actionType) return;
    try {
      if (modal.actionType === "approve") {
        await approvalService.approve(modal.record.id, comment, userName, userRole);
        setSuccessMessage(`"${modal.record.company}" approved. Stage progressed.`);
      } else if (modal.actionType === "reject") {
        await approvalService.reject(modal.record.id, comment, userName, userRole);
        setSuccessMessage(`"${modal.record.company}" rejected. Reset to Data Validation.`);
      } else {
        await approvalService.requestRevision(modal.record.id, comment, userName, userRole);
        setSuccessMessage(`Revision requested for "${modal.record.company}". Moved back one stage.`);
      }
      await loadData();
      setModal({ type: null });
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      // ignore
    }
  };

  const openTimeline = async (record: ApprovalRecord) => {
    const timeline = await approvalService.getTimeline(record.id);
    const history = await approvalService.getHistory(record.id);
    setModalTimeline(timeline);
    setModalHistory(history);
    setModal({ type: "timeline", record });
  };

  // ── Stage badge helper ──────────────────────────────────────────────────

  function StageBadge({ stage }: { stage: string }) {
    const idx = ALL_STAGES.indexOf(stage as any);
    const colors = [
      "bg-blue-500/15 text-blue-400 border-blue-500/30",
      "bg-purple-500/15 text-purple-400 border-purple-500/30",
      "bg-amber-500/15 text-amber-400 border-amber-500/30",
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    ];
    return (
      <span
        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
          colors[Math.min(idx, colors.length - 1)]
        }`}
      >
        {stage}
      </span>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <ModuleShell
      process="Process 2.0 — Approval Gatekeeping"
      title="Approval Management"
      subtitle="Dual-verification gatekeeping process — Data Department → Tech Department → Technical Lead → Deployment Ready."
    >
      {/* Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending Reviews" value={String(dataValidation + techValidation)} hint="Awaiting verification" />
        <StatCard label="Data Verified" value={String(dataValidation)} hint="Data Department stage" />
        <StatCard label="Tech Verified" value={String(techValidation)} hint="Tech Department stage" />
        <StatCard label="Final Approved" value={String(finalApproved)} hint="Ready for deployment" />
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      <Panel title="Approval Queue" action={null}>
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
            placeholder="Report ID, company, submitter..."
          />
        </Toolbar>

        <div className="mb-3">
          <SortControl
            sortKey={ctrl.sortKey}
            sortDir={ctrl.sortDir}
            onSort={ctrl.setSort}
            nameLabel="Company"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4 font-semibold">Report ID</th>
                <th className="pb-3 pr-4 font-semibold">Company</th>
                <th className="pb-3 pr-4 font-semibold">Submitted By</th>
                <th className="pb-3 pr-4 font-semibold">Current Stage</th>
                <th className="pb-3 pr-4 font-semibold">Reviewer</th>
                <th className="pb-3 pr-4 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ctrl.view.map((row) => {
                const record = records.find((r) => r.id === row.id)!;
                const isDeploymentReady = row.currentStage === "Deployment Ready";
                const isDataValidation = row.currentStage === "Data Department Validation";

                return (
                  <tr key={row.id} className="text-slate-200">
                    <td className="py-3 pr-4 font-mono text-xs whitespace-nowrap">{row.reportId}</td>
                    <td className="py-3 pr-4 font-semibold whitespace-nowrap">{row.company}</td>
                    <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{row.submittedBy}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <StageBadge stage={row.currentStage} />
                    </td>
                    <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{row.reviewer}</td>
                    <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{row.date}</td>
                    <td className="py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openTimeline(record)}
                          className="rounded-md border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                        >
                          View
                        </button>
                        {!isDeploymentReady && (
                          <>
                            <button
                              onClick={() => openActionModal(record, "approve")}
                              className="rounded-md border border-emerald-700 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/30"
                            >
                              Approve
                            </button>
                            {!isDataValidation && (
                              <button
                                onClick={() => openActionModal(record, "revision")}
                                className="rounded-md border border-amber-700 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-900/30"
                              >
                                Revise
                              </button>
                            )}
                            <button
                              onClick={() => openActionModal(record, "reject")}
                              className="rounded-md border border-rose-700 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-900/30"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {ctrl.view.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
                    No approval records match your filters.
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

      {/* ── Timeline / History Modal ───────────────────────────────────────── */}
      {modal.type === "timeline" && modal.record && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{modal.record.company}</h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  {modal.record.reportId} · Submitted by {modal.record.submittedBy}
                </p>
              </div>
              <button
                onClick={() => setModal({ type: null })}
                className="rounded-md border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            {/* Timeline */}
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Approval Timeline</h4>
            <ApprovalTimeline entries={modalTimeline} />

            {/* History */}
            {modalHistory.length > 0 && (
              <div className="mt-8">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Approval History</h4>
                <div className="overflow-hidden rounded-lg border border-slate-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-800 text-left text-xs uppercase text-slate-500">
                        <th className="px-3 py-2 font-semibold">User</th>
                        <th className="px-3 py-2 font-semibold">Role</th>
                        <th className="px-3 py-2 font-semibold">Action</th>
                        <th className="px-3 py-2 font-semibold">Timestamp</th>
                        <th className="px-3 py-2 font-semibold">Comment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {modalHistory.map((h) => (
                        <tr key={h.id} className="text-slate-200">
                          <td className="px-3 py-2 font-semibold whitespace-nowrap">{h.user}</td>
                          <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{h.role}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                h.action === "Approved"
                                  ? "bg-emerald-500/15 text-emerald-400"
                                  : h.action === "Rejected"
                                    ? "bg-rose-500/15 text-rose-400"
                                    : "bg-amber-500/15 text-amber-400"
                              }`}
                            >
                              {h.action}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-slate-400 whitespace-nowrap">{h.timestamp}</td>
                          <td className="px-3 py-2 text-xs text-slate-400 max-w-[200px] truncate">{h.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* All History */}
            <div className="mt-8">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Recent Activity (All)</h4>
              <div className="overflow-hidden rounded-lg border border-slate-700 max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-800">
                    <tr className="text-left text-xs uppercase text-slate-500">
                      <th className="px-3 py-2 font-semibold">User</th>
                      <th className="px-3 py-2 font-semibold">Action</th>
                      <th className="px-3 py-2 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {allHistory.slice(0, 10).map((h) => (
                      <tr key={h.id} className="text-slate-200">
                        <td className="px-3 py-2 text-xs font-semibold whitespace-nowrap">{h.user}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              h.action === "Approved"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : h.action === "Rejected"
                                  ? "bg-rose-500/15 text-rose-400"
                                  : "bg-amber-500/15 text-amber-400"
                            }`}
                          >
                            {h.action}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-slate-400 whitespace-nowrap">{h.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Action Modal ───────────────────────────────────────────────────── */}
      {modal.type === "action" && modal.record && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">
              {modal.actionType === "approve" && "Approve Report"}
              {modal.actionType === "reject" && "Reject Report"}
              {modal.actionType === "revision" && "Request Revision"}
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              {modal.record.company} · {modal.record.reportId}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Current stage: {modal.record.currentStage}
            </p>

            <div className="mt-5 space-y-4">
              <div>
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
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Your Role
                </label>
                <input
                  type="text"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder={
                    modal.actionType === "approve"
                      ? "Approval justification..."
                      : modal.actionType === "reject"
                        ? "Reason for rejection..."
                        : "Describe what needs revision..."
                  }
                  className="w-full resize-none rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
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
                onClick={handleAction}
                className={`rounded-md px-4 py-2 text-sm font-bold text-[#0B192C] ${
                  modal.actionType === "approve"
                    ? "bg-emerald-500 hover:bg-emerald-400"
                    : modal.actionType === "reject"
                      ? "bg-rose-500 hover:bg-rose-400"
                      : "bg-amber-500 hover:bg-amber-400"
                }`}
              >
                {modal.actionType === "approve" && "Approve"}
                {modal.actionType === "reject" && "Reject"}
                {modal.actionType === "revision" && "Request Revision"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}