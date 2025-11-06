import React from "react";

export default function Layout({ children }) {
  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6 space-y-4">
      {children}
    </main>
  );
}
