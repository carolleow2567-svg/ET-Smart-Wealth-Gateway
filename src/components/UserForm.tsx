import { useState } from "react";
import type { User, UserRole, CreateUserInput, UpdateUserInput } from "../lib/api/users";
import { DEPARTMENTS, ROLES } from "../lib/api/users";

type FormMode = "create" | "edit";

interface UserFormProps {
  mode: FormMode;
  user?: User;
  onSave: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({ mode, user, onSave, onCancel }: UserFormProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [department, setDepartment] = useState(user?.department ?? DEPARTMENTS[0]);
  const [role, setRole] = useState<UserRole>(user?.role ?? ROLES[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = mode === "edit";
  const title = isEdit ? "Edit User" : "Create User";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit && user) {
        await onSave({ name: name.trim(), email: email.trim(), department, role } as UpdateUserInput);
      } else {
        await onSave({ name: name.trim(), email: email.trim(), department, role } as CreateUserInput);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-bold text-white">{title}</h3>

      {error && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/15 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John Doe"
          className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. john.doe@et.com"
          className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Department
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:ring-2"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:ring-2"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0B192C] hover:bg-emerald-400 disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
        </button>
      </div>
    </form>
  );
}