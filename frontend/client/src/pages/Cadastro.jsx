import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import axios from "axios";

export default function Cadastro() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    endereco: "",
    telefone: "",
    escolaridade: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações básicas
    if (
      !formData.nomeCompleto ||
      !formData.email ||
      !formData.senha ||
      !formData.confirmarSenha ||
      !formData.endereco ||
      !formData.telefone ||
      !formData.escolaridade
    ) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    // Chamada para o backend
    try {
      const response = await axios.post("http://localhost:8080/api/auth/cadastrar", {
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        senha: formData.senha,
        endereco: formData.endereco,
        telefone: formData.telefone,
        escolaridade: formData.escolaridade,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Cadastro realizado com sucesso!");
        setTimeout(() => setLocation("/login"), 1000);
      } else {
        toast.error("Erro ao cadastrar usuário");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao cadastrar usuário");
      }
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-2xl border-2">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">StudyFlow</h1>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Criar sua conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os dados abaixo para começar a organizar seus estudos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">Nome Completo</Label>
              <Input
                id="nomeCompleto"
                type="text"
                placeholder="João Silva"
                value={formData.nomeCompleto}
                onChange={(e) =>
                  setFormData({ ...formData, nomeCompleto: e.target.value })
                }
                required
              />
            </div>

            {/* Email e Telefone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                type="text"
                placeholder="Rua, Número, Bairro, Cidade - UF"
                value={formData.endereco}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: e.target.value })
                }
                required
              />
            </div>

            {/* Escolaridade */}
            <div className="space-y-2">
              <Label htmlFor="escolaridade">Escolaridade</Label>
              <Select
                value={formData.escolaridade}
                onValueChange={(value) =>
                  setFormData({ ...formData, escolaridade: value })
                }
                required
              >
                <SelectTrigger id="escolaridade">
                  <SelectValue placeholder="Selecione sua escolaridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensino-fundamental">Ensino Fundamental</SelectItem>
                  <SelectItem value="ensino-medio">Ensino Médio</SelectItem>
                  <SelectItem value="ensino-superior">Ensino Superior</SelectItem>
                  <SelectItem value="pos-graduacao">Pós-Graduação</SelectItem>
                  <SelectItem value="mestrado">Mestrado</SelectItem>
                  <SelectItem value="doutorado">Doutorado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Senha */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={(e) =>
                      setFormData({ ...formData, senha: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmarSenha: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <button
              onClick={() => setLocation("/login")}
              className="text-primary hover:underline font-medium"
            >
              Faça login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
