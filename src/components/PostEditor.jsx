import React, { useMemo, useState } from "react";
import { Pencil, Save, X } from "lucide-react";

export default function PostEditor({ user, onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canCreate = useMemo(() => {
    return user?.role === "admin" || user?.role === "editor";
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canCreate) return;
    if (!title.trim()) return;
    onCreate({ title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
  };

  return (
    <div className="rounded-xl border bg-white/60 backdrop-blur p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-slate-700">
        <Pencil size={18} />
        <h3 className="font-semibold">New Post</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!canCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm disabled:opacity-50"
          >
            <Save size={16} /> Publish
          </button>
          {!canCreate && (
            <div className="text-xs text-slate-500 inline-flex items-center gap-1">
              <X size={14} /> You need Editor or Admin role
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
