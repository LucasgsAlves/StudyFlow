import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import AuthNavbar from "@/components/AuthNavbar";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, insira seu email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email: email,
      });

      toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
      setTimeout(() => setLocation("/login"), 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao enviar email de recuperação");
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle className="text-2xl text-center">Recuperar Senha</CardTitle>
            <CardDescription className="text-center">
              Digite seu email para receber as instruções de recuperação de senha
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Email de Recuperação"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setLocation("/login")}
                className="flex items-center gap-2 text-primary hover:underline font-medium mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
