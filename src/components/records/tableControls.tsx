import { useMemo, useState, type ReactNode } from "react";

export type SortKey = "date" | "name" | "status";
export type SortDir = "asc" | "desc";

export interface RecordControlsOptions<T> {
  /** Strings searched against the query (case-insensitive). */
  searchKeys: (row: T) => Array<string | number | null | undefined>;
  /** Normalised status value for a row, e.g. "Pending". */
  status: (row: T) => string;
  /** ISO/sortable date string for date sorting. */
  date?: (row: T) => string;
  /** Display name used for name sorting. */
  name?: (row: T) => string;
  /** Status chips to show. Defaults to Pending / Approved / Rejected. */
  statuses?: string[];
  /** Default rows per page. */
  initialPageSize?: number;
}

export interface RecordControls<T> {
  view: T[];
  total: number;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  counts: Record<string, number>;
  statuses: string[];
  sortKey: SortKey;
  sortDir: SortDir;
  setSort: (key: SortKey) => void;
  page: number;
  setPage: (n: number) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  pageCount: number;
  rangeStart: number;
  rangeEnd: number;
}

const norm = (v: string) => v.trim().toLowerCase();

export function useRecordControls<T>(
  rows: T[],
  opts: RecordControlsOptions<T>,
): RecordControls<T> {
  const statuses = opts.statuses ?? ["Pending", "Approved", "Rejected"];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(opts.initialPageSize ?? 10);

  // 1. Search filter — counts are derived from this set so chips + cards
  //    update live as the user types.
  const searched = useMemo(() => {
    const q = norm(search);
    if (!q) return rows;
    return rows.filter((r) =>
      opts.searchKeys(r)
        .filter((v) => v !== null && v !== undefined)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, search, opts]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: searched.length };
    for (const s of statuses) c[s] = 0;
    for (const r of searched) {
      const s = opts.status(r);
      if (s in c) c[s] += 1;
    }
    return c;
  }, [searched, statuses, opts]);

  // 2. Status filter
  const filtered = useMemo(() => {
    if (statusFilter === "All") return searched;
    return searched.filter((r) => norm(opts.status(r)) === norm(statusFilter));
  }, [searched, statusFilter, opts]);

  // 3. Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name" && opts.name) {
        cmp = opts.name(a).localeCompare(opts.name(b));
      } else if (sortKey === "status") {
        cmp = opts.status(a).localeCompare(opts.status(b));
      } else if (opts.date) {
        cmp = opts.date(a).localeCompare(opts.date(b));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir, opts]);

  // 4. Pagination
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  const view = sorted.slice(start, start + pageSize);

  const setSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
    setPage(1);
  };

  const setPageSize = (n: number) => {
    setPageSizeState(n);
    setPage(1);
  };

  return {
    view,
    total,
    search,
    setSearch: (v) => {
      setSearch(v);
      setPage(1);
    },
    statusFilter,
    setStatusFilter: (v) => {
      setStatusFilter(v);
      setPage(1);
    },
    counts,
    statuses,
    sortKey,
    sortDir,
    setSort,
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
    rangeStart: total === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + pageSize, total),
  };
}

export function FilterChips({
  statuses,
  counts,
  active,
  onChange,
}: {
  statuses: string[];
  counts: Record<string, number>;
  active: string;
  onChange: (v: string) => void;
}) {
  const chips = ["All", ...statuses];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((s) => {
        const isActive = active === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              isActive
                ? "border-emerald-400 bg-emerald-500 text-[#0B192C]"
                : "border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {s} ({counts[s] ?? 0})
          </button>
        );
      })}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search records..."}
        className="w-full rounded-md bg-slate-800 py-2 pl-9 pr-9 text-sm text-white placeholder-slate-500 outline-none ring-emerald-500 focus:ring-2"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function SortControl({
  sortKey,
  sortDir,
  onSort,
  withName = true,
  withDate = true,
  nameLabel = "Company",
}: {
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  withName?: boolean;
  withDate?: boolean;
  nameLabel?: string;
}) {
  const buttons: Array<{ key: SortKey; label: string }> = [
    ...(withDate ? [{ key: "date" as SortKey, label: "Date" }] : []),
    ...(withName ? [{ key: "name" as SortKey, label: nameLabel }] : []),
    { key: "status", label: "Status" },
  ];
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] uppercase tracking-wider text-slate-500">Sort</span>
      {buttons.map((b) => {
        const isActive = sortKey === b.key;
        return (
          <button
            key={b.key}
            type="button"
            onClick={() => onSort(b.key)}
            className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
              isActive
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {b.label}
            {isActive && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function PaginationBar({
  rangeStart,
  rangeEnd,
  total,
  page,
  pageCount,
  pageSize,
  onPage,
  onPageSize,
}: {
  rangeStart: number;
  rangeEnd: number;
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  onPage: (n: number) => void;
  onPageSize: (n: number) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <span>Rows</span>
        {[10, 25, 50].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageSize(n)}
            className={`rounded border px-2 py-0.5 font-semibold transition-colors ${
              pageSize === n
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span>
          {rangeStart}–{rangeEnd} of {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            className="rounded border border-slate-700 px-2 py-0.5 font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30"
          >
            Prev
          </button>
          <span className="px-1">
            {page} / {pageCount}
          </span>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => onPage(page + 1)}
            className="rounded border border-slate-700 px-2 py-0.5 font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {children}
    </div>
  );
}
