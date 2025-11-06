import React from "react";
import { Trash2, Edit } from "lucide-react";

export default function PostList({ posts, user, onEdit, onDelete }) {
  const canManage = (post) => {
    if (user?.role === "admin") return true;
    if (user?.role === "editor" && post.authorId === user.id) return true;
    return false;
  };

  return (
    <div className="rounded-xl border bg-white/60 backdrop-blur p-4 shadow-sm">
      <h3 className="font-semibold text-slate-700 mb-3">Posts</h3>
      {posts.length === 0 ? (
        <div className="text-sm text-slate-500">No posts yet.</div>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-800">{p.title}</div>
                  <div className="text-sm text-slate-600 whitespace-pre-wrap">{p.content}</div>
                  <div className="text-xs text-slate-400 mt-1">by {p.authorName}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    disabled={!canManage(p)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs disabled:opacity-40"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    disabled={!canManage(p)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 text-rose-600 px-2 py-1 text-xs disabled:opacity-40"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
