import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const path = request.nextUrl.pathname;
  const isPublicRoute = ["", "login"].includes(path.slice(1));

  // Se não está autenticado
  if (!token) {
    // Se tentar acessar qualquer rota que não seja pública
    if (!isPublicRoute) {
      console.log("Usuário não autenticado tentando acessar rota protegida");
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Se está autenticado
  try {
    // Decodificar o token para obter o role
    const [, payload] = token.value.split(".");
    const decodedPayload = JSON.parse(atob(payload));
    const userRole = decodedPayload.role;

    // Se estiver em rota pública, redireciona para o dashboard apropriado
    if (isPublicRoute) {
      const dashboardPath =
        userRole === "STUDENT" ? "/aluno/dashboard" : "/professor/dashboard";
      console.log(`Redirecionando usuário autenticado para ${dashboardPath}`);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Verifica se está tentando acessar a área correta
    const isInCorrectArea =
      (userRole === "STUDENT" && path.startsWith("/aluno")) ||
      (userRole === "TEACHER" && path.startsWith("/professor"));

    if (!isInCorrectArea) {
      const correctPath =
        userRole === "STUDENT" ? "/aluno/dashboard" : "/professor/dashboard";
      console.log(`Redirecionando para área correta: ${correctPath}`);
      return NextResponse.redirect(new URL(correctPath, request.url));
    }
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/(api/auth)/:path*",
  ],
};
