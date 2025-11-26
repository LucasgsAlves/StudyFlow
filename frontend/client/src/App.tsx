import { Route, Switch } from "wouter";
import Login from "@/pages/Login.jsx";
import Cadastro from "@/pages/Cadastro.jsx";
import ForgotPassword from "@/pages/ForgotPassword.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Home from "@/pages/Home.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Disciplinas from "@/pages/Disciplinas.jsx";
import Conteudos from "@/pages/Conteudos.jsx";
import RegistroEstudo from "@/pages/RegistroEstudo.jsx";
import Relatorios from "@/pages/Relatorios.jsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/cadastro" component={Cadastro} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/disciplinas" component={Disciplinas} />
      <Route path="/conteudos/:disciplinaId" component={Conteudos} />
      <Route path="/registro-estudo/:conteudoId" component={RegistroEstudo} />
      <Route path="/relatorios" component={Relatorios} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Router;
