import type { ReactNode } from "react";

interface ModuleShellProps {
  process: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function ModuleShell({ process, title, subtitle, children }: ModuleShellProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B192C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
              {process}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: "approved" | "pending" | "rejected" | "active" | "blocked" }) {
  const styles: Record<string, string> = {
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    rejected: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    blocked: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
