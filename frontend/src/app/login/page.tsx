"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import eduflowLogo from "../../../public/eduflow.png";

// type UserRole = "student" | "teacher" | "admin";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
// }

export default function LoginPage() {
  const { login, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user && window.location.pathname !== "/login") {
      console.log("Usuário já logado:", user);
      window.location.href =
        user.role === "STUDENT" ? "/aluno/dashboard" : "/professor/dashboard";
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      try {
        console.log("Iniciando login...");
        const response = await fetch("http://localhost:3000/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "E-mail ou senha incorretos");
        }

        const data = await response.json();
        console.log("Login response:", data);

        if (!data.user || !data.token) {
          throw new Error("Resposta inválida do servidor");
        }

        login(data.token, data.user);
        toast.success("Login realizado com sucesso!");

        setTimeout(() => {
          window.location.href =
            data.user.role === "STUDENT"
              ? "/aluno/dashboard"
              : "/professor/dashboard";
        }, 100);
      } catch (error) {
        console.error("Login error:", error);
        toast.error(
          error instanceof Error ? error.message : "Erro ao fazer login"
        );
      }
    } else {
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "STUDENT", // Por padrão, novos usuários são estudantes
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Erro ao criar conta");
        }

        toast.success("Conta criada com sucesso!");
        setIsLogin(true);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao criar conta"
        );
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md relative">
          <Link
            href="/"
            className="absolute left-4 top-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <Image
                  src={eduflowLogo}
                  alt="EduFlow Logo"
                  width={64}
                  height={64}
                  className=""
                />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                {isLogin ? "Bem-vindo ao EduFlow" : "Criar conta no EduFlow"}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin
                  ? "Entre para acessar sua conta e gerenciar seus trabalhos acadêmicos"
                  : "Cadastre-se para começar a gerenciar seus trabalhos acadêmicos"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seunome@exemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Confirmar senha
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                {isLogin ? "Entrar" : "Criar conta"}
              </Button>
              {isLogin ? (
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-center text-blue-600 hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              ) : null}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-center text-blue-600 hover:underline"
              >
                {isLogin
                  ? "Não tem uma conta? Cadastre-se"
                  : "Já tem uma conta? Entre"}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
