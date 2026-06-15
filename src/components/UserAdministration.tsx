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
import UserForm from "./UserForm";
import type { User, UserRole, UserStatus, ActivityLog, CreateUserInput, UpdateUserInput } from "../lib/api/users";
import { userService, DEPARTMENTS, ROLES } from "../lib/api/users";

type ModalType = "create" | "edit" | "confirm" | "view-activity" | null;

interface ModalState {
  type: ModalType;
  user?: User;
  confirmAction?: "disable" | "enable" | "reset-password";
}

export default function UserAdministration() {
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [userData, activityData] = await Promise.all([
        userService.list(),
        userService.getActivities(),
      ]);
      setUsers(userData);
      setActivities(activityData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derive filtered list for the record controls
  const filteredUsers = useMemo(() => {
    let result = users;
    if (departmentFilter !== "All") {
      result = result.filter((u) => u.department === departmentFilter);
    }
    if (roleFilter !== "All") {
      result = result.filter((u) => u.role === roleFilter);
    }
    return result;
  }, [users, departmentFilter, roleFilter]);

  // Compute counts from ALL users (not filtered)
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const pendingUsers = users.filter((u) => u.status === "Pending").length;
  const disabledUsers = users.filter((u) => u.status === "Disabled").length;

  const ctrl = useRecordControls(filteredUsers, {
    searchKeys: (r) => [r.name, r.email, r.department, r.role, r.status],
    status: (r) => r.status,
    date: (r) => r.createdAt,
    name: (r) => r.name,
    statuses: ["Active", "Pending", "Disabled"],
  });

  // ── User Actions ──────────────────────────────────────────────────────────

  const handleCreate = async (data: CreateUserInput | UpdateUserInput) => {
    await userService.create(data as CreateUserInput);
    await loadData();
    setModal({ type: null });
  };

  const handleEdit = async (data: CreateUserInput | UpdateUserInput) => {
    if (!modal.user) return;
    await userService.update(modal.user.id, data as UpdateUserInput);
    await loadData();
    setModal({ type: null });
  };

  const handleConfirmAction = async () => {
    if (!modal.user || !modal.confirmAction) return;
    const u = modal.user;

    switch (modal.confirmAction) {
      case "disable":
        await userService.setStatus(u.id, "Disabled");
        break;
      case "enable":
        await userService.setStatus(u.id, "Active");
        break;
      case "reset-password":
        await userService.resetPassword(u.id, "System Admin");
        break;
    }

    await loadData();
    setConfirmMessage(
      modal.confirmAction === "reset-password"
        ? `Password has been reset for ${u.name}.`
        : `${u.name} has been ${modal.confirmAction === "disable" ? "disabled" : "enabled"}.`,
    );
    setModal({ type: null });
    setTimeout(() => setConfirmMessage(null), 4000);
  };

  // ── Activity Feed ─────────────────────────────────────────────────────────

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Account Created":
        return <span className="text-emerald-400">✓</span>;
      case "Role Changed":
        return <span className="text-amber-400">⟳</span>;
      case "Account Disabled":
        return <span className="text-rose-400">✕</span>;
      case "Account Enabled":
        return <span className="text-emerald-400">✓</span>;
      case "Password Reset":
        return <span className="text-blue-400">↻</span>;
      default:
        return <span className="text-slate-400">•</span>;
    }
  };

  // ── Custom Filters: Department & Role ─────────────────────────────────────

  const selectClasses =
    "rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 outline-none ring-emerald-500 focus:ring-2 border border-slate-700";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ModuleShell
      process="Process 1.0 — User Management"
      title="User Administration"
      subtitle="Provision staff accounts, assign module roles, and govern access across the Smart Wealth Gateway."
    >
      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={String(totalUsers)} hint="Registered accounts" />
        <StatCard label="Active Users" value={String(activeUsers)} hint="With active access" />
        <StatCard label="Pending Users" value={String(pendingUsers)} hint="Awaiting approval" />
        <StatCard label="Disabled Users" value={String(disabledUsers)} hint="Access revoked" />
      </div>

      {/* Confirmation toast */}
      {confirmMessage && (
        <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
          {confirmMessage}
        </div>
      )}

      <Panel
        title="User Accounts"
        action={
          <button
            onClick={() => setModal({ type: "create" })}
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-bold text-[#0B192C] hover:bg-emerald-400"
          >
            + Create User
          </button>
        }
      >
        {/* Toolbar: Filter chips + Search */}
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
            placeholder="Name, email, role, department..."
          />
        </Toolbar>

        {/* Extra Filters: Department & Role */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <SortControl
            sortKey={ctrl.sortKey}
            sortDir={ctrl.sortDir}
            onSort={ctrl.setSort}
            nameLabel="Name"
          />
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-500">Dept</span>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                ctrl.setPage(1);
              }}
              className={selectClasses}
            >
              <option value="All">All</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-500">Role</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                ctrl.setPage(1);
              }}
              className={selectClasses}
            >
              <option value="All">All</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4 font-semibold">Name</th>
                <th className="pb-3 pr-4 font-semibold">Email</th>
                <th className="pb-3 pr-4 font-semibold">Department</th>
                <th className="pb-3 pr-4 font-semibold">Role</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 pr-4 font-semibold">Created</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ctrl.view.map((u) => (
                <tr key={u.id} className="text-slate-200">
                  <td className="py-3 pr-4 font-semibold whitespace-nowrap">{u.name}</td>
                  <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{u.email}</td>
                  <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{u.department}</td>
                  <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{u.role}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <StatusBadge
                      status={u.status.toLowerCase() as "active" | "pending" | "blocked"}
                    />
                  </td>
                  <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{u.createdAt}</td>
                  <td className="py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setModal({ type: "edit", user: u })}
                        className="rounded-md border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                        title="Edit user"
                      >
                        Edit
                      </button>
                      {u.status === "Active" ? (
                        <button
                          onClick={() =>
                            setModal({ type: "confirm", user: u, confirmAction: "disable" })
                          }
                          className="rounded-md border border-rose-700 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-900/30"
                          title="Disable user"
                        >
                          Disable
                        </button>
                      ) : u.status === "Disabled" ? (
                        <button
                          onClick={() =>
                            setModal({ type: "confirm", user: u, confirmAction: "enable" })
                          }
                          className="rounded-md border border-emerald-700 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/30"
                          title="Enable user"
                        >
                          Enable
                        </button>
                      ) : null}
                      {u.status !== "Pending" && (
                        <button
                          onClick={() =>
                            setModal({ type: "confirm", user: u, confirmAction: "reset-password" })
                          }
                          className="rounded-md border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                          title="Reset password"
                        >
                          Reset PW
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {ctrl.view.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
                    No users match your filters.
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

      {/* Activity History Panel */}
      <div className="mt-6">
        <Panel title="Activity History">
          {loading ? (
            <div className="py-4 text-center text-sm text-slate-500">Loading activity...</div>
          ) : activities.length === 0 ? (
            <div className="py-4 text-center text-sm text-slate-500">No activity recorded.</div>
          ) : (
            <div className="space-y-0">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 border-b border-slate-800 py-3 last:border-0"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs">
                    {getActionIcon(a.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-white">{a.userName}</span>
                      <span className="text-xs text-slate-400">{a.action}</span>
                    </div>
                    {a.details && (
                      <p className="mt-0.5 text-xs text-slate-500">{a.details}</p>
                    )}
                    <p className="mt-0.5 text-[11px] text-slate-600">
                      {new Date(a.timestamp).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}
                      <span className="text-slate-600">{a.performedBy}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

      {/* Create / Edit Modal Overlay */}
      {(modal.type === "create" || modal.type === "edit") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <UserForm
              mode={modal.type === "create" ? "create" : "edit"}
              user={modal.user}
              onSave={modal.type === "create" ? handleCreate : handleEdit}
              onCancel={() => setModal({ type: null })}
            />
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {modal.type === "confirm" && modal.user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">
              {modal.confirmAction === "disable" && "Disable User"}
              {modal.confirmAction === "enable" && "Enable User"}
              {modal.confirmAction === "reset-password" && "Reset Password"}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {modal.confirmAction === "disable" &&
                `Are you sure you want to disable ${modal.user.name}? They will lose access to the system.`}
              {modal.confirmAction === "enable" &&
                `Are you sure you want to re-enable ${modal.user.name}? They will regain access to the system.`}
              {modal.confirmAction === "reset-password" &&
                `Are you sure you want to reset the password for ${modal.user.name}? They will need to set a new password on next login.`}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setModal({ type: null })}
                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`rounded-md px-4 py-2 text-sm font-bold text-[#0B192C] ${
                  modal.confirmAction === "disable"
                    ? "bg-rose-500 hover:bg-rose-400"
                    : "bg-emerald-500 hover:bg-emerald-400"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}