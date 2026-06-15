import type { SecurityAlert as SecurityAlertType } from "../lib/api/security";

interface SecurityAlertProps {
  alert: SecurityAlertType;
  onResolve: (id: string) => void;
}

function SeverityDot({ severity }: { severity: SecurityAlertType["severity"] }) {
  const colors: Record<string, string> = {
    high: "bg-rose-500",
    medium: "bg-amber-500",
    low: "bg-slate-400",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[severity]}`} />;
}

export default function SecurityAlertBadge({ alert, onResolve }: SecurityAlertProps) {
  const severityColors: Record<string, string> = {
    high: "border-rose-500/30 bg-rose-500/5",
    medium: "border-amber-500/30 bg-amber-500/5",
    low: "border-slate-700 bg-slate-900/40",
  };

  const typeColors: Record<string, string> = {
    "Excessive Failed Logins": "text-rose-400",
    "Unauthorized Access Attempt": "text-rose-400",
    "Suspicious Activity": "text-amber-400",
  };

  return (
    <div
      className={`rounded-lg border p-3 transition-opacity ${
        severityColors[alert.severity]
      } ${alert.resolved ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <SeverityDot severity={alert.severity} />
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${typeColors[alert.type] ?? "text-slate-300"}`}>
                {alert.type}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase ${
                  alert.severity === "high"
                    ? "text-rose-400"
                    : alert.severity === "medium"
                      ? "text-amber-400"
                      : "text-slate-400"
                }`}
              >
                {alert.severity}
              </span>
              {alert.resolved && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Resolved
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-300">{alert.message}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              {alert.timestamp}
              {alert.user && <> · {alert.user}</>}
            </p>
          </div>
        </div>
        {!alert.resolved && (
          <button
            onClick={() => onResolve(alert.id)}
            className="shrink-0 rounded-md border border-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
}