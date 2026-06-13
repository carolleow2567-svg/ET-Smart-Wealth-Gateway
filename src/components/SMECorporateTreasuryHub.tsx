const metrics = [
  { label: "Total Balance", value: "$4,820,300", sub: "+2.4% this month" },
  { label: "Available Liquidity", value: "$1,260,000", sub: "Across 4 accounts" },
  { label: "Pending Settlements", value: "$312,500", sub: "8 transactions" },
  { label: "Yield (APY)", value: "5.1%", sub: "Treasury allocation" },
];

const accounts = [
  { name: "Operating Account — USD", bank: "First National", balance: "$1,940,200" },
  { name: "Reserve Account — EUR", bank: "EuroTrust Bank", balance: "$1,180,400" },
  { name: "Payroll Account — USD", bank: "First National", balance: "$420,700" },
  { name: "Investment Account", bank: "Apex Capital", balance: "$1,279,000" },
];

export default function SMECorporateTreasuryHub() {
  return (
    <div className="min-h-screen bg-[#0B192C] text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">SME Corporate Treasury Hub</h1>
          <p className="mt-1 text-slate-400">Real-time overview of your corporate accounts and liquidity.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-sm text-slate-400">{m.label}</p>
              <p className="mt-2 text-2xl font-bold">{m.value}</p>
              <p className="mt-1 text-xs text-emerald-400">{m.sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h2 className="font-semibold">Accounts</h2>
            <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0B192C] hover:bg-emerald-400 transition-colors">
              New Transfer
            </button>
          </div>
          <ul className="divide-y divide-slate-800">
            {accounts.map((a) => (
              <li key={a.name} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-slate-400">{a.bank}</p>
                </div>
                <p className="font-semibold">{a.balance}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
