import React, { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import { LoginForm, RegisterForm } from "./components/AuthForms";
import { AdminDashboard, EditorDashboard, ViewerDashboard } from "./components/Dashboards";

// Seed users and posts (client-side simulation)
const seedUsers = [
  { id: "u1", name: "Alice Admin", role: "admin", email: "alice@demo.dev", password: "password" },
  { id: "u2", name: "Eddie Editor", role: "editor", email: "eddie@demo.dev", password: "password" },
  { id: "u3", name: "Violet Viewer", role: "viewer", email: "violet@demo.dev", password: "password" },
];

const seedPosts = [
  { id: "p1", title: "Welcome", content: "This is the RBAC demo.", authorId: "u1", authorName: "Alice Admin" },
  { id: "p2", title: "Editor Note", content: "Editors can manage their own posts.", authorId: "u2", authorName: "Eddie Editor" },
];

export default function App() {
  // Global app state
  const [users, setUsers] = useState(seedUsers);
  const [posts, setPosts] = useState(seedPosts);
  const [sessionUserId, setSessionUserId] = useState(null);
  const [page, setPage] = useState("login"); // "login" | "register" | "dashboard"

  const currentUser = useMemo(
    () => users.find((u) => u.id === sessionUserId) || null,
    [users, sessionUserId]
  );

  // Auth actions (client-side only)
  const handleLogin = ({ email, password }) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setSessionUserId(found.id);
      setPage("dashboard");
    } else {
      alert("Invalid credentials. Try alice@demo.dev / password");
    }
  };

  const handleRegister = ({ name, email, password }) => {
    if (users.some((u) => u.email === email)) {
      alert("Email already registered");
      return;
    }
    const id = `u${Date.now()}`;
    const newUser = { id, name, email, password, role: "viewer" };
    setUsers((prev) => [...prev, newUser]);
    setSessionUserId(id);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setSessionUserId(null);
    setPage("login");
  };

  // Post actions used in dashboards
  const createPost = ({ title, content }) => {
    if (!currentUser) return;
    const id = `p${Date.now()}`;
    setPosts((prev) => [
      { id, title, content, authorId: currentUser.id, authorName: currentUser.name },
      ...prev,
    ]);
  };
  const updatePost = (post) => setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
  const deletePost = (post) => setPosts((prev) => prev.filter((p) => p.id !== post.id));

  // Render unauthenticated pages
  if (!currentUser && (page === "login" || page === "register")) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
        <div className="mx-auto max-w-md p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">RBAC Portal</h1>
            <p className="text-sm text-slate-600">Sign in to continue</p>
          </div>
          <div className="rounded-2xl border bg-white/70 backdrop-blur p-5 shadow-sm">
            {page === "login" ? (
              <>
                <LoginForm onLogin={handleLogin} />
                <div className="mt-3 text-sm text-slate-600 text-center">
                  Don’t have an account?{' '}
                  <button className="text-indigo-600 hover:underline" onClick={() => setPage("register")}>
                    Register
                  </button>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  Demo users:
                  <ul className="list-disc ml-5 mt-1">
                    <li>alice@demo.dev / password (admin)</li>
                    <li>eddie@demo.dev / password (editor)</li>
                    <li>violet@demo.dev / password (viewer)</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <RegisterForm onRegister={handleRegister} />
                <div className="mt-3 text-sm text-slate-600 text-center">
                  Already have an account?{' '}
                  <button className="text-indigo-600 hover:underline" onClick={() => setPage("login")}>
                    Sign in
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render authenticated dashboard pages
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <Navbar currentUser={currentUser} onNavigate={setPage} onLogout={handleLogout} />
      <Layout>
        {currentUser?.role === "admin" && (
          <AdminDashboard users={users} posts={posts} />
        )}

        {currentUser?.role === "editor" && (
          <div className="space-y-4">
            {/* Quick create form for Editors */}
            <div className="rounded-xl border bg-white p-4">
              <h2 className="font-semibold text-slate-800 mb-2">Create a post</h2>
              <EditorCreate onCreate={createPost} />
            </div>
            <EditorDashboard
              posts={posts}
              currentUser={currentUser}
              onEdit={(p) => {
                const title = prompt("Edit title", p.title) ?? p.title;
                const content = prompt("Edit content", p.content) ?? p.content;
                updatePost({ ...p, title, content });
              }}
              onDelete={deletePost}
            />
          </div>
        )}

        {currentUser?.role === "viewer" && (
          <ViewerDashboard posts={posts} />
        )}
      </Layout>
    </div>
  );
}

function EditorCreate({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onCreate({ title: title.trim(), content: content.trim() });
        setTitle("");
        setContent("");
      }}
      className="space-y-3"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="w-full rounded-lg border px-3 py-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        rows={4}
        className="w-full rounded-lg border px-3 py-2"
      />
      <button type="submit" className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm">Publish</button>
    </form>
  );
}
