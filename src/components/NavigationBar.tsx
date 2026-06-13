import { useState } from "react";
import { Link } from "@tanstack/react-router";

const navItems = [
  { label: "My Portfolio", to: "/" as const },
  { label: "e-KYC Setup", to: "/kyc" as const },
];

export default function NavigationBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="w-full bg-[#0B192C] text-white font-sans border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-extrabold text-[#0B192C]">
              T
            </div>
            <span className="text-lg font-bold tracking-tight">TreasuryHub</span>
          </div>

          {/* Primary navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 data-[status=active]:bg-emerald-500 data-[status=active]:text-[#0B192C]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-md p-2 text-slate-200 hover:bg-slate-800 transition-colors"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </button>
            <button
              onClick={() => setLoginOpen((v) => !v)}
              className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0B192C] hover:bg-emerald-400 transition-colors"
            >
              Login
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden items-center gap-2 pb-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="flex-1 text-center rounded-md px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 data-[status=active]:bg-emerald-500 data-[status=active]:text-[#0B192C]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-slate-800 bg-[#0B192C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <input
              autoFocus
              type="text"
              placeholder="Search accounts, transactions, reports..."
              className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500 focus:ring-2"
            />
          </div>
        </div>
      )}

      {/* Login modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl bg-[#0B192C] border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Sign in</h2>
              <button onClick={() => setLoginOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close">
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500 focus:ring-2"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500 focus:ring-2"
              />
              <button className="w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0B192C] hover:bg-emerald-400 transition-colors">
                Sign in
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 text-xs font-bold py-2 rounded border border-orange-500/30">
                Metamask
              </button>
              <button className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold py-2 rounded border border-blue-500/30">
                Wallet Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
