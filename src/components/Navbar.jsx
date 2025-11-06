import React from "react";
import { Rocket, LogOut, Home } from "lucide-react";

export default function Navbar({ currentUser, onNavigate, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onNavigate("dashboard")}
          className="inline-flex items-center gap-2 font-semibold text-slate-800"
        >
          <span className="h-9 w-9 rounded-lg bg-indigo-600 grid place-items-center text-white">
            <Rocket size={18} />
          </span>
          RBAC Portal
        </button>
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1">
                <Home size={14} /> {currentUser.role} dashboard
              </span>
              <span className="font-medium text-slate-800">{currentUser.name}</span>
            </div>
          )}
          {currentUser ? (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
