"use client";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
