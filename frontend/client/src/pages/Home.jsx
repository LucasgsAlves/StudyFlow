import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, BarChart3, Target } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">StudyFlow</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setLocation("/login")}>
              Login
            </Button>
            <Button onClick={() => setLocation("/cadastro")}>
              Cadastrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Organize seus estudos de forma{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              inteligente
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            O StudyFlow é um gerenciador inteligente que ajuda você a planejar, acompanhar e otimizar sua rotina de estudos com relatórios e gráficos de desempenho.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => setLocation("/cadastro")} className="text-lg px-8">
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/login")} className="text-lg px-8">
              Fazer Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
          Recursos Principais
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Cadastro de Disciplinas</CardTitle>
              <CardDescription>
                Organize todas as suas matérias e conteúdos em um só lugar
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-secondary transition-colors">
            <CardHeader>
              <Calendar className="h-12 w-12 text-secondary mb-2" />
              <CardTitle>Planejamento Automático</CardTitle>
              <CardDescription>
                Gere cronogramas baseados nas suas horas disponíveis e prioridades
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent transition-colors">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-accent mb-2" />
              <CardTitle>Relatórios Detalhados</CardTitle>
              <CardDescription>
                Acompanhe seu progresso com gráficos semanais, mensais e anuais
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Definição de Metas</CardTitle>
              <CardDescription>
                Estabeleça prioridades e acompanhe o cumprimento dos seus objetivos
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <Card className="bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground border-0">
          <CardContent className="p-12 text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold">
              Pronto para transformar seus estudos?
            </h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Junte-se a milhares de estudantes que já estão otimizando seu tempo e melhorando seu desempenho acadêmico.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => setLocation("/cadastro")}
              className="mt-4 text-lg px-8"
            >
              Criar Conta Grátis
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 StudyFlow - Gerenciador Inteligente de Estudos</p>
        </div>
      </footer>
    </div>
  );
}
