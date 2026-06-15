// TypeScript interfaces for Staging Environment Management
export type ValidationStatus = "Passed" | "Warning" | "Failed";
export type ReviewDecision = "Approved" | "Rejected" | "Pending";

export interface StagingDataset {
  id: string;
  datasetName: string;
  recordCount: number;
  validationStatus: ValidationStatus;
  dataDriftPct: number;
  lastUpdated: string;
  reviewer: string;
  reviewStatus: ReviewDecision;
  notes: string;
  // Preview data
  preview: DatasetPreview;
}

export interface DatasetPreview {
  revenue: number;
  netProfit: number;
  eps: number;
  pat: number;
  companies: number;
  financialYear: string;
  quarter: string;
  topHoldings: Array<{ name: string; weight: string; value: string }>;
  revenueByQuarter: Array<{ quarter: string; value: number }>;
  charts: {
    revenueTrend: Array<{ label: string; value: number }>;
    profitMargin: Array<{ label: string; value: number }>;
  };
}

export interface ReviewEntry {
  id: string;
  reviewer: string;
  action: ReviewDecision;
  date: string;
  notes: string;
  datasetId: string;
  datasetName: string;
}

export interface ValidationCheck {
  label: string;
  status: ValidationStatus;
  detail: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const companies = ["Berjaya Corp", "Maybank", "CIMB Group", "Tenaga Nasional", "Petronas Chemicals", "Public Bank", "IHH Healthcare", "Dialog Group"];

const topHoldings = [
  { name: "Maybank", weight: "12.4%", value: "RM 48.2B" },
  { name: "CIMB Group", weight: "9.8%", value: "RM 37.1B" },
  { name: "Tenaga Nasional", weight: "8.7%", value: "RM 32.5B" },
  { name: "Public Bank", weight: "7.5%", value: "RM 28.9B" },
  { name: "Petronas Chemicals", weight: "6.2%", value: "RM 23.8B" },
];

const revenueByQuarter = [
  { quarter: "Q1 2026", value: 142500 },
  { quarter: "Q2 2026", value: 158200 },
  { quarter: "Q3 2026", value: 136800 },
  { quarter: "Q4 2026", value: 165400 },
];

const revenueTrend = [
  { label: "Jan", value: 48000 },
  { label: "Feb", value: 52300 },
  { label: "Mar", value: 42200 },
  { label: "Apr", value: 56100 },
  { label: "May", value: 49500 },
  { label: "Jun", value: 52600 },
];

const profitMargin = [
  { label: "Technology", value: 28.5 },
  { label: "Finance", value: 22.3 },
  { label: "Healthcare", value: 18.7 },
  { label: "Energy", value: 15.2 },
  { label: "Consumer", value: 12.8 },
];

let datasets: StagingDataset[] = [
  {
    id: "d1",
    datasetName: "EOD Pricing Batch — 2026-06-13",
    recordCount: 1842,
    validationStatus: "Passed",
    dataDriftPct: 0.2,
    lastUpdated: "2026-06-13",
    reviewer: "Wei Lin Tan",
    reviewStatus: "Approved",
    notes: "All pricing data validated against exchange feed. No discrepancies found.",
    preview: {
      revenue: 142500000,
      netProfit: 38500000,
      eps: 0.42,
      pat: 32100000,
      companies: 1842,
      financialYear: "FY2026",
      quarter: "Q2",
      topHoldings,
      revenueByQuarter,
      charts: { revenueTrend, profitMargin },
    },
  },
  {
    id: "d2",
    datasetName: "Corporate Actions Feed",
    recordCount: 57,
    validationStatus: "Warning",
    dataDriftPct: 1.8,
    lastUpdated: "2026-06-13",
    reviewer: "—",
    reviewStatus: "Pending",
    notes: "",
    preview: {
      revenue: 9800000,
      netProfit: 2100000,
      eps: 0.08,
      pat: 1800000,
      companies: 57,
      financialYear: "FY2026",
      quarter: "Q2",
      topHoldings: topHoldings.slice(0, 3),
      revenueByQuarter: revenueByQuarter.map((q) => ({ ...q, value: q.value * 0.07 })),
      charts: {
        revenueTrend: revenueTrend.map((r) => ({ ...r, value: r.value * 0.07 })),
        profitMargin: profitMargin.map((p) => ({ ...p, value: p.value * 0.85 })),
      },
    },
  },
  {
    id: "d3",
    datasetName: "Index Constituents Refresh",
    recordCount: 412,
    validationStatus: "Passed",
    dataDriftPct: 0.0,
    lastUpdated: "2026-06-12",
    reviewer: "Daniel Wong",
    reviewStatus: "Approved",
    notes: "Constituent list matches index provider. No changes in weighting.",
    preview: {
      revenue: 89000000,
      netProfit: 22100000,
      eps: 0.31,
      pat: 18900000,
      companies: 412,
      financialYear: "FY2026",
      quarter: "Q1",
      topHoldings,
      revenueByQuarter,
      charts: { revenueTrend, profitMargin },
    },
  },
  {
    id: "d4",
    datasetName: "Foreign Exchange Snapshot",
    recordCount: 34,
    validationStatus: "Failed",
    dataDriftPct: 4.6,
    lastUpdated: "2026-06-12",
    reviewer: "—",
    reviewStatus: "Rejected",
    notes: "Drift exceeds threshold of 3.0%. Source data may have inconsistencies.",
    preview: {
      revenue: 5600000,
      netProfit: 890000,
      eps: 0.02,
      pat: 720000,
      companies: 34,
      financialYear: "FY2026",
      quarter: "Q2",
      topHoldings: topHoldings.slice(0, 2),
      revenueByQuarter: revenueByQuarter.map((q) => ({ ...q, value: q.value * 0.04 })),
      charts: {
        revenueTrend: revenueTrend.map((r) => ({ ...r, value: r.value * 0.04 })),
        profitMargin: profitMargin.map((p) => ({ ...p, value: p.value * 0.6 })),
      },
    },
  },
  {
    id: "d5",
    datasetName: "Dividend Schedule Import",
    recordCount: 128,
    validationStatus: "Passed",
    dataDriftPct: 0.4,
    lastUpdated: "2026-06-11",
    reviewer: "Wei Lin Tan",
    reviewStatus: "Approved",
    notes: "Dividend declarations verified against company announcements.",
    preview: {
      revenue: 22500000,
      netProfit: 5800000,
      eps: 0.15,
      pat: 4900000,
      companies: 128,
      financialYear: "FY2026",
      quarter: "Q2",
      topHoldings,
      revenueByQuarter: revenueByQuarter.map((q) => ({ ...q, value: q.value * 0.16 })),
      charts: {
        revenueTrend: revenueTrend.map((r) => ({ ...r, value: r.value * 0.16 })),
        profitMargin: profitMargin.map((p) => ({ ...p, value: p.value * 0.9 })),
      },
    },
  },
  {
    id: "d6",
    datasetName: "Sector Classification Map",
    recordCount: 96,
    validationStatus: "Passed",
    dataDriftPct: 0.0,
    lastUpdated: "2026-06-11",
    reviewer: "—",
    reviewStatus: "Pending",
    notes: "",
    preview: {
      revenue: 18000000,
      netProfit: 4200000,
      eps: 0.11,
      pat: 3600000,
      companies: 96,
      financialYear: "FY2026",
      quarter: "Q1",
      topHoldings: topHoldings.slice(0, 4),
      revenueByQuarter: revenueByQuarter.map((q) => ({ ...q, value: q.value * 0.13 })),
      charts: {
        revenueTrend: revenueTrend.map((r) => ({ ...r, value: r.value * 0.13 })),
        profitMargin: profitMargin.map((p) => ({ ...p, value: p.value * 0.75 })),
      },
    },
  },
  {
    id: "d7",
    datasetName: "Bond Yield Curve",
    recordCount: 240,
    validationStatus: "Warning",
    dataDriftPct: 2.1,
    lastUpdated: "2026-06-10",
    reviewer: "—",
    reviewStatus: "Pending",
    notes: "",
    preview: {
      revenue: 42000000,
      netProfit: 10500000,
      eps: 0.22,
      pat: 8900000,
      companies: 240,
      financialYear: "FY2026",
      quarter: "Q2",
      topHoldings,
      revenueByQuarter: revenueByQuarter.map((q) => ({ ...q, value: q.value * 0.3 })),
      charts: {
        revenueTrend: revenueTrend.map((r) => ({ ...r, value: r.value * 0.3 })),
        profitMargin: profitMargin.map((p) => ({ ...p, value: p.value * 0.8 })),
      },
    },
  },
  {
    id: "d8",
    datasetName: "Warrant Pricing Batch",
    recordCount: 318,
    validationStatus: "Failed",
    dataDriftPct: 5.2,
    lastUpdated: "2026-06-09",
    reviewer: "—",
    reviewStatus: "Rejected",
    notes: "Price anomalies detected in 12 warrant series. Requires manual review.",
    preview: {
      revenue: 14200000,
      netProfit: 3100000,
      eps: 0.06,
      pat: 2600000,
      companies: 318,
      financialYear: "FY2026",
      quarter: "Q1",
      topHoldings: topHoldings.slice(0, 3),
      revenueByQuarter: revenueByQuarter.map((q) => ({ ...q, value: q.value * 0.1 })),
      charts: {
        revenueTrend: revenueTrend.map((r) => ({ ...r, value: r.value * 0.1 })),
        profitMargin: profitMargin.map((p) => ({ ...p, value: p.value * 0.55 })),
      },
    },
  },
  {
    id: "d9",
    datasetName: "ESG Score Refresh",
    recordCount: 510,
    validationStatus: "Passed",
    dataDriftPct: 0.7,
    lastUpdated: "2026-06-08",
    reviewer: "Daniel Wong",
    reviewStatus: "Approved",
    notes: "ESG scores updated from latest sustainability reports. All data verified.",
    preview: {
      revenue: 92000000,
      netProfit: 24500000,
      eps: 0.35,
      pat: 21000000,
      companies: 510,
      financialYear: "FY2026",
      quarter: "Q2",
      topHoldings,
      revenueByQuarter,
      charts: { revenueTrend, profitMargin },
    },
  },
  {
    id: "d10",
    datasetName: "Liquidity Metrics",
    recordCount: 144,
    validationStatus: "Passed",
    dataDriftPct: 1.2,
    lastUpdated: "2026-06-07",
    reviewer: "Wei Lin Tan",
    reviewStatus: "Approved",
    notes: "Liquidity ratios calculated from latest trading volumes. Acceptable.",
    preview: {
      revenue: 31000000,
      netProfit: 7800000,
      eps: 0.18,
      pat: 6600000,
      companies: 144,
      financialYear: "FY2026",
      quarter: "Q2",
      topHoldings: topHoldings.slice(0, 4),
      revenueByQuarter: revenueByQuarter.map((q) => ({ ...q, value: q.value * 0.22 })),
      charts: {
        revenueTrend: revenueTrend.map((r) => ({ ...r, value: r.value * 0.22 })),
        profitMargin: profitMargin.map((p) => ({ ...p, value: p.value * 0.85 })),
      },
    },
  },
  {
    id: "d11",
    datasetName: "Short Interest Feed",
    recordCount: 62,
    validationStatus: "Warning",
    dataDriftPct: 3.4,
    lastUpdated: "2026-06-06",
    reviewer: "—",
    reviewStatus: "Pending",
    notes: "",
    preview: {
      revenue: 8900000,
      netProfit: 1900000,
      eps: 0.04,
      pat: 1500000,
      companies: 62,
      financialYear: "FY2026",
      quarter: "Q2",
      topHoldings: topHoldings.slice(0, 2),
      revenueByQuarter: revenueByQuarter.map((q) => ({ ...q, value: q.value * 0.06 })),
      charts: {
        revenueTrend: revenueTrend.map((r) => ({ ...r, value: r.value * 0.06 })),
        profitMargin: profitMargin.map((p) => ({ ...p, value: p.value * 0.65 })),
      },
    },
  },
  {
    id: "d12",
    datasetName: "Analyst Ratings Import",
    recordCount: 201,
    validationStatus: "Passed",
    dataDriftPct: 0.9,
    lastUpdated: "2026-06-05",
    reviewer: "Daniel Wong",
    reviewStatus: "Approved",
    notes: "Analyst consensus ratings validated against Bloomberg terminal.",
    preview: {
      revenue: 38500000,
      netProfit: 9200000,
      eps: 0.24,
      pat: 7800000,
      companies: 201,
      financialYear: "FY2026",
      quarter: "Q2",
      topHoldings,
      revenueByQuarter: revenueByQuarter.map((q) => ({ ...q, value: q.value * 0.27 })),
      charts: {
        revenueTrend: revenueTrend.map((r) => ({ ...r, value: r.value * 0.27 })),
        profitMargin: profitMargin.map((p) => ({ ...p, value: p.value * 0.88 })),
      },
    },
  },
];

let reviewHistory: ReviewEntry[] = [
  { id: "r1", reviewer: "Wei Lin Tan", action: "Approved", date: "2026-06-14", notes: "Data integrity confirmed. All checks passed.", datasetId: "d1", datasetName: "EOD Pricing Batch — 2026-06-13" },
  { id: "r2", reviewer: "Daniel Wong", action: "Approved", date: "2026-06-13", notes: "Index constituents verified against provider.", datasetId: "d3", datasetName: "Index Constituents Refresh" },
  { id: "r3", reviewer: "System Admin", action: "Rejected", date: "2026-06-12", notes: "Drift exceeds threshold of 3.0%", datasetId: "d4", datasetName: "Foreign Exchange Snapshot" },
  { id: "r4", reviewer: "Wei Lin Tan", action: "Approved", date: "2026-06-12", notes: "Dividend schedule verified with Bursa.", datasetId: "d5", datasetName: "Dividend Schedule Import" },
  { id: "r5", reviewer: "System Admin", action: "Rejected", date: "2026-06-10", notes: "12 warrant series with price anomalies detected.", datasetId: "d8", datasetName: "Warrant Pricing Batch" },
  { id: "r6", reviewer: "Daniel Wong", action: "Approved", date: "2026-06-09", notes: "ESG scores verified against source data.", datasetId: "d9", datasetName: "ESG Score Refresh" },
  { id: "r7", reviewer: "Wei Lin Tan", action: "Approved", date: "2026-06-08", notes: "Liquidity metrics within acceptable range.", datasetId: "d10", datasetName: "Liquidity Metrics" },
  { id: "r8", reviewer: "Daniel Wong", action: "Approved", date: "2026-06-06", notes: "Analyst ratings validated via Bloomberg terminal.", datasetId: "d12", datasetName: "Analyst Ratings Import" },
];

const validationChecks: Record<string, ValidationCheck[]> = {
  Schema: [
    { label: "Schema conformance", status: "Passed", detail: "All columns match expected schema" },
    { label: "Duplicate detection", status: "Passed", detail: "No duplicate records found" },
    { label: "Null-rate threshold", status: "Passed", detail: "Null rate < 1% threshold" },
    { label: "Data type validation", status: "Passed", detail: "All columns match expected data types" },
  ],
  Quality: [
    { label: "Cross-source reconciliation", status: "Warning", detail: "1 field mismatched between sources" },
    { label: "Outlier scan", status: "Failed", detail: "2 anomalies detected in price data" },
    { label: "Range check", status: "Passed", detail: "All values within expected ranges" },
    { label: "Format consistency", status: "Passed", detail: "Date and number formats consistent" },
  ],
};

let nextReviewId = 9;

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const stagingService = {
  async list() {
    await delay();
    return [...datasets];
  },

  async getById(id: string) {
    await delay();
    const ds = datasets.find((d) => d.id === id);
    if (!ds) throw new Error(`Dataset ${id} not found`);
    return { ...ds, preview: { ...ds.preview } };
  },

  async review(id: string, action: ReviewDecision, notes: string, reviewer: string) {
    await delay();
    const idx = datasets.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Dataset ${id} not found`);
    datasets[idx] = { ...datasets[idx], reviewStatus: action, notes, reviewer };
    reviewHistory.unshift({
      id: `r${nextReviewId++}`,
      reviewer,
      action,
      date: new Date().toISOString().slice(0, 10),
      notes,
      datasetId: id,
      datasetName: datasets[idx].datasetName,
    });
    return { ...datasets[idx] };
  },

  async getReviewHistory() {
    await delay();
    return [...reviewHistory];
  },

  async getReviewHistoryForDataset(datasetId: string) {
    await delay();
    return reviewHistory.filter((r) => r.datasetId === datasetId);
  },

  async getValidationChecks() {
    await delay();
    return { ...validationChecks, Schema: [...validationChecks.Schema], Quality: [...validationChecks.Quality] };
  },
};

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `RM ${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `RM ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `RM ${(value / 1_000).toFixed(2)}K`;
  return `RM ${value.toFixed(2)}`;
}