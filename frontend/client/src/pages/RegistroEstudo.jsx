import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { Calendar, Plus, Trash2, Edit2, ArrowLeft, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegistroEstudo() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/registro-estudo/:conteudoId");
  const [user, setUser] = useState(null);
  const [conteudo, setConteudo] = useState(null);
  const [estudos, setEstudos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split("T")[0],
    minutosEstudados: "",
    concluido: false,
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

    if (params?.conteudoId) {
      carregarConteudo(params.conteudoId);
      carregarEstudos(params.conteudoId);
    }
  }, [params?.conteudoId, setLocation]);

  const carregarConteudo = async (conteudoId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/conteudos/${conteudoId}`
      );
      setConteudo(response.data);
    } catch (error) {
      toast.error("Erro ao carregar conteúdo");
      console.error(error);
    }
  };

  const carregarEstudos = async (conteudoId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/estudos?conteudoId=${conteudoId}`
      );
      setEstudos(response.data);
    } catch (error) {
      toast.error("Erro ao carregar registros de estudo");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.minutosEstudados || formData.minutosEstudados <= 0) {
      toast.error("O tempo estudado deve ser maior que zero");
      return;
    }

    try {
      if (editingId) {
        // Atualizar estudo existente
        await axios.put(
          `http://localhost:8080/api/estudos/${editingId}`,
          {
            data: formData.data,
            minutosEstudados: parseInt(formData.minutosEstudados),
            concluido: formData.concluido,
          }
        );
        toast.success("Registro de estudo atualizado com sucesso!");
        setEditingId(null);
      } else {
        // Criar novo registro de estudo
        await axios.post(
          `http://localhost:8080/api/estudos?conteudoId=${params.conteudoId}`,
          {
            data: formData.data,
            minutosEstudados: parseInt(formData.minutosEstudados),
            concluido: formData.concluido,
          }
        );
        toast.success("Registro de estudo criado com sucesso!");
      }

      // Limpar formulário e recarregar estudos
      setFormData({
        data: new Date().toISOString().split("T")[0],
        minutosEstudados: "",
        concluido: false,
      });
      setOpenDialog(false);
      await carregarEstudos(params.conteudoId);
      await atualizarHorasConteudo(params.conteudoId);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao salvar registro de estudo"
      );
      console.error(error);
    }
  };

  const handleEdit = (estudo) => {
    setFormData({
      data: estudo.data,
      minutosEstudados: estudo.minutosEstudados.toString(),
      concluido: estudo.concluido || false,
    });
    setEditingId(estudo.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este registro?")) {
      try {
        await axios.delete(`http://localhost:8080/api/estudos/${id}`);
        toast.success("Registro deletado com sucesso!");
        await carregarEstudos(params.conteudoId);
        await atualizarHorasConteudo(params.conteudoId);
      } catch (error) {
        toast.error("Erro ao deletar registro");
        console.error(error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      data: new Date().toISOString().split("T")[0],
      minutosEstudados: "",
      concluido: false,
    });
    setEditingId(null);
  };

  const atualizarHorasConteudo = async (conteudoId) => {
    try {
      // Recarregar estudos para calcular total
      const response = await axios.get(
        `http://localhost:8080/api/estudos?conteudoId=${conteudoId}`
      );
      const estudosAtualizados = response.data;
      const totalMinutos = estudosAtualizados.reduce((total, estudo) => total + estudo.minutosEstudados, 0);
      const horasEstudadas = totalMinutos / 60;

      // Atualizar o conteúdo com as horas estudadas
      await axios.patch(
        `http://localhost:8080/api/conteudos/${conteudoId}`,
        { horasEstudadas }
      );

      // Recarregar conteúdo
      await carregarConteudo(conteudoId);
    } catch (error) {
      console.error("Erro ao atualizar horas do conteúdo:", error);
    }
  };

  const totalMinutosEstudados = estudos.reduce((total, estudo) => total + estudo.minutosEstudados, 0);
  const totalConcluidos = estudos.filter((estudo) => estudo.concluido).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <header className="border-b bg-background/80 sticky top-0 z-50 flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/conteudos/" + params.conteudoId)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Registro de Estudo</h1>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">
              {conteudo?.titulo || "Carregando..."}
            </h2>
            <p className="text-muted-foreground">
              Registre suas sessões de estudo para este conteúdo
            </p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => handleCloseDialog()}>
                <Plus className="h-4 w-4 mr-2" /> Novo Registro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Registro" : "Novo Registro de Estudo"}
                </DialogTitle>
                <DialogDescription>
                  Registre uma sessão de estudo
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) =>
                      setFormData({ ...formData, data: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minutosEstudados">Tempo Estudado (minutos)</Label>
                  <Input
                    id="minutosEstudados"
                    type="number"
                    placeholder="Ex: 60"
                    value={formData.minutosEstudados}
                    onChange={(e) =>
                      setFormData({ ...formData, minutosEstudados: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="concluido"
                    checked={formData.concluido}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, concluido: checked })
                    }
                  />
                  <Label htmlFor="concluido">Conteúdo concluído?</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Atualizar" : "Criar"} Registro
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resumo */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total de Minutos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalMinutosEstudados}</p>
              <p className="text-muted-foreground">minutos estudados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sessões Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalConcluidos}</p>
              <p className="text-muted-foreground">de {estudos.length} registros</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-8">Carregando registros...</div>
        ) : estudos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum registro de estudo. Crie um novo para começar!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {estudos.map((estudo) => (
              <Card key={estudo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        {new Date(estudo.data).toLocaleDateString("pt-BR")}
                      </CardTitle>
                      <CardDescription>
                        {estudo.minutosEstudados} minutos de estudo
                      </CardDescription>
                    </div>
                    {estudo.concluido && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(estudo)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(estudo.id)}
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
