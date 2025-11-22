import { Route, Switch } from "wouter";
import Login from "@/pages/Login.jsx";
import Cadastro from "@/pages/Cadastro.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Home from "@/pages/Home.jsx";
import NotFound from "@/pages/NotFound.jsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/cadastro" component={Cadastro} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Router;
