import React from "react";
import { ShieldCheck } from "lucide-react";

export default function AdminPanel({ users, currentUser, onAssign }) {
  if (currentUser?.role !== "admin") return null;

  return (
    <div className="rounded-xl border bg-white/60 backdrop-blur p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-slate-700">
        <ShieldCheck size={18} />
        <h3 className="font-semibold">Admin Panel</h3>
      </div>
      <div className="text-sm text-slate-600 mb-2">Assign roles</div>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
            <div>
              <div className="font-medium text-slate-800">{u.name}</div>
              <div className="text-xs text-slate-500">Current: {u.role}</div>
            </div>
            <select
              value={u.role}
              onChange={(e) => onAssign(u.id, e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="admin">admin</option>
              <option value="editor">editor</option>
              <option value="viewer">viewer</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
