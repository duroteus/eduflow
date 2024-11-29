import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import eduflowLogo from "../../public/eduflow.png";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Image
            src={eduflowLogo}
            alt="EduFlow Logo"
            width={32}
            height={32}
            className=""
          />
          <span className="ml-2 text-2xl font-bold text-primary">EduFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 items-center sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Recursos
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#how-it-works"
          >
            Como Funciona
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#testimonials"
          >
            Depoimentos
          </Link>
          <Button variant="default" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <div className="container mx-auto">
          <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Simplifique a submissão de trabalhos acadêmicos
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    EduFlow é a plataforma que facilita o processo de submissão,
                    revisão e feedback de trabalhos acadêmicos para professores
                    e alunos.
                  </p>
                </div>
                <div className="space-x-4">
                  <Button asChild>
                    <Link href="/login">Comece Agora</Link>
                  </Button>
                  <Button variant="outline">Saiba Mais</Button>
                </div>
              </div>
            </div>
          </section>
          <section
            id="features"
            className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
          >
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                Recursos Principais
              </h2>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                <Card>
                  <CardHeader>
                    <FileText className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>Submissão Simplificada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Interface intuitiva para upload de trabalhos em diversos
                      formatos.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Users className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>Colaboração em Tempo Real</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Ferramentas para revisão por pares e feedback dos
                      professores, promovendo um ambiente colaborativo.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Zap className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>Análise de Desempenho</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Dashboards e relatórios detalhados para acompanhar o
                      progresso dos alunos e a eficácia do ensino.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                Como Funciona
              </h2>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cadastre-se</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Crie sua conta como professor ou aluno em poucos minutos.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-2">Submeta Trabalhos</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Faça upload de seus trabalhos acadêmicos de forma rápida e
                    segura.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-2">Receba Feedback</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Obtenha avaliações detalhadas e sugestões de melhoria.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section
            id="testimonials"
            className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
          >
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                O que dizem nossos usuários
              </h2>
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                <Card>
                  <CardHeader>
                    <CardTitle>Prof. Maria Silva</CardTitle>
                    <CardDescription>Universidade Federal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    &quot;O EduFlow revolucionou a forma como gerencio as
                    submissões dos meus alunos. A plataforma é intuitiva e me
                    poupa horas de trabalho administrativo.&quot;
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>João Santos</CardTitle>
                    <CardDescription>Estudante de Mestrado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    &quot;Com o EduFlow, posso acompanhar facilmente o status
                    das minhas submissões e receber feedback rapidamente. Isso
                    tem melhorado significativamente meu desempenho
                    acadêmico.&quot;
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Pronto para simplificar sua vida acadêmica?
                  </h2>
                  <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Junte-se a milhares de professores e alunos que já estão
                    usando o EduFlow para otimizar o processo de submissão de
                    trabalhos acadêmicos.
                  </p>
                </div>
                <Button size="lg" asChild>
                  <Link href="/login">Comece Gratuitamente</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="container mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 EduFlow. Todos os direitos reservados.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  );
}
