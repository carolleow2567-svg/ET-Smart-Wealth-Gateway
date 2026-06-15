import type { ApprovalTimelineEntry } from "../lib/api/approvals";

interface ApprovalTimelineProps {
  entries: ApprovalTimelineEntry[];
}

function StageIcon({ status }: { status: ApprovalTimelineEntry["status"] }) {
  switch (status) {
    case "completed":
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-[#0B192C]">
          ✓
        </span>
      );
    case "current":
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-500/15 text-xs font-bold text-emerald-400">
          ●
        </span>
      );
    case "rejected":
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
          ✕
        </span>
      );
    default:
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-800 text-xs font-bold text-slate-600">
          ○
        </span>
      );
  }
}

function getStageNumber(_status: string, index: number): number {
  return index + 1;
}

export default function ApprovalTimeline({ entries }: ApprovalTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-800" />

      <div className="space-y-6">
        {entries.map((entry, idx) => (
          <div key={entry.stage} className="relative flex items-start gap-4">
            {/* Icon */}
            <div className="relative z-10">
              <StageIcon status={entry.status} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Stage {getStageNumber(entry.status, idx)}
                </span>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    entry.status === "completed"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : entry.status === "current"
                        ? "bg-amber-500/15 text-amber-400"
                        : entry.status === "rejected"
                          ? "bg-rose-500/15 text-rose-400"
                          : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {entry.status === "completed"
                    ? "Completed"
                    : entry.status === "current"
                      ? "In Progress"
                      : entry.status === "rejected"
                        ? "Rejected"
                        : "Pending"}
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-white">{entry.stage}</p>

              {entry.completedBy && (
                <p className="mt-0.5 text-xs text-slate-400">
                  by {entry.completedBy}
                  {entry.completedAt && ` · ${entry.completedAt}`}
                </p>
              )}

              {entry.comment && (
                <p className="mt-1 text-xs italic text-slate-500">"{entry.comment}"</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}