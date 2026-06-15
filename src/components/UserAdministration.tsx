import ModuleShell, { StatCard, Panel, StatusBadge } from "./ModuleShell";
import {
  useRecordControls,
  FilterChips,
  SearchInput,
  SortControl,
  PaginationBar,
  Toolbar,
} from "./records/tableControls";

const users = [
  { name: "Aisha Rahman", role: "Data Analyst", dept: "Bursa Operations", status: "Active", joined: "2025-02-14" },
  { name: "Wei Lin Tan", role: "Staging Reviewer", dept: "Risk & Compliance", status: "Active", joined: "2025-04-02" },
  { name: "Marcus Lee", role: "Release Gatekeeper", dept: "Platform Engineering", status: "Pending", joined: "2026-06-10" },
  { name: "Priya Nair", role: "Data Entry Clerk", dept: "Bursa Operations", status: "Blocked", joined: "2024-11-21" },
  { name: "Daniel Wong", role: "System Administrator", dept: "IT Governance", status: "Active", joined: "2023-08-09" },
  { name: "Suresh Kumar", role: "Data Analyst", dept: "Bursa Operations", status: "Active", joined: "2025-09-18" },
  { name: "Mei Ling Chong", role: "Staging Reviewer", dept: "Risk & Compliance", status: "Pending", joined: "2026-05-30" },
  { name: "Arif Hassan", role: "Data Entry Clerk", dept: "Bursa Operations", status: "Active", joined: "2025-12-01" },
  { name: "Nurul Izzah", role: "Compliance Officer", dept: "Risk & Compliance", status: "Active", joined: "2024-07-15" },
  { name: "James Lim", role: "Release Gatekeeper", dept: "Platform Engineering", status: "Blocked", joined: "2024-03-22" },
  { name: "Farah Diana", role: "Data Analyst", dept: "Bursa Operations", status: "Pending", joined: "2026-06-12" },
  { name: "Kevin Tan", role: "System Administrator", dept: "IT Governance", status: "Active", joined: "2023-05-04" },
];

export default function UserAdministration() {
  const ctrl = useRecordControls(users, {
    searchKeys: (r) => [r.name, r.role, r.dept, r.status],
    status: (r) => r.status,
    date: (r) => r.joined,
    name: (r) => r.name,
    statuses: ["Active", "Pending", "Blocked"],
  });

  return (
    <ModuleShell
      process="Process 1.0 — User Management"
      title="User Administration"
      subtitle="Provision staff accounts, assign module roles, and govern access across the Smart Wealth Gateway."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Staff" value={String(ctrl.counts.All)} hint="Matching current search" />
        <StatCard label="Active Staff" value={String(ctrl.counts.Active ?? 0)} hint="With access" />
        <StatCard label="Pending Approval" value={String(ctrl.counts.Pending ?? 0)} hint="Awaiting admin review" />
        <StatCard label="Blocked" value={String(ctrl.counts.Blocked ?? 0)} hint="Access revoked" />
      </div>

      <Panel
        title="Staff Accounts"
        action={
          <button className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-bold text-[#0B192C] hover:bg-emerald-400">
            + Provision User
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
            placeholder="Name, role, department..."
          />
        </Toolbar>
        <div className="mb-3">
          <SortControl
            sortKey={ctrl.sortKey}
            sortDir={ctrl.sortDir}
            onSort={ctrl.setSort}
            nameLabel="Name"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4 font-semibold">Name</th>
                <th className="pb-3 pr-4 font-semibold">Assigned Role</th>
                <th className="pb-3 pr-4 font-semibold">Department</th>
                <th className="pb-3 pr-4 font-semibold">Joined</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ctrl.view.map((u) => (
                <tr key={u.name} className="text-slate-200">
                  <td className="py-3 pr-4 font-semibold">{u.name}</td>
                  <td className="py-3 pr-4 text-slate-400">{u.role}</td>
                  <td className="py-3 pr-4 text-slate-400">{u.dept}</td>
                  <td className="py-3 pr-4 text-slate-400">{u.joined}</td>
                  <td className="py-3">
                    <StatusBadge status={u.status.toLowerCase() as "active" | "pending" | "blocked"} />
                  </td>
                </tr>
              ))}
              {ctrl.view.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    No staff match your filters.
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
    </ModuleShell>
  );
}