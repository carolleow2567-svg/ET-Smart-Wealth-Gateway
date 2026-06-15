// TypeScript interfaces for Approval Management
export type ApprovalStage =
  | "Data Department Validation"
  | "Tech Department Validation"
  | "Technical Lead Approval"
  | "Deployment Ready";

export type ApprovalAction = "Approved" | "Rejected" | "Revision Requested";

export interface ApprovalRecord {
  id: string;
  reportId: string;
  company: string;
  submittedBy: string;
  currentStage: ApprovalStage;
  reviewer: string;
  date: string;
}

export interface ApprovalTimelineEntry {
  stage: ApprovalStage;
  status: "completed" | "current" | "pending" | "rejected";
  completedBy?: string;
  completedAt?: string;
  comment?: string;
}

export interface ApprovalHistoryEntry {
  id: string;
  recordId: string;
  user: string;
  role: string;
  action: ApprovalAction;
  timestamp: string;
  comment: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

let records: ApprovalRecord[] = [
  { id: "a1", reportId: "BR-2026-001", company: "Maybank", submittedBy: "Aisha Rahman", currentStage: "Technical Lead Approval", reviewer: "Daniel Wong", date: "2026-06-10" },
  { id: "a2", reportId: "BR-2026-002", company: "CIMB Group", submittedBy: "Suresh Kumar", currentStage: "Data Department Validation", reviewer: "—", date: "2026-06-14" },
  { id: "a3", reportId: "BR-2026-003", company: "Tenaga Nasional", submittedBy: "Arif Hassan", currentStage: "Tech Department Validation", reviewer: "Wei Lin Tan", date: "2026-06-13" },
  { id: "a4", reportId: "BR-2026-004", company: "Petronas Chemicals", submittedBy: "Nurul Izzah", currentStage: "Deployment Ready", reviewer: "Daniel Wong", date: "2026-06-09" },
  { id: "a5", reportId: "BR-2026-005", company: "Public Bank", submittedBy: "Aisha Rahman", currentStage: "Tech Department Validation", reviewer: "Wei Lin Tan", date: "2026-06-12" },
  { id: "a6", reportId: "BR-2026-006", company: "IHH Healthcare", submittedBy: "Suresh Kumar", currentStage: "Data Department Validation", reviewer: "—", date: "2026-06-14" },
  { id: "a7", reportId: "BR-2026-007", company: "Dialog Group", submittedBy: "Arif Hassan", currentStage: "Technical Lead Approval", reviewer: "Daniel Wong", date: "2026-06-11" },
  { id: "a8", reportId: "BR-2026-008", company: "Berjaya Corp", submittedBy: "Nurul Izzah", currentStage: "Deployment Ready", reviewer: "Daniel Wong", date: "2026-06-08" },
  { id: "a9", reportId: "BR-2026-009", company: "Top Glove", submittedBy: "Aisha Rahman", currentStage: "Data Department Validation", reviewer: "—", date: "2026-06-15" },
  { id: "a10", reportId: "BR-2026-010", company: "Genting Berhad", submittedBy: "Suresh Kumar", currentStage: "Tech Department Validation", reviewer: "Wei Lin Tan", date: "2026-06-11" },
  { id: "a11", reportId: "BR-2026-011", company: "Maxis", submittedBy: "Arif Hassan", currentStage: "Technical Lead Approval", reviewer: "Daniel Wong", date: "2026-06-10" },
  { id: "a12", reportId: "BR-2026-012", company: "Astro Malaysia", submittedBy: "Nurul Izzah", currentStage: "Deployment Ready", reviewer: "Daniel Wong", date: "2026-06-07" },
];

export const ALL_STAGES: ApprovalStage[] = [
  "Data Department Validation",
  "Tech Department Validation",
  "Technical Lead Approval",
  "Deployment Ready",
];

function stageIndex(stage: ApprovalStage): number {
  return ALL_STAGES.indexOf(stage);
}

// Build timeline for a record based on its current stage
function buildTimeline(record: ApprovalRecord): ApprovalTimelineEntry[] {
  const idx = stageIndex(record.currentStage);
  return ALL_STAGES.map((stage, i) => {
    if (i < idx) {
      return { stage, status: "completed", completedBy: record.reviewer, completedAt: record.date, comment: "Approved" };
    }
    if (i === idx) {
      return { stage, status: record.currentStage === "Deployment Ready" ? "completed" : "current", completedBy: record.reviewer, completedAt: record.date };
    }
    return { stage, status: "pending" };
  });
}

// Explicit history entries for each record
const historyEntries: ApprovalHistoryEntry[] = [
  { id: "h1", recordId: "a1", user: "Aisha Rahman", role: "Data Department Staff", action: "Approved", timestamp: "2026-06-10 09:15:00", comment: "Data validated. All checks passed." },
  { id: "h2", recordId: "a1", user: "Wei Lin Tan", role: "Tech Department Staff", action: "Approved", timestamp: "2026-06-11 11:30:00", comment: "Technical review complete. No issues found." },
  { id: "h3", recordId: "a4", user: "Aisha Rahman", role: "Data Department Staff", action: "Approved", timestamp: "2026-06-07 10:00:00", comment: "Data entry verified." },
  { id: "h4", recordId: "a4", user: "Wei Lin Tan", role: "Tech Department Staff", action: "Approved", timestamp: "2026-06-08 14:20:00", comment: "Tech validation passed." },
  { id: "h5", recordId: "a4", user: "Daniel Wong", role: "Technical Lead", action: "Approved", timestamp: "2026-06-09 09:45:00", comment: "Final approval granted. Ready for deployment." },
  { id: "h6", recordId: "a8", user: "Aisha Rahman", role: "Data Department Staff", action: "Approved", timestamp: "2026-06-06 08:30:00", comment: "Data verified against source." },
  { id: "h7", recordId: "a8", user: "Wei Lin Tan", role: "Tech Department Staff", action: "Approved", timestamp: "2026-06-07 13:15:00", comment: "All technical checks passed." },
  { id: "h8", recordId: "a8", user: "Daniel Wong", role: "Technical Lead", action: "Approved", timestamp: "2026-06-08 10:00:00", comment: "Approved for production deployment." },
  { id: "h9", recordId: "a12", user: "Nurul Izzah", role: "Data Department Staff", action: "Approved", timestamp: "2026-06-05 09:00:00", comment: "Data validated." },
  { id: "h10", recordId: "a12", user: "Wei Lin Tan", role: "Tech Department Staff", action: "Approved", timestamp: "2026-06-06 11:45:00", comment: "Tech review completed." },
  { id: "h11", recordId: "a12", user: "Daniel Wong", role: "Technical Lead", action: "Approved", timestamp: "2026-06-07 14:30:00", comment: "Final sign-off. Deployment ready." },
  { id: "h12", recordId: "a10", user: "Suresh Kumar", role: "Data Department Staff", action: "Approved", timestamp: "2026-06-09 10:20:00", comment: "Data reviewed and accepted." },
  { id: "h13", recordId: "a5", user: "Aisha Rahman", role: "Data Department Staff", action: "Approved", timestamp: "2026-06-10 09:30:00", comment: "Data validated successfully." },
  { id: "h14", recordId: "a3", user: "Arif Hassan", role: "Data Department Staff", action: "Approved", timestamp: "2026-06-11 08:45:00", comment: "Financial data verified." },
];

let nextHistoryId = 15;

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const approvalService = {
  async list() {
    await delay();
    return [...records];
  },

  async getById(id: string) {
    await delay();
    const record = records.find((r) => r.id === id);
    if (!record) throw new Error(`Record ${id} not found`);
    return { ...record };
  },

  async getTimeline(recordId: string) {
    await delay();
    const record = records.find((r) => r.id === recordId);
    if (!record) throw new Error(`Record ${recordId} not found`);
    return buildTimeline(record);
  },

  async getHistory(recordId: string) {
    await delay();
    return historyEntries.filter((h) => h.recordId === recordId);
  },

  async getAllHistory() {
    await delay();
    return [...historyEntries];
  },

  async approve(recordId: string, comment: string, user: string, role: string) {
    await delay();
    const idx = records.findIndex((r) => r.id === recordId);
    if (idx === -1) throw new Error(`Record ${recordId} not found`);

    const currentIdx = stageIndex(records[idx].currentStage);
    const nextIdx = Math.min(currentIdx + 1, ALL_STAGES.length - 1);
    records[idx] = {
      ...records[idx],
      currentStage: ALL_STAGES[nextIdx],
      reviewer: user,
      date: new Date().toISOString().slice(0, 10),
    };

    historyEntries.unshift({
      id: `h${nextHistoryId++}`,
      recordId,
      user,
      role,
      action: "Approved",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      comment,
    });

    return { ...records[idx] };
  },

  async reject(recordId: string, comment: string, user: string, role: string) {
    await delay();
    const idx = records.findIndex((r) => r.id === recordId);
    if (idx === -1) throw new Error(`Record ${recordId} not found`);

    // Rejection resets to Data Department Validation
    records[idx] = {
      ...records[idx],
      currentStage: "Data Department Validation",
      reviewer: user,
      date: new Date().toISOString().slice(0, 10),
    };

    historyEntries.unshift({
      id: `h${nextHistoryId++}`,
      recordId,
      user,
      role,
      action: "Rejected",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      comment,
    });

    return { ...records[idx] };
  },

  /** Submit a record from Bursa Data Entry into the approval pipeline */
  async submitFromBursa(company: string, reportId: string, submittedBy: string) {
    await delay();
    const newRecord: ApprovalRecord = {
      id: `a${Date.now()}`,
      reportId,
      company,
      submittedBy,
      currentStage: "Data Department Validation",
      reviewer: "—",
      date: new Date().toISOString().slice(0, 10),
    };
    records.unshift(newRecord);
    historyEntries.unshift({
      id: `h${nextHistoryId++}`,
      recordId: newRecord.id,
      user: submittedBy,
      role: "Data Department Staff",
      action: "Approved",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      comment: "Submitted from Bursa Data Entry. Awaiting Data Department Validation.",
    });
    return { ...newRecord };
  },

  async requestRevision(recordId: string, comment: string, user: string, role: string) {
    await delay();
    const idx = records.findIndex((r) => r.id === recordId);
    if (idx === -1) throw new Error(`Record ${recordId} not found`);

    // Move back one stage
    const currentIdx = stageIndex(records[idx].currentStage);
    const prevIdx = Math.max(currentIdx - 1, 0);
    records[idx] = {
      ...records[idx],
      currentStage: ALL_STAGES[prevIdx],
      reviewer: user,
      date: new Date().toISOString().slice(0, 10),
    };

    historyEntries.unshift({
      id: `h${nextHistoryId++}`,
      recordId,
      user,
      role,
      action: "Revision Requested",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      comment,
    });

    return { ...records[idx] };
  },
};