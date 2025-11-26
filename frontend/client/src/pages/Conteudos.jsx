import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { Target, Plus, Trash2, Edit2, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Conteudos() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/conteudos/:disciplinaId");
  const [user, setUser] = useState(null);
  const [disciplina, setDisciplina] = useState(null);
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    prioridade: "Média",
    tempoEstimado: "",
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

    if (params?.disciplinaId) {
      carregarDisciplina(params.disciplinaId);
      carregarConteudos(params.disciplinaId);
    }
  }, [params?.disciplinaId, setLocation]);

  const carregarDisciplina = async (disciplinaId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/disciplinas/${disciplinaId}`
      );
      setDisciplina(response.data);
    } catch (error) {
      toast.error("Erro ao carregar disciplina");
      console.error(error);
    }
  };

  const carregarConteudos = async (disciplinaId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/conteudos?disciplinaId=${disciplinaId}`
      );
      setConteudos(response.data);
    } catch (error) {
      toast.error("Erro ao carregar conteúdos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      toast.error("O título do conteúdo é obrigatório");
      return;
    }

    if (!formData.tempoEstimado || formData.tempoEstimado <= 0) {
      toast.error("O tempo estimado deve ser maior que zero");
      return;
    }

    try {
      if (editingId) {
        // Atualizar conteúdo existente
        await axios.put(
          `http://localhost:8080/api/conteudos/${editingId}`,
          {
            titulo: formData.titulo,
            prioridade: formData.prioridade,
            tempoEstimado: parseInt(formData.tempoEstimado),
          }
        );
        toast.success("Conteúdo atualizado com sucesso!");
        setEditingId(null);
      } else {
        // Criar novo conteúdo
        await axios.post(
          `http://localhost:8080/api/conteudos?disciplinaId=${params.disciplinaId}`,
          {
            titulo: formData.titulo,
            prioridade: formData.prioridade,
            tempoEstimado: parseInt(formData.tempoEstimado),
          }
        );
        toast.success("Conteúdo criado com sucesso!");
      }

      // Limpar formulário e recarregar conteúdos
      setFormData({ titulo: "", prioridade: "Média", tempoEstimado: "" });
      setOpenDialog(false);
      carregarConteudos(params.disciplinaId);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao salvar conteúdo"
      );
      console.error(error);
    }
  };

  const handleEdit = (conteudo) => {
    setFormData({
      titulo: conteudo.titulo,
      prioridade: conteudo.prioridade,
      tempoEstimado: conteudo.tempoEstimado.toString(),
    });
    setEditingId(conteudo.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este conteúdo?")) {
      try {
        await axios.delete(`http://localhost:8080/api/conteudos/${id}`);
        toast.success("Conteúdo deletado com sucesso!");
        carregarConteudos(params.disciplinaId);
      } catch (error) {
        toast.error("Erro ao deletar conteúdo");
        console.error(error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ titulo: "", prioridade: "Média", tempoEstimado: "" });
    setEditingId(null);
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case "Alta":
        return "text-red-500";
      case "Média":
        return "text-yellow-500";
      case "Baixa":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <header className="border-b bg-background/80 sticky top-0 z-50 flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/disciplinas")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Conteúdos</h1>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">
              {disciplina?.nome || "Carregando..."}
            </h2>
            <p className="text-muted-foreground">
              {disciplina?.descricao || "Gerenciar conteúdos desta disciplina"}
            </p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => handleCloseDialog()}>
                <Plus className="h-4 w-4 mr-2" /> Novo Conteúdo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Conteúdo" : "Novo Conteúdo"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do conteúdo
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Conteúdo</Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Funções Trigonométricas"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={formData.prioridade}
                    onValueChange={(value) =>
                      setFormData({ ...formData, prioridade: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempoEstimado">Tempo Estimado (minutos)</Label>
                  <Input
                    id="tempoEstimado"
                    type="number"
                    placeholder="Ex: 60"
                    value={formData.tempoEstimado}
                    onChange={(e) =>
                      setFormData({ ...formData, tempoEstimado: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Atualizar" : "Criar"} Conteúdo
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Carregando conteúdos...</div>
        ) : conteudos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum conteúdo cadastrado. Crie um novo para começar!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {conteudos.map((conteudo) => (
              <Card key={conteudo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        {conteudo.titulo}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div>Tempo estimado: {conteudo.tempoEstimado} minutos</div>
                        {conteudo.horasEstudadas > 0 && (
                          <div className="flex items-center gap-1 text-primary">
                            <Clock className="h-4 w-4" />
                            {conteudo.horasEstudadas.toFixed(2)}h estudadas
                          </div>
                        )}
                        {conteudo.concluido && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Concluído
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <div className={`font-semibold ${getPriorityColor(conteudo.prioridade)}`}>
                      {conteudo.prioridade}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setLocation(`/registro-estudo/${conteudo.id}`)}
                    >
                      Registrar Estudo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(conteudo)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(conteudo.id)}
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
