import { useState, useEffect, useCallback } from "react";
import ModuleShell, { StatCard, Panel } from "./ModuleShell";
import {
  useRecordControls,
  SearchInput,
  SortControl,
  PaginationBar,
  Toolbar,
} from "./records/tableControls";
import SecurityAlertBadge from "./SecurityAlert";
import type { SecurityActivity, SecurityAlert, AuditEntry } from "../lib/api/security";
import { securityService } from "../lib/api/security";

type ModalType = "action" | null;

interface ModalState {
  type: ModalType;
  user?: string;
  actionType?: "block" | "unblock" | "force-logout";
}

export default function SecurityManagement() {
  const [activities, setActivities] = useState<SecurityActivity[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [dashboard, setDashboard] = useState({ activeSessions: 0, vpnUsers: 0, failedLogins: 0, securityAlerts: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [userName, setUserName] = useState("System Admin");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [act, al, au, dash] = await Promise.all([
        securityService.getActivities(),
        securityService.getAlerts(),
        securityService.getAuditTrail(),
        securityService.getDashboard(),
      ]);
      setActivities(act);
      setAlerts(al);
      setAuditTrail(au);
      setDashboard(dash);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const ctrl = useRecordControls(activities, {
    searchKeys: (r) => [r.user, r.role, r.activity, r.ipAddress, String(r.vpnStatus)],
    status: (r) => r.activity,
    date: (r) => r.timestamp,
    name: (r) => r.user,
    statuses: ["Login", "Logout", "Role Change", "Failed Login", "Password Reset", "Account Created", "Account Disabled", "Account Enabled"],
  });

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleAction = async () => {
    if (!modal.user || !modal.actionType) return;
    try {
      if (modal.actionType === "block") {
        await securityService.blockUser(modal.user, userName);
        setSuccessMessage(`${modal.user} has been blocked.`);
      } else if (modal.actionType === "unblock") {
        await securityService.unblockUser(modal.user, userName);
        setSuccessMessage(`${modal.user} has been unblocked.`);
      } else if (modal.actionType === "force-logout") {
        await securityService.forceLogout(modal.user, userName);
        setSuccessMessage(`${modal.user} has been force logged out.`);
      }
      await loadData();
      setModal({ type: null });
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      // ignore
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    await securityService.resolveAlert(alertId);
    await loadData();
    setSuccessMessage("Alert resolved.");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const openAction = (user: string, actionType: "block" | "unblock" | "force-logout") => {
    setModal({ type: "action", user, actionType });
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  function ActivityBadge({ activity }: { activity: string }) {
    const styles: Record<string, string> = {
      Login: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      Logout: "bg-slate-500/15 text-slate-400 border-slate-500/30",
      "Role Change": "bg-amber-500/15 text-amber-400 border-amber-500/30",
      "Failed Login": "bg-rose-500/15 text-rose-400 border-rose-500/30",
      "Password Reset": "bg-blue-500/15 text-blue-400 border-blue-500/30",
      "Account Created": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      "Account Disabled": "bg-rose-500/15 text-rose-400 border-rose-500/30",
      "Account Enabled": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    };
    return (
      <span
        className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
          styles[activity] ?? "bg-slate-800 text-slate-400 border-slate-700"
        }`}
      >
        {activity}
      </span>
    );
  }

  const uniqueUsers = [...new Set(activities.map((a) => a.user).filter((u) => u !== "Unknown"))];

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <ModuleShell
      process="Security Operations"
      title="Security Management"
      subtitle="Monitor access, enforce security policies, and maintain audit records across the Smart Wealth Gateway."
    >
      {/* Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Sessions" value={String(dashboard.activeSessions)} hint="Currently logged in" />
        <StatCard label="VPN Users" value={String(dashboard.vpnUsers)} hint="VPN authenticated" />
        <StatCard label="Failed Logins" value={String(dashboard.failedLogins)} hint="Failed attempts recorded" />
        <StatCard label="Security Alerts" value={String(dashboard.securityAlerts)} hint="Unresolved alerts" />
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2">
          <Panel title="Activity Log">
            <Toolbar>
              <SearchInput
                value={ctrl.search}
                onChange={ctrl.setSearch}
                placeholder="User, role, activity, IP..."
              />
            </Toolbar>

            <div className="mb-3">
              <SortControl
                sortKey={ctrl.sortKey}
                sortDir={ctrl.sortDir}
                onSort={ctrl.setSort}
                nameLabel="User"
                withDate={true}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">User</th>
                    <th className="pb-3 pr-4 font-semibold">Role</th>
                    <th className="pb-3 pr-4 font-semibold">Activity</th>
                    <th className="pb-3 pr-4 font-semibold">IP Address</th>
                    <th className="pb-3 pr-4 font-semibold">VPN</th>
                    <th className="pb-3 pr-4 font-semibold">Timestamp</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ctrl.view.map((row) => (
                    <tr key={row.id} className="text-slate-200">
                      <td className="py-3 pr-4 font-semibold whitespace-nowrap">{row.user}</td>
                      <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{row.role}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <ActivityBadge activity={row.activity} />
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                        {row.ipAddress}
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            row.vpnStatus
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-amber-500/15 text-amber-400"
                          }`}
                        >
                          {row.vpnStatus ? "VPN" : "Direct"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-slate-400 whitespace-nowrap">
                        {row.timestamp}
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        {row.user !== "Unknown" && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openAction(row.user, "force-logout")}
                              className="rounded-md border border-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:bg-slate-800"
                              title="Force logout"
                            >
                              Logout
                            </button>
                            <button
                              onClick={() => openAction(row.user, "block")}
                              className="rounded-md border border-rose-700 px-2 py-1 text-[10px] font-semibold text-rose-300 hover:bg-rose-900/30"
                              title="Block user"
                            >
                              Block
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {ctrl.view.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
                        No activity matches your filters.
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

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Security Alerts */}
          <Panel title={`Security Alerts (${alerts.filter((a) => !a.resolved).length} unresolved)`}>
            {loading ? (
              <p className="text-xs text-slate-500">Loading...</p>
            ) : alerts.length === 0 ? (
              <p className="text-xs text-slate-500">No alerts.</p>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <SecurityAlertBadge key={alert.id} alert={alert} onResolve={handleResolveAlert} />
                ))}
              </div>
            )}
          </Panel>

          {/* Audit Trail */}
          <Panel title="Audit Trail">
            {loading ? (
              <p className="text-xs text-slate-500">Loading...</p>
            ) : auditTrail.length === 0 ? (
              <p className="text-xs text-slate-500">No audit entries.</p>
            ) : (
              <div className="space-y-0">
                {auditTrail.slice(0, 8).map((entry) => (
                  <div
                    key={entry.id}
                    className="border-b border-slate-800 py-2.5 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{entry.user}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {entry.event}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">{entry.details}</p>
                    <p className="mt-0.5 text-[11px] text-slate-600">{entry.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Quick Actions */}
          <Panel title="User Security Actions">
            <p className="mb-3 text-xs text-slate-400">Quick actions for active users:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uniqueUsers.slice(0, 10).map((user) => (
                <div
                  key={user}
                  className="flex items-center justify-between rounded-md border border-slate-700 px-3 py-2"
                >
                  <span className="text-xs font-semibold text-slate-200">{user}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openAction(user, "force-logout")}
                      className="rounded-md border border-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-400 hover:bg-slate-800"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => openAction(user, "block")}
                      className="rounded-md border border-rose-700 px-2 py-1 text-[10px] font-semibold text-rose-400 hover:bg-rose-900/30"
                    >
                      Block
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Action Confirmation Modal ──────────────────────────────────────── */}
      {modal.type === "action" && modal.user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">
              {modal.actionType === "block" && "Block User"}
              {modal.actionType === "unblock" && "Unblock User"}
              {modal.actionType === "force-logout" && "Force Logout"}
            </h3>
            <p className="mt-1 text-sm text-slate-300">{modal.user}</p>
            <p className="mt-2 text-sm text-slate-400">
              {modal.actionType === "block" &&
                `Are you sure you want to block ${modal.user}? They will lose access immediately.`}
              {modal.actionType === "unblock" &&
                `Restore access for ${modal.user}?`}
              {modal.actionType === "force-logout" &&
                `Forcefully terminate all sessions for ${modal.user}?`}
            </p>

            <div className="mt-5">
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
                  modal.actionType === "block"
                    ? "bg-rose-500 hover:bg-rose-400"
                    : modal.actionType === "force-logout"
                      ? "bg-amber-500 hover:bg-amber-400"
                      : "bg-emerald-500 hover:bg-emerald-400"
                }`}
              >
                {modal.actionType === "block" && "Block"}
                {modal.actionType === "unblock" && "Unblock"}
                {modal.actionType === "force-logout" && "Force Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}