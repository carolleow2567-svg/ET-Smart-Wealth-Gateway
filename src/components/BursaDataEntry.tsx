import { useState } from "react";
import ModuleShell, { StatCard, Panel, StatusBadge } from "./ModuleShell";
import {
  useRecordControls,
  FilterChips,
  SearchInput,
  SortControl,
  PaginationBar,
  Toolbar,
} from "./records/tableControls";

type RecordStatus = "Pending" | "Approved" | "Rejected";

interface WorkflowEvent {
  stage: string;
  user: string;
  department: string;
  date: string;
  action: string;
  notes: string;
}

interface FinancialRecord {
  reportId: string;
  company: string;
  bursaCode: string;
  financialYear: string;
  revenue: number; // RM '000
  netProfit: number; // RM '000
  eps: number;
  pat: number; // RM '000
  createdBy: string;
  submissionDate: string;
  status: RecordStatus;
  history: WorkflowEvent[];
}

const baseHistory = (
  createdBy: string,
  date: string,
  stages: Array<[string, string, string, string, string]>,
): WorkflowEvent[] =>
  stages.map(([stage, user, department, action, notes]) => ({
    stage,
    user,
    department,
    date,
    action,
    notes,
  }));

const records: FinancialRecord[] = [
  {
    reportId: "RPT-2026-014",
    company: "Maybank Berhad",
    bursaCode: "1155",
    financialYear: "FY2025",
    revenue: 58200,
    netProfit: 9100,
    eps: 0.74,
    pat: 9050,
    createdBy: "Aisha Rahman",
    submissionDate: "2026-06-13",
    status: "Pending",
    history: baseHistory("Aisha Rahman", "2026-06-13", [
      ["Draft", "Aisha Rahman", "Bursa Operations", "Created draft", "Initial capture from filing"],
      ["Pending", "Aisha Rahman", "Bursa Operations", "Submitted for validation", "Awaiting data verification"],
      ["Data Verified", "Wei Lin Tan", "Risk & Compliance", "Data checks passed", "Range and format valid"],
    ]),
  },
  {
    reportId: "RPT-2026-013",
    company: "Tenaga Nasional",
    bursaCode: "5347",
    financialYear: "FY2025",
    revenue: 51200,
    netProfit: 4300,
    eps: 0.66,
    pat: 4280,
    createdBy: "Wei Lin Tan",
    submissionDate: "2026-06-12",
    status: "Approved",
    history: baseHistory("Wei Lin Tan", "2026-06-12", [
      ["Draft", "Wei Lin Tan", "Bursa Operations", "Created draft", "Captured from annual report"],
      ["Pending", "Wei Lin Tan", "Bursa Operations", "Submitted for validation", ""],
      ["Data Verified", "Priya Nair", "Risk & Compliance", "Data checks passed", "Reconciled vs source"],
      ["Tech Verified", "Marcus Lee", "Platform Engineering", "Schema verified", "Pipeline compatible"],
      ["Approved", "Daniel Wong", "IT Governance", "Approved for staging", "All gates cleared"],
    ]),
  },
  {
    reportId: "RPT-2026-012",
    company: "CIMB Group",
    bursaCode: "1023",
    financialYear: "FY2025",
    revenue: 21900,
    netProfit: 7100,
    eps: 0.68,
    pat: 7080,
    createdBy: "Priya Nair",
    submissionDate: "2026-06-11",
    status: "Rejected",
    history: baseHistory("Priya Nair", "2026-06-11", [
      ["Draft", "Priya Nair", "Bursa Operations", "Created draft", ""],
      ["Pending", "Priya Nair", "Bursa Operations", "Submitted for validation", ""],
      ["Rejected", "Wei Lin Tan", "Risk & Compliance", "Rejected", "EPS mismatch vs filing — resubmit"],
    ]),
  },
  {
    reportId: "RPT-2026-011",
    company: "Public Bank",
    bursaCode: "1295",
    financialYear: "FY2025",
    revenue: 25400,
    netProfit: 6800,
    eps: 0.35,
    pat: 6790,
    createdBy: "Aisha Rahman",
    submissionDate: "2026-06-10",
    status: "Approved",
    history: baseHistory("Aisha Rahman", "2026-06-10", [
      ["Draft", "Aisha Rahman", "Bursa Operations", "Created draft", ""],
      ["Pending", "Aisha Rahman", "Bursa Operations", "Submitted for validation", ""],
      ["Data Verified", "Priya Nair", "Risk & Compliance", "Data checks passed", ""],
      ["Tech Verified", "Marcus Lee", "Platform Engineering", "Schema verified", ""],
      ["Approved", "Daniel Wong", "IT Governance", "Approved", ""],
      ["Deployed", "Marcus Lee", "Platform Engineering", "Promoted to production", "Live in v4.12.0"],
    ]),
  },
  {
    reportId: "RPT-2026-010",
    company: "Petronas Chemicals",
    bursaCode: "5183",
    financialYear: "FY2025",
    revenue: 18700,
    netProfit: 2100,
    eps: 0.26,
    pat: 2090,
    createdBy: "Daniel Wong",
    submissionDate: "2026-06-09",
    status: "Pending",
    history: baseHistory("Daniel Wong", "2026-06-09", [
      ["Draft", "Daniel Wong", "IT Governance", "Created draft", ""],
      ["Pending", "Daniel Wong", "IT Governance", "Submitted for validation", "In data review queue"],
    ]),
  },
  {
    reportId: "RPT-2026-009",
    company: "IHH Healthcare",
    bursaCode: "5225",
    financialYear: "FY2024",
    revenue: 21200,
    netProfit: 2400,
    eps: 0.27,
    pat: 2380,
    createdBy: "Wei Lin Tan",
    submissionDate: "2026-06-08",
    status: "Pending",
    history: baseHistory("Wei Lin Tan", "2026-06-08", [
      ["Draft", "Wei Lin Tan", "Bursa Operations", "Created draft", ""],
      ["Pending", "Wei Lin Tan", "Bursa Operations", "Submitted for validation", ""],
      ["Data Verified", "Priya Nair", "Risk & Compliance", "Data checks passed", ""],
      ["Tech Verified", "Marcus Lee", "Platform Engineering", "Schema verified", "Awaiting final approval"],
    ]),
  },
  {
    reportId: "RPT-2026-008",
    company: "Sime Darby",
    bursaCode: "4197",
    financialYear: "FY2024",
    revenue: 67300,
    netProfit: 3200,
    eps: 0.47,
    pat: 3180,
    createdBy: "Priya Nair",
    submissionDate: "2026-06-06",
    status: "Approved",
    history: baseHistory("Priya Nair", "2026-06-06", [
      ["Draft", "Priya Nair", "Bursa Operations", "Created draft", ""],
      ["Pending", "Priya Nair", "Bursa Operations", "Submitted for validation", ""],
      ["Approved", "Daniel Wong", "IT Governance", "Approved", "Fast-tracked review"],
    ]),
  },
  {
    reportId: "RPT-2026-007",
    company: "Genting Berhad",
    bursaCode: "3182",
    financialYear: "FY2024",
    revenue: 26800,
    netProfit: 1900,
    eps: 0.49,
    pat: 1880,
    createdBy: "Aisha Rahman",
    submissionDate: "2026-06-04",
    status: "Rejected",
    history: baseHistory("Aisha Rahman", "2026-06-04", [
      ["Draft", "Aisha Rahman", "Bursa Operations", "Created draft", ""],
      ["Pending", "Aisha Rahman", "Bursa Operations", "Submitted for validation", ""],
      ["Rejected", "Marcus Lee", "Platform Engineering", "Rejected", "Revenue unit inconsistency"],
    ]),
  },
  {
    reportId: "RPT-2026-006",
    company: "Axiata Group",
    bursaCode: "6888",
    financialYear: "FY2024",
    revenue: 22500,
    netProfit: 1100,
    eps: 0.12,
    pat: 1090,
    createdBy: "Daniel Wong",
    submissionDate: "2026-06-02",
    status: "Approved",
    history: baseHistory("Daniel Wong", "2026-06-02", [
      ["Draft", "Daniel Wong", "IT Governance", "Created draft", ""],
      ["Pending", "Daniel Wong", "IT Governance", "Submitted for validation", ""],
      ["Approved", "Wei Lin Tan", "Risk & Compliance", "Approved", ""],
    ]),
  },
  {
    reportId: "RPT-2026-005",
    company: "Hong Leong Bank",
    bursaCode: "5819",
    financialYear: "FY2024",
    revenue: 6100,
    netProfit: 3900,
    eps: 1.78,
    pat: 3880,
    createdBy: "Priya Nair",
    submissionDate: "2026-05-30",
    status: "Pending",
    history: baseHistory("Priya Nair", "2026-05-30", [
      ["Draft", "Priya Nair", "Bursa Operations", "Created draft", ""],
      ["Pending", "Priya Nair", "Bursa Operations", "Submitted for validation", ""],
    ]),
  },
  {
    reportId: "RPT-2026-004",
    company: "PPB Group",
    bursaCode: "4065",
    financialYear: "FY2024",
    revenue: 5600,
    netProfit: 1500,
    eps: 1.05,
    pat: 1490,
    createdBy: "Wei Lin Tan",
    submissionDate: "2026-05-28",
    status: "Approved",
    history: baseHistory("Wei Lin Tan", "2026-05-28", [
      ["Draft", "Wei Lin Tan", "Bursa Operations", "Created draft", ""],
      ["Pending", "Wei Lin Tan", "Bursa Operations", "Submitted for validation", ""],
      ["Approved", "Daniel Wong", "IT Governance", "Approved", ""],
    ]),
  },
  {
    reportId: "RPT-2026-003",
    company: "RHB Bank",
    bursaCode: "1066",
    financialYear: "FY2024",
    revenue: 14500,
    netProfit: 3600,
    eps: 0.89,
    pat: 3580,
    createdBy: "Aisha Rahman",
    submissionDate: "2026-05-26",
    status: "Rejected",
    history: baseHistory("Aisha Rahman", "2026-05-26", [
      ["Draft", "Aisha Rahman", "Bursa Operations", "Created draft", ""],
      ["Pending", "Aisha Rahman", "Bursa Operations", "Submitted for validation", ""],
      ["Rejected", "Wei Lin Tan", "Risk & Compliance", "Rejected", "Net profit failed reconciliation"],
    ]),
  },
  {
    reportId: "RPT-2026-002",
    company: "Maxis Berhad",
    bursaCode: "6012",
    financialYear: "FY2024",
    revenue: 10800,
    netProfit: 1900,
    eps: 0.24,
    pat: 1880,
    createdBy: "Wei Lin Tan",
    submissionDate: "2026-05-24",
    status: "Approved",
    history: baseHistory("Wei Lin Tan", "2026-05-24", [
      ["Draft", "Wei Lin Tan", "Bursa Operations", "Created draft", ""],
      ["Pending", "Wei Lin Tan", "Bursa Operations", "Submitted for validation", ""],
      ["Approved", "Marcus Lee", "Platform Engineering", "Approved", ""],
    ]),
  },
  {
    reportId: "RPT-2026-001",
    company: "Malayan Flour Mills",
    bursaCode: "3662",
    financialYear: "FY2024",
    revenue: 3200,
    netProfit: 210,
    eps: 0.19,
    pat: 205,
    createdBy: "Priya Nair",
    submissionDate: "2026-05-21",
    status: "Approved",
    history: baseHistory("Priya Nair", "2026-05-21", [
      ["Draft", "Priya Nair", "Bursa Operations", "Created draft", ""],
      ["Pending", "Priya Nair", "Bursa Operations", "Submitted for validation", ""],
      ["Approved", "Daniel Wong", "IT Governance", "Approved", ""],
    ]),
  },
];

const WORKFLOW_STAGES = [
  "Draft",
  "Pending",
  "Data Verified",
  "Tech Verified",
  "Approved",
  "Rejected",
  "Deployed",
];

const fmtMoney = (v: number) => `RM ${v.toLocaleString("en-MY")}k`;
const badgeStatus = (s: RecordStatus) =>
  s.toLowerCase() as "pending" | "approved" | "rejected";

interface FormState {
  company: string;
  bursaCode: string;
  financialYear: string;
  revenue: string;
  netProfit: string;
  eps: string;
  pat: string;
}

const emptyForm: FormState = {
  company: "",
  bursaCode: "",
  financialYear: "",
  revenue: "",
  netProfit: "",
  eps: "",
  pat: "",
};

const INT_RE = /^\d+$/;
const DEC_RE = /^\d+(\.\d+)?$/;

function validateForm(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.company.trim()) errors.company = "Company name is required";
  if (!form.bursaCode.trim()) errors.bursaCode = "Bursa code is required";
  if (!form.financialYear.trim()) errors.financialYear = "Financial year is required";
  if (!INT_RE.test(form.revenue.trim()))
    errors.revenue = "Revenue must be numbers only";
  if (!INT_RE.test(form.netProfit.trim()))
    errors.netProfit = "Net profit must be numbers only";
  if (!DEC_RE.test(form.eps.trim())) errors.eps = "EPS must be a decimal value";
  if (!DEC_RE.test(form.pat.trim())) errors.pat = "PAT must be a decimal value";
  return errors;
}

export default function BursaDataEntry() {
  const ctrl = useRecordControls(records, {
    searchKeys: (r) => [r.company, r.bursaCode, r.reportId, r.financialYear, r.createdBy],
    status: (r) => r.status,
    date: (r) => r.submissionDate,
    name: (r) => r.company,
  });

  const [selected, setSelected] = useState<FinancialRecord | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (submitted) setErrors(validateForm({ ...form, [key]: value }));
  };

  const handleSubmit = () => {
    const errs = validateForm(form);
    setErrors(errs);
    setSubmitted(true);
    if (Object.keys(errs).length === 0) {
      setForm(emptyForm);
      setSubmitted(false);
    }
  };

  return (
    <ModuleShell
      process="Process 2.0 — Financial Data Validation Submodule"
      title="Bursa Data Entry"
      subtitle="Capture and validate Bursa Malaysia financial data before it is promoted to the staging environment."
    >
      {/* Filter-aware summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Records" value={String(ctrl.counts.All)} hint="Matching current search" />
        <StatCard label="Pending Approval" value={String(ctrl.counts.Pending ?? 0)} hint="In review queue" />
        <StatCard label="Approved" value={String(ctrl.counts.Approved ?? 0)} hint="Cleared for staging" />
        <StatCard label="Rejected" value={String(ctrl.counts.Rejected ?? 0)} hint="Returned for fixes" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Submission form with validation */}
        <div className="lg:col-span-1">
          <Panel title="New Data Submission">
            <div className="space-y-4">
              <FormInput
                label="Company Name"
                value={form.company}
                onChange={(v) => setField("company", v)}
                error={errors.company}
                placeholder="e.g. Maybank Berhad"
              />
              <FormInput
                label="Bursa Code"
                value={form.bursaCode}
                onChange={(v) => setField("bursaCode", v)}
                error={errors.bursaCode}
                placeholder="e.g. 1155"
              />
              <FormInput
                label="Financial Year"
                value={form.financialYear}
                onChange={(v) => setField("financialYear", v)}
                error={errors.financialYear}
                placeholder="e.g. FY2025"
              />
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Revenue (RM '000)"
                  value={form.revenue}
                  onChange={(v) => setField("revenue", v)}
                  error={errors.revenue}
                  placeholder="0"
                  inputMode="numeric"
                />
                <FormInput
                  label="Net Profit (RM '000)"
                  value={form.netProfit}
                  onChange={(v) => setField("netProfit", v)}
                  error={errors.netProfit}
                  placeholder="0"
                  inputMode="numeric"
                />
                <FormInput
                  label="EPS"
                  value={form.eps}
                  onChange={(v) => setField("eps", v)}
                  error={errors.eps}
                  placeholder="0.00"
                  inputMode="decimal"
                />
                <FormInput
                  label="PAT (RM '000)"
                  value={form.pat}
                  onChange={(v) => setField("pat", v)}
                  error={errors.pat}
                  placeholder="0.00"
                  inputMode="decimal"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0B192C] hover:bg-emerald-400"
              >
                Submit for Validation
              </button>
              <p className="text-[11px] text-slate-500">
                Submissions run through automated range, format, and consistency checks before staging.
              </p>
            </div>
          </Panel>
        </div>

        {/* Records table with chips, search, sort, pagination */}
        <div className="lg:col-span-2">
          <Panel title="Financial Records">
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
                placeholder="Company, code, report ID, year, creator..."
              />
            </Toolbar>
            <div className="mb-3">
              <SortControl sortKey={ctrl.sortKey} sortDir={ctrl.sortDir} onSort={ctrl.setSort} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Report ID</th>
                    <th className="pb-3 pr-4 font-semibold">Company</th>
                    <th className="pb-3 pr-4 font-semibold">Code</th>
                    <th className="pb-3 pr-4 font-semibold">FY</th>
                    <th className="pb-3 pr-4 font-semibold">Submitted</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ctrl.view.map((r) => (
                    <tr
                      key={r.reportId}
                      onClick={() => setSelected(r)}
                      className={`cursor-pointer text-slate-200 transition-colors hover:bg-slate-800/50 ${
                        selected?.reportId === r.reportId ? "bg-slate-800/60" : ""
                      }`}
                    >
                      <td className="py-3 pr-4 font-mono text-xs text-slate-400">{r.reportId}</td>
                      <td className="py-3 pr-4 font-semibold">{r.company}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.bursaCode}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.financialYear}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.submissionDate}</td>
                      <td className="py-3"><StatusBadge status={badgeStatus(r.status)} /></td>
                    </tr>
                  ))}
                  {ctrl.view.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        No records match your filters.
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
      </div>

      {selected && <RecordDetail record={selected} onClose={() => setSelected(null)} />}
    </ModuleShell>
  );
}

function FormInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  inputMode?: "numeric" | "decimal";
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className={`w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 ${
          error ? "ring-2 ring-rose-500" : "ring-emerald-500"
        }`}
      />
      {error && <p className="mt-1 text-[11px] font-medium text-rose-400">{error}</p>}
    </div>
  );
}

function RecordDetail({ record, onClose }: { record: FinancialRecord; onClose: () => void }) {
  const completedStages = new Set(record.history.map((h) => h.stage));
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
      <div
        className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-800 bg-[#0B192C] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <span className="font-mono text-xs text-slate-500">{record.reportId}</span>
            <h2 className="text-2xl font-bold text-white">{record.company}</h2>
            <p className="text-sm text-slate-400">
              Bursa Code {record.bursaCode} · {record.financialYear}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={badgeStatus(record.status)} />
            <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Metric label="Revenue" value={fmtMoney(record.revenue)} />
          <Metric label="Net Profit" value={fmtMoney(record.netProfit)} />
          <Metric label="EPS" value={`RM ${record.eps.toFixed(2)}`} />
          <Metric label="PAT" value={fmtMoney(record.pat)} />
          <Metric label="Financial Year" value={record.financialYear} />
          <Metric label="Submission Date" value={record.submissionDate} />
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-200">
            Verification History
          </h3>
          <ol className="relative ml-2 border-l border-slate-700">
            {record.history.map((h, i) => (
              <li key={i} className="mb-5 ml-5">
                <span className="absolute -left-[7px] mt-1 h-3.5 w-3.5 rounded-full border-2 border-[#0B192C] bg-emerald-500" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white">{h.stage}</span>
                  <span className="text-xs text-slate-500">{h.date}</span>
                </div>
                <p className="text-xs text-slate-300">{h.action}</p>
                <p className="text-[11px] text-slate-500">
                  {h.user} · {h.department}
                </p>
                {h.notes && <p className="mt-1 text-[11px] italic text-slate-400">"{h.notes}"</p>}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-200">
            Workflow Progression
          </h3>
          <div className="flex flex-wrap gap-2">
            {WORKFLOW_STAGES.map((stage) => {
              const done = completedStages.has(stage);
              return (
                <span
                  key={stage}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                    done
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                      : "border-slate-700 text-slate-500"
                  }`}
                >
                  {stage}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}