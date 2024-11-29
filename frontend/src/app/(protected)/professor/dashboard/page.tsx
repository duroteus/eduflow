"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { ProfessorSubmissionsList } from "@/components/professor-submissions-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function ProfessorDashboard() {
  const { user } = useAuth();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, Professor {user?.name}
          </p>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="submissions">Submissões</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trabalhos Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfessorSubmissionsList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total de Submissões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 desde a última semana
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Média de Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85.5</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2 desde o último mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pendentes de Avaliação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    4 avaliados esta semana
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
