import { User, Shield } from "lucide-react";
import React from "react";

export default function AuthControls({ users, currentUserId, onSwitch }) {
  const current = users.find((u) => u.id === currentUserId);
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-white/60 backdrop-blur p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white">
          <User size={18} />
        </div>
        <div>
          <div className="text-sm text-slate-500">Signed in as</div>
          <div className="font-medium text-slate-800">{current?.name}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Shield size={14} /> {current?.role}
        </span>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={currentUserId}
          onChange={(e) => onSwitch(e.target.value)}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
