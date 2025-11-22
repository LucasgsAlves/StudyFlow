import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { BookOpen, Calendar, BarChart3, Target, LogOut, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("studyflow_current_user");
    if (!storedUser) {
      toast.error("Você precisa fazer login primeiro");
      setLocation("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("studyflow_current_user");
    toast.success("Logout realizado com sucesso!");
    setLocation("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <header className="border-b bg-background/80 sticky top-0 z-50 flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">StudyFlow</h1>
        <div className="flex items-center gap-4">
          <User />
          <span>{user.nomeCompleto}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <main className="p-4">
        <h2 className="text-2xl font-bold">Bem-vindo, {user.nomeCompleto.split(" ")[0]}!</h2>
        <p>Este é o seu dashboard.</p>

        {/* Cards resumidos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardHeader><CardTitle>Disciplinas</CardTitle></CardHeader>
            <CardContent>
              {user.disciplinas?.length || 0} cadastradas
              <BookOpen />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Horas de Estudo</CardTitle></CardHeader>
            <CardContent>
              {user.horasEstudo || 0}h
              <Calendar />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Conteúdos</CardTitle></CardHeader>
            <CardContent>
              {user.conteudos?.length || 0}
              <Target />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Progresso</CardTitle></CardHeader>
            <CardContent>
              {user.progresso || 0}%
              <BarChart3 />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
