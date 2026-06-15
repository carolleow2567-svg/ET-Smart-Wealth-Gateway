import type { DatasetPreview } from "../lib/api/staging";
import { formatCurrency } from "../lib/api/staging";

interface DatasetPreviewProps {
  preview: DatasetPreview;
}

export default function DatasetPreview({ preview }: DatasetPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total Revenue</p>
          <p className="mt-1 text-sm font-bold text-white">{formatCurrency(preview.revenue)}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Net Profit</p>
          <p className="mt-1 text-sm font-bold text-white">{formatCurrency(preview.netProfit)}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">EPS</p>
          <p className="mt-1 text-sm font-bold text-white">RM {preview.eps.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">PAT</p>
          <p className="mt-1 text-sm font-bold text-white">{formatCurrency(preview.pat)}</p>
        </div>
      </div>

      {/* Company Info & Period */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="rounded-md bg-slate-800/60 px-3 py-2">
          <span className="text-slate-500">Companies: </span>
          <span className="font-semibold text-slate-200">{preview.companies.toLocaleString()}</span>
        </div>
        <div className="rounded-md bg-slate-800/60 px-3 py-2">
          <span className="text-slate-500">Financial Year: </span>
          <span className="font-semibold text-slate-200">{preview.financialYear}</span>
        </div>
        <div className="rounded-md bg-slate-800/60 px-3 py-2">
          <span className="text-slate-500">Quarter: </span>
          <span className="font-semibold text-slate-200">{preview.quarter}</span>
        </div>
      </div>

      {/* Revenue by Quarter */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Revenue by Quarter</h4>
        <div className="overflow-hidden rounded-lg border border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-left text-xs uppercase text-slate-500">
                <th className="px-3 py-2 font-semibold">Quarter</th>
                <th className="px-3 py-2 font-semibold">Revenue (RM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {preview.revenueByQuarter.map((q) => (
                <tr key={q.quarter} className="text-slate-200">
                  <td className="px-3 py-2">{q.quarter}</td>
                  <td className="px-3 py-2 font-mono text-xs">{formatCurrency(q.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Trend Bar Chart */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Revenue Trend (Monthly)</h4>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-3">
          <div className="flex items-end gap-2" style={{ minHeight: 80 }}>
            {preview.charts.revenueTrend.map((item) => {
              const maxVal = Math.max(...preview.charts.revenueTrend.map((r) => r.value));
              const height = Math.max(8, (item.value / maxVal) * 100);
              return (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}K` : item.value}
                  </span>
                  <div
                    className="w-full rounded-t bg-emerald-500/70"
                    style={{ height: `${height}%`, minHeight: 6 }}
                  />
                  <span className="text-[10px] text-slate-500">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profit Margin by Sector */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Profit Margin by Sector</h4>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-3">
          <div className="space-y-2">
            {preview.charts.profitMargin.map((item) => (
              <div key={item.label}>
                <div className="mb-0.5 flex items-center justify-between text-xs">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-mono text-slate-400">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Holdings */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Top Holdings</h4>
        <div className="overflow-hidden rounded-lg border border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-left text-xs uppercase text-slate-500">
                <th className="px-3 py-2 font-semibold">Company</th>
                <th className="px-3 py-2 font-semibold">Weight</th>
                <th className="px-3 py-2 font-semibold">Market Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {preview.topHoldings.map((h) => (
                <tr key={h.name} className="text-slate-200">
                  <td className="px-3 py-2 font-semibold">{h.name}</td>
                  <td className="px-3 py-2 text-slate-400">{h.weight}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{h.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}