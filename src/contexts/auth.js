import { createContext, useMemo, useState, useCallback } from 'react';

// Lightweight ID generator to avoid extra dependencies
function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

// Permission matrix per role
const ROLE_PERMISSIONS = {
  admin: {
    posts: { create: true, read: true, update: true, delete: true },
    users: { manage: true },
  },
  editor: {
    posts: { create: true, read: true, update: 'own', delete: 'own' },
    users: { manage: false },
  },
  viewer: {
    posts: { create: false, read: true, update: false, delete: false },
    users: { manage: false },
  },
};

function seedUsers() {
  const admin = { id: 'u_admin', name: 'Alice Admin', role: 'admin' };
  const editor = { id: 'u_editor', name: 'Eddie Editor', role: 'editor' };
  const viewer = { id: 'u_viewer', name: 'Violet Viewer', role: 'viewer' };
  return [admin, editor, viewer];
}

function seedPosts(users) {
  const byId = Object.fromEntries(users.map((u) => [u.role, u.id]));
  return [
    { id: uid('p'), title: 'Welcome to the RBAC Demo', body: 'Everyone can read this post.', authorId: byId.admin, authorName: 'Alice Admin', createdAt: new Date().toISOString() },
    { id: uid('p'), title: "Editor's Corner", body: 'Editable by the author (Editor) and Admins.', authorId: byId.editor, authorName: 'Eddie Editor', createdAt: new Date().toISOString() },
    { id: uid('p'), title: 'Public Notice', body: 'Viewable by all roles.', authorId: byId.viewer, authorName: 'Violet Viewer', createdAt: new Date().toISOString() },
  ];
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const initialUsers = seedUsers();
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(initialUsers[0]);
  const [posts, setPosts] = useState(seedPosts(initialUsers));
  const [audit, setAudit] = useState([]);

  const can = useCallback((actor, resource, action, resourceOwnerId) => {
    const role = actor?.role ?? 'viewer';
    const perms = ROLE_PERMISSIONS[role]?.[resource];
    if (!perms) return false;
    const rule = perms[action];
    if (rule === true) return true;
    if (rule === 'own') return actor?.id && resourceOwnerId && actor.id === resourceOwnerId;
    return false;
  }, []);

  const addAudit = useCallback((entry) => {
    setAudit((prev) => [
      { id: uid('a'), at: new Date().toISOString(), actorId: user.id, actorName: user.name, ...entry },
      ...prev,
    ]);
  }, [user]);

  const createPost = useCallback((title, body) => {
    if (!can(user, 'posts', 'create')) return false;
    const newPost = {
      id: uid('p'),
      title,
      body,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString(),
    };
    setPosts((p) => [newPost, ...p]);
    addAudit({ action: 'posts:create', target: newPost.id, note: `Created post: ${title}` });
    return true;
  }, [user, can, addAudit]);

  const updatePost = useCallback((id, updates) => {
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const target = prev[idx];
      if (!can(user, 'posts', 'update', target.authorId)) return prev;
      const next = { ...target, ...updates };
      const cloned = [...prev];
      cloned[idx] = next;
      addAudit({ action: 'posts:update', target: id, note: `Updated post title to "${updates.title ?? target.title}"` });
      return cloned;
    });
  }, [user, can, addAudit]);

  const deletePost = useCallback((id) => {
    setPosts((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) return prev;
      if (!can(user, 'posts', 'delete', target.authorId)) return prev;
      addAudit({ action: 'posts:delete', target: id, note: `Deleted post: ${target.title}` });
      return prev.filter((p) => p.id !== id);
    });
  }, [user, can, addAudit]);

  const assignRole = useCallback((targetUserId, role) => {
    setUsers((prev) => prev.map((u) => (u.id === targetUserId ? { ...u, role } : u)));
    addAudit({ action: 'users:assignRole', target: targetUserId, note: `Assigned role ${role}` });
  }, [addAudit]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      users,
      setUsers,
      posts,
      setPosts,
      audit,
      can,
      createPost,
      updatePost,
      deletePost,
      assignRole,
      ROLE_PERMISSIONS,
    }),
    [user, users, posts, audit, can, createPost, updatePost, deletePost, assignRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
