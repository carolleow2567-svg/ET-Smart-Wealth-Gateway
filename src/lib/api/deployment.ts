// TypeScript interfaces for Deployment Release Control
export type DeploymentStatus = "Ready For Release" | "Released" | "Failed" | "Rolled Back";
export type Environment = "Production" | "Pre-Prod";

export interface ReleaseRecord {
  id: string;
  releaseId: string;
  environment: Environment;
  status: DeploymentStatus;
  approvedBy: string;
  releaseDate: string;
  version: string;
}

export interface DeployChecklistItem {
  label: string;
  key: string;
  passed: boolean;
}

export interface ReleaseLogEntry {
  id: string;
  releaseId: string;
  version: string;
  user: string;
  date: string;
  status: string;
  action: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

let releases: ReleaseRecord[] = [
  { id: "r1", releaseId: "REL-2026-001", environment: "Production", status: "Released", approvedBy: "Daniel Wong", releaseDate: "2026-06-12", version: "v4.12.0" },
  { id: "r2", releaseId: "REL-2026-002", environment: "Pre-Prod", status: "Ready For Release", approvedBy: "—", releaseDate: "2026-06-13", version: "v4.13.0-rc1" },
  { id: "r3", releaseId: "REL-2026-003", environment: "Production", status: "Released", approvedBy: "Daniel Wong", releaseDate: "2026-06-09", version: "v4.11.4" },
  { id: "r4", releaseId: "REL-2026-004", environment: "Pre-Prod", status: "Failed", approvedBy: "Marcus Lee", releaseDate: "2026-06-11", version: "v4.13.0-rc0" },
  { id: "r5", releaseId: "REL-2026-005", environment: "Production", status: "Released", approvedBy: "Daniel Wong", releaseDate: "2026-06-05", version: "v4.11.3" },
  { id: "r6", releaseId: "REL-2026-006", environment: "Pre-Prod", status: "Failed", approvedBy: "Wei Lin Tan", releaseDate: "2026-06-03", version: "v4.11.2-rc2" },
  { id: "r7", releaseId: "REL-2026-007", environment: "Production", status: "Released", approvedBy: "Marcus Lee", releaseDate: "2026-06-01", version: "v4.11.2" },
  { id: "r8", releaseId: "REL-2026-008", environment: "Pre-Prod", status: "Ready For Release", approvedBy: "—", releaseDate: "2026-06-13", version: "v4.12.1-rc1" },
  { id: "r9", releaseId: "REL-2026-009", environment: "Production", status: "Rolled Back", approvedBy: "Daniel Wong", releaseDate: "2026-05-28", version: "v4.10.9" },
  { id: "r10", releaseId: "REL-2026-010", environment: "Pre-Prod", status: "Ready For Release", approvedBy: "—", releaseDate: "2026-05-26", version: "v4.10.8-rc1" },
  { id: "r11", releaseId: "REL-2026-011", environment: "Production", status: "Released", approvedBy: "Wei Lin Tan", releaseDate: "2026-05-22", version: "v4.10.7" },
];

const defaultChecklist: DeployChecklistItem[] = [
  { label: "Data Approved", key: "data", passed: true },
  { label: "Tech Approved", key: "tech", passed: true },
  { label: "Security Check Passed", key: "security", passed: false },
  { label: "Rollback Plan Available", key: "rollback", passed: false },
];

let checklists: Record<string, DeployChecklistItem[]> = {
  "r2": [
    { label: "Data Approved", key: "data", passed: true },
    { label: "Tech Approved", key: "tech", passed: true },
    { label: "Security Check Passed", key: "security", passed: false },
    { label: "Rollback Plan Available", key: "rollback", passed: false },
  ],
  "r8": [
    { label: "Data Approved", key: "data", passed: true },
    { label: "Tech Approved", key: "tech", passed: false },
    { label: "Security Check Passed", key: "security", passed: false },
    { label: "Rollback Plan Available", key: "rollback", passed: true },
  ],
  "r10": [
    { label: "Data Approved", key: "data", passed: true },
    { label: "Tech Approved", key: "tech", passed: false },
    { label: "Security Check Passed", key: "security", passed: false },
    { label: "Rollback Plan Available", key: "rollback", passed: false },
  ],
};

const releaseLogs: ReleaseLogEntry[] = [
  { id: "l1", releaseId: "r1", version: "v4.12.0", user: "Daniel Wong", date: "2026-06-12 14:30:00", status: "Released", action: "Promoted to Production" },
  { id: "l2", releaseId: "r3", version: "v4.11.4", user: "Daniel Wong", date: "2026-06-09 10:15:00", status: "Released", action: "Promoted to Production" },
  { id: "l3", releaseId: "r4", version: "v4.13.0-rc0", user: "System Admin", date: "2026-06-11 16:45:00", status: "Failed", action: "Deployment failed - security check" },
  { id: "l4", releaseId: "r5", version: "v4.11.3", user: "Daniel Wong", date: "2026-06-05 09:00:00", status: "Released", action: "Promoted to Production" },
  { id: "l5", releaseId: "r6", version: "v4.11.2-rc2", user: "System Admin", date: "2026-06-03 11:30:00", status: "Failed", action: "Data drift threshold exceeded" },
  { id: "l6", releaseId: "r7", version: "v4.11.2", user: "Marcus Lee", date: "2026-06-01 08:45:00", status: "Released", action: "Routine production release" },
  { id: "l7", releaseId: "r9", version: "v4.10.9", user: "Daniel Wong", date: "2026-05-29 09:30:00", status: "Rolled Back", action: "Rolled back due to performance regression" },
  { id: "l8", releaseId: "r11", version: "v4.10.7", user: "Wei Lin Tan", date: "2026-05-22 10:00:00", status: "Released", action: "Promoted to Production" },
];

let nextLogId = 9;

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const deploymentService = {
  async list() {
    await delay();
    return [...releases];
  },

  async getById(id: string) {
    await delay();
    const r = releases.find((rel) => rel.id === id);
    if (!r) throw new Error(`Release ${id} not found`);
    return { ...r };
  },

  async getChecklist(releaseId: string) {
    await delay();
    return checklists[releaseId] ? [...checklists[releaseId]] : [...defaultChecklist];
  },

  async promoteToProduction(id: string, user: string) {
    await delay();
    const idx = releases.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Release ${id} not found`);
    releases[idx] = {
      ...releases[idx],
      environment: "Production",
      status: "Released",
      approvedBy: user,
      releaseDate: new Date().toISOString().slice(0, 10),
    };

    releaseLogs.unshift({
      id: `l${nextLogId++}`,
      releaseId: id,
      version: releases[idx].version,
      user,
      date: new Date().toISOString().replace("T", " ").slice(0, 19),
      status: "Released",
      action: "Promoted to Production",
    });

    return { ...releases[idx] };
  },

  async scheduleRelease(id: string, scheduledDate: string, user: string) {
    await delay();
    const idx = releases.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Release ${id} not found`);
    releases[idx] = {
      ...releases[idx],
      status: "Ready For Release",
      releaseDate: scheduledDate,
    };

    releaseLogs.unshift({
      id: `l${nextLogId++}`,
      releaseId: id,
      version: releases[idx].version,
      user,
      date: new Date().toISOString().replace("T", " ").slice(0, 19),
      status: "Ready For Release",
      action: `Scheduled for ${scheduledDate}`,
    });

    return { ...releases[idx] };
  },

  async rollbackRelease(id: string, user: string, reason: string) {
    await delay();
    const idx = releases.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Release ${id} not found`);
    releases[idx] = {
      ...releases[idx],
      status: "Rolled Back",
      releaseDate: new Date().toISOString().slice(0, 10),
    };

    releaseLogs.unshift({
      id: `l${nextLogId++}`,
      releaseId: id,
      version: releases[idx].version,
      user,
      date: new Date().toISOString().replace("T", " ").slice(0, 19),
      status: "Rolled Back",
      action: reason,
    });

    return { ...releases[idx] };
  },

  async getReleaseLogs() {
    await delay();
    return [...releaseLogs];
  },

  async getReleaseLogsForRelease(releaseId: string) {
    await delay();
    return releaseLogs.filter((l) => l.releaseId === releaseId);
  },

  async toggleChecklistItem(releaseId: string, key: string) {
    await delay();
    if (!checklists[releaseId]) {
      checklists[releaseId] = defaultChecklist.map((item) => ({ ...item }));
    }
    const idx = checklists[releaseId].findIndex((item) => item.key === key);
    if (idx !== -1) {
      checklists[releaseId][idx] = {
        ...checklists[releaseId][idx],
        passed: !checklists[releaseId][idx].passed,
      };
    }
    return [...checklists[releaseId]];
  },
};