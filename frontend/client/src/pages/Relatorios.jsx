import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { BarChart3, ArrowLeft, TrendingUp, Clock, CheckCircle, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function Relatorios() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [periodoSelecionado, setPeriodoSelecionado] = useState("Mensal");
  const [metricas, setMetricas] = useState({
    progressoGeral: 0,
    totalHorasEstudadas: 0,
    conteudosConcluidos: 0,
    totalConteudos: 0,
    taxaMediaConclusao: 0,
    disciplinas: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("studyflow_current_user");
    if (!storedUser) {
      toast.error("Você precisa fazer login primeiro");
      setLocation("/login");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    carregarMetricas(userData.id);
  }, [setLocation]);

  const carregarMetricas = async (usuarioId) => {
    setLoading(true);
    try {
      // Carregar disciplinas do usuário
      const disciplinasRes = await axios.get(
        `http://localhost:8080/api/disciplinas?usuarioId=${usuarioId}`
      );
      const disciplinas = disciplinasRes.data;

      let totalConteudos = 0;
      let conteudosConcluidos = 0;
      let totalHorasEstudadas = 0;
      const disciplinasComMetricas = [];

      // Para cada disciplina, carregar conteúdos e estudos
      for (const disciplina of disciplinas) {
        const conteudosRes = await axios.get(
          `http://localhost:8080/api/conteudos?disciplinaId=${disciplina.id}`
        );
        const conteudos = conteudosRes.data;
        totalConteudos += conteudos.length;

        let horasDisciplina = 0;
        let conteudosConcluidosDisciplina = 0;

        for (const conteudo of conteudos) {
          // Carregar estudos de cada conteúdo
          const estudosRes = await axios.get(
            `http://localhost:8080/api/estudos?conteudoId=${conteudo.id}`
          );
          const estudos = estudosRes.data;

          // Calcular horas estudadas
          const minutosEstudados = estudos.reduce(
            (total, estudo) => total + estudo.minutosEstudados,
            0
          );
          const horas = minutosEstudados / 60;
          horasDisciplina += horas;
          totalHorasEstudadas += horas;

          // Verificar se conteúdo foi concluído
          const concluido = estudos.some((estudo) => estudo.concluido);
          if (concluido) {
            conteudosConcluidos++;
            conteudosConcluidosDisciplina++;
          }
        }

        // Calcular taxa de conclusão da disciplina
        const taxaConclusao =
          conteudos.length > 0
            ? (conteudosConcluidosDisciplina / conteudos.length) * 100
            : 0;

        // Calcular progresso em relação à meta de horas
        const progressoMeta =
          disciplina.metaHoras && disciplina.metaHoras > 0
            ? Math.min((horasDisciplina / disciplina.metaHoras) * 100, 100)
            : 0;

        disciplinasComMetricas.push({
          ...disciplina,
          totalConteudos: conteudos.length,
          conteudosConcluidos: conteudosConcluidosDisciplina,
          horasEstudadas: horasDisciplina,
          taxaConclusao: taxaConclusao,
          progressoMeta: progressoMeta,
        });
      }

      // Calcular progresso geral
      const progressoGeral =
        totalConteudos > 0 ? (conteudosConcluidos / totalConteudos) * 100 : 0;

      // Calcular taxa média de conclusão
      const taxaMediaConclusao =
        disciplinasComMetricas.length > 0
          ? disciplinasComMetricas.reduce(
              (total, d) => total + d.taxaConclusao,
              0
            ) / disciplinasComMetricas.length
          : 0;

      setMetricas({
        progressoGeral: Math.round(progressoGeral),
        totalHorasEstudadas: totalHorasEstudadas.toFixed(2),
        conteudosConcluidos,
        totalConteudos,
        taxaMediaConclusao: taxaMediaConclusao.toFixed(2),
        disciplinas: disciplinasComMetricas,
      });
    } catch (error) {
      toast.error("Erro ao carregar métricas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar disciplinas por período (simulado - em produção, filtrar por datas reais)
  const disciplinasFiltradas = metricas.disciplinas;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <header className="border-b bg-background/80 sticky top-0 z-50 flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Relatórios</h1>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Seus Relatórios de Desempenho</h2>
            <p className="text-muted-foreground">
              Acompanhe seu progresso e estatísticas de estudo
            </p>
          </div>
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semanal">Semanal</SelectItem>
              <SelectItem value="Mensal">Mensal</SelectItem>
              <SelectItem value="Anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resumo Geral */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold">{metricas.progressoGeral}%</p>
              <Progress value={metricas.progressoGeral} className="h-2" />
              <p className="text-muted-foreground text-xs">
                {metricas.conteudosConcluidos} de {metricas.totalConteudos} conteúdos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Total de Horas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metricas.totalHorasEstudadas}h</p>
              <p className="text-muted-foreground">horas estudadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Conteúdos Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metricas.conteudosConcluidos}</p>
              <p className="text-muted-foreground">total de conteúdos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Taxa Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metricas.taxaMediaConclusao}%</p>
              <p className="text-muted-foreground">taxa de conclusão</p>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios por Disciplina */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-4">Relatórios por Disciplina - {periodoSelecionado}</h3>
        </div>

        {loading ? (
          <div className="text-center py-8">Carregando relatórios...</div>
        ) : disciplinasFiltradas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhuma disciplina cadastrada. Crie disciplinas e conteúdos para visualizar relatórios.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {disciplinasFiltradas.map((disciplina) => (
              <Card key={disciplina.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        {disciplina.nome}
                      </CardTitle>
                      <CardDescription>
                        {disciplina.descricao || "Sem descrição"}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {disciplina.taxaConclusao.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Horas Estudadas</p>
                      <p className="text-xl font-semibold">
                        {disciplina.horasEstudadas.toFixed(2)}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conteúdos Concluídos</p>
                      <p className="text-xl font-semibold">
                        {disciplina.conteudosConcluidos} / {disciplina.totalConteudos}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Meta de Horas</p>
                      <p className="text-xl font-semibold">
                        {disciplina.metaHoras ? `${disciplina.metaHoras}h` : "Não definida"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progresso da Meta</p>
                      <div className="space-y-1">
                        <p className="text-xl font-semibold">
                          {disciplina.progressoMeta.toFixed(1)}%
                        </p>
                        <Progress value={disciplina.progressoMeta} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
