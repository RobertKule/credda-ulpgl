import React from "react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
