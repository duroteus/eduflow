import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "TEACHER" | "STUDENT";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Usando o ID correto do professor mockado
    const mockUser = {
      id: "cm408v1xn0000kndid8g2t32r", // ID que vimos nos logs anteriores
      name: "Professor",
      email: "professor@teste.com",
      role: "TEACHER" as const,
    };
    setUser(mockUser);
  }, []);

  return { user };
}
