import React from "react";
import { ShieldCheck, FileText, Users } from "lucide-react";

export function AdminDashboard({ users, posts }) {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold text-slate-800 mb-2 inline-flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" size={18} /> Admin overview
        </h2>
        <p className="text-sm text-slate-600">Full control over users and content.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Users" value={users.length} />
        <StatCard icon={FileText} label="Posts" value={posts.length} />
        <StatCard icon={ShieldCheck} label="Roles" value={3} />
      </div>
    </section>
  );
}

export function EditorDashboard({ posts, currentUser, onEdit, onDelete }) {
  const myPosts = posts.filter((p) => p.authorId === currentUser.id);
  return (
    <section className="space-y-4">
      <div className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold text-slate-800 mb-2">Your posts</h2>
        {myPosts.length === 0 ? (
          <p className="text-sm text-slate-500">You haven't written anything yet.</p>
        ) : (
          <ul className="space-y-3">
            {myPosts.map((p) => (
              <li key={p.id} className="rounded-lg border bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-800">{p.title}</div>
                    <div className="text-sm text-slate-600 whitespace-pre-wrap">{p.content}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(p)} className="text-xs rounded-lg border px-2 py-1">Edit</button>
                    <button onClick={() => onDelete(p)} className="text-xs rounded-lg border border-rose-200 text-rose-600 px-2 py-1">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function ViewerDashboard({ posts }) {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold text-slate-800 mb-2">Latest posts</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-slate-500">No posts yet.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="rounded-lg border bg-white p-3">
                <div className="font-medium text-slate-800">{p.title}</div>
                <div className="text-sm text-slate-600 whitespace-pre-wrap">{p.content}</div>
                <div className="text-xs text-slate-400 mt-1">by {p.authorName}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <Icon className="text-indigo-600" size={18} />
        <div className="text-xl font-semibold text-slate-800">{value}</div>
      </div>
    </div>
  );
}
