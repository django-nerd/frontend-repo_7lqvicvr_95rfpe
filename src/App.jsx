import React, { useMemo, useState } from "react";
import AuthControls from "./components/AuthControls";
import PostEditor from "./components/PostEditor";
import PostList from "./components/PostList";
import AdminPanel from "./components/AdminPanel";
import { Rocket } from "lucide-react";

const seedUsers = [
  { id: "u1", name: "Alice Admin", role: "admin" },
  { id: "u2", name: "Eddie Editor", role: "editor" },
  { id: "u3", name: "Violet Viewer", role: "viewer" },
];

const seedPosts = [
  { id: "p1", title: "Welcome", content: "This is the RBAC demo.", authorId: "u1", authorName: "Alice Admin" },
  { id: "p2", title: "Editor Note", content: "Editors can manage their own posts.", authorId: "u2", authorName: "Eddie Editor" },
];

export default function App() {
  const [users, setUsers] = useState(seedUsers);
  const [currentUserId, setCurrentUserId] = useState(seedUsers[0].id);
  const [posts, setPosts] = useState(seedPosts);

  const currentUser = useMemo(() => users.find((u) => u.id === currentUserId), [users, currentUserId]);

  const createPost = ({ title, content }) => {
    const id = `p${Date.now()}`;
    setPosts((prev) => [
      { id, title, content, authorId: currentUser.id, authorName: currentUser.name },
      ...prev,
    ]);
  };

  const updatePost = (post) => {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
  };

  const deletePost = (post) => {
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 font-semibold">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 grid place-items-center text-white">
              <Rocket size={18} />
            </div>
            RBAC Demo
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 md:p-6 space-y-4">
        <AuthControls users={users} currentUserId={currentUserId} onSwitch={setCurrentUserId} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <PostEditor user={currentUser} onCreate={createPost} />
            <PostList
              posts={posts}
              user={currentUser}
              onEdit={(p) => {
                const title = prompt("Edit title", p.title) ?? p.title;
                const content = prompt("Edit content", p.content) ?? p.content;
                updatePost({ ...p, title, content });
              }}
              onDelete={deletePost}
            />
          </div>
          <div className="space-y-4">
            <AdminPanel
              users={users}
              currentUser={currentUser}
              onAssign={(id, role) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))}
            />
          </div>
        </div>
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
        Built with React, Tailwind, and lucide-react.
      </footer>
    </div>
  );
}
