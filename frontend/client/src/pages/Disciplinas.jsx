import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { BookOpen, Plus, Trash2, Edit2, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function Disciplinas() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [conteudosPorDisciplina, setConteudosPorDisciplina] = useState({});
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    metaHoras: "",
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
    carregarDisciplinas(userData.id);
  }, [setLocation]);

  const carregarDisciplinas = async (usuarioId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/disciplinas?usuarioId=${usuarioId}`
      );
      setDisciplinas(response.data);
      
      // Carregar conteúdos para cada disciplina
      response.data.forEach((disciplina) => {
        carregarConteudosDisciplina(disciplina.id);
      });
    } catch (error) {
      toast.error("Erro ao carregar disciplinas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const carregarConteudosDisciplina = async (disciplinaId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/conteudos?disciplinaId=${disciplinaId}`
      );
      setConteudosPorDisciplina((prev) => ({
        ...prev,
        [disciplinaId]: response.data,
      }));
    } catch (error) {
      console.error("Erro ao carregar conteúdos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast.error("O nome da disciplina é obrigatório");
      return;
    }

    try {
      if (editingId) {
        // Atualizar disciplina existente
        await axios.put(
          `http://localhost:8080/api/disciplinas/${editingId}`,
          formData
        );
        toast.success("Disciplina atualizada com sucesso!");
        setEditingId(null);
      } else {
        // Criar nova disciplina
        await axios.post(
          `http://localhost:8080/api/disciplinas?usuarioId=${user.id}`,
          formData
        );
        toast.success("Disciplina criada com sucesso!");
      }

      // Limpar formulário e recarregar disciplinas
      setFormData({ nome: "", descricao: "" });
      setOpenDialog(false);
      carregarDisciplinas(user.id);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao salvar disciplina"
      );
      console.error(error);
    }
  };

  const handleEdit = (disciplina) => {
    setFormData({
      nome: disciplina.nome,
      descricao: disciplina.descricao,
      metaHoras: disciplina.metaHoras || "",
    });
    setEditingId(disciplina.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta disciplina?")) {
      try {
        await axios.delete(`http://localhost:8080/api/disciplinas/${id}`);
        toast.success("Disciplina deletada com sucesso!");
        carregarDisciplinas(user.id);
      } catch (error) {
        toast.error("Erro ao deletar disciplina");
        console.error(error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ nome: "", descricao: "", metaHoras: "" });
    setEditingId(null);
  };

  const getConteudosCount = (disciplinaId) => {
    return conteudosPorDisciplina[disciplinaId]?.length || 0;
  };

  const getProgressoDisciplina = (disciplinaId) => {
    const conteudos = conteudosPorDisciplina[disciplinaId] || [];
    if (conteudos.length === 0) return 0;
    
    const conteudosConcluidos = conteudos.filter((c) => c.concluido).length;
    return Math.round((conteudosConcluidos / conteudos.length) * 100);
  };

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
          <h1 className="text-2xl font-bold">Disciplinas</h1>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Suas Disciplinas</h2>
            <p className="text-muted-foreground">
              Gerenciar suas matérias de estudo
            </p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => handleCloseDialog()}>
                <Plus className="h-4 w-4 mr-2" /> Nova Disciplina
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Disciplina" : "Nova Disciplina"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados da disciplina
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Disciplina</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Matemática"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Input
                    id="descricao"
                    placeholder="Ex: Disciplina de cálculo avançado"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaHoras">Meta de Horas de Estudo (opcional)</Label>
                  <Input
                    id="metaHoras"
                    type="number"
                    min="0"
                    placeholder="Ex: 40"
                    value={formData.metaHoras}
                    onChange={(e) =>
                      setFormData({ ...formData, metaHoras: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Atualizar" : "Criar"} Disciplina
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Carregando disciplinas...</div>
        ) : disciplinas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhuma disciplina cadastrada. Crie uma nova para começar!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disciplinas.map((disciplina) => (
              <Card 
                key={disciplina.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setLocation(`/conteudos/${disciplina.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {disciplina.nome}
                  </CardTitle>
                  <CardDescription>{disciplina.descricao || "Sem descrição"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className="text-sm font-bold">{getProgressoDisciplina(disciplina.id)}%</span>
                    </div>
                    <Progress value={getProgressoDisciplina(disciplina.id)} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{getConteudosCount(disciplina.id)} conteúdo(s)</p>
                    {disciplina.metaHoras && (
                      <p className="text-primary font-medium">
                        Meta: {disciplina.metaHoras}h de estudo
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(disciplina)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(disciplina.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
