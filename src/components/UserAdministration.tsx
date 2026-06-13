import ModuleShell, { StatCard, Panel, StatusBadge } from "./ModuleShell";

const users = [
  { name: "Aisha Rahman", role: "Data Analyst", dept: "Bursa Operations", status: "active" as const },
  { name: "Wei Lin Tan", role: "Staging Reviewer", dept: "Risk & Compliance", status: "active" as const },
  { name: "Marcus Lee", role: "Release Gatekeeper", dept: "Platform Engineering", status: "pending" as const },
  { name: "Priya Nair", role: "Data Entry Clerk", dept: "Bursa Operations", status: "blocked" as const },
  { name: "Daniel Wong", role: "System Administrator", dept: "IT Governance", status: "active" as const },
];

export default function UserAdministration() {
  return (
    <ModuleShell
      process="Process 1.0 — User Management"
      title="User Administration"
      subtitle="Provision staff accounts, assign module roles, and govern access across the Smart Wealth Gateway."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Staff" value="142" hint="Across 6 departments" />
        <StatCard label="Pending Approval" value="7" hint="Awaiting admin review" />
        <StatCard label="Suspended" value="3" hint="Access revoked" />
        <StatCard label="Role Definitions" value="11" hint="RBAC policies" />
      </div>

      <Panel
        title="Staff Accounts"
        action={
          <button className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-bold text-[#0B192C] hover:bg-emerald-400">
            + Provision User
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4 font-semibold">Name</th>
                <th className="pb-3 pr-4 font-semibold">Assigned Role</th>
                <th className="pb-3 pr-4 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.name} className="text-slate-200">
                  <td className="py-3 pr-4 font-semibold">{u.name}</td>
                  <td className="py-3 pr-4 text-slate-400">{u.role}</td>
                  <td className="py-3 pr-4 text-slate-400">{u.dept}</td>
                  <td className="py-3"><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </ModuleShell>
  );
}
