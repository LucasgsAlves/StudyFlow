import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import AuthNavbar from "@/components/AuthNavbar";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: formData.email,
        senha: formData.password, // backend espera 'senha'
      });

      const user = response.data;

      // Salva o usuário no localStorage
      localStorage.setItem("studyflow_current_user", JSON.stringify(user));

      toast.success("Login realizado com sucesso!");
      setTimeout(() => setLocation("/dashboard"), 500);

    } catch (error) {
      toast.error(error.response?.data?.message || "Email ou senha incorretos");
    }
  };

  const handleGoogleLogin = () => toast.info("Login com Google em desenvolvimento");

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-4">
          <div className="flex justify-center items-center gap-2">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">StudyFlow</h1>
          </div>
          <CardTitle className="text-2xl text-center">Bem-vindo de volta!</CardTitle>
          <CardDescription className="text-center">
            Entre com sua conta para continuar seus estudos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLocation("/forgot-password")}
                className="text-sm text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg">Entrar</Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <button
              onClick={() => setLocation("/cadastro")}
              className="text-primary hover:underline font-medium"
            >
              Cadastre-se
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
