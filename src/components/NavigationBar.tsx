import { useState } from "react";
import { Link } from "@tanstack/react-router";

const navItems = [
  { label: "User Administration", to: "/" as const },
  { label: "Bursa Data Entry", to: "/bursa-data" as const },
  { label: "Staging Analytics Review", to: "/staging" as const },
  { label: "Deployment Release Control", to: "/deployment" as const },
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
              ET
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-bold tracking-tight">Smart Wealth Gateway</span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400">
                Internal Staff Console
              </span>
            </div>
          </div>

          {/* Primary navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 data-[status=active]:bg-emerald-500 data-[status=active]:text-[#0B192C]"
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
              Staff Login
            </button>
          </div>
        </div>

        {/* Mobile / tablet nav */}
        <nav className="flex lg:hidden items-center gap-1 overflow-x-auto pb-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 data-[status=active]:bg-emerald-500 data-[status=active]:text-[#0B192C]"
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
              placeholder="Search users, submissions, releases..."
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
              <h2 className="text-lg font-bold">Staff Sign in</h2>
              <button onClick={() => setLoginOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close">
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Corporate email"
                className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500 focus:ring-2"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500 focus:ring-2"
              />
              <button className="w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0B192C] hover:bg-emerald-400 transition-colors">
                Authenticate
              </button>
            </div>
            <p className="mt-4 text-center text-[11px] text-slate-500">
              Authorized personnel only · ET Smart Wealth Gateway
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
