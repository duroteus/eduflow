"use client";

import { TopNav } from "@/components/top-nav";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Usuário não autenticado, redirecionando...");
      router.push("/login");
    } else {
      console.log("Usuário autenticado:", user);
    }
  }, [isAuthenticated, user, router]);

  // Pode adicionar um loading state enquanto verifica
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <p className="flex-1 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
