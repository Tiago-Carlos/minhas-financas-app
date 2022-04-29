import React from "react";

import Home from "../views/home";
import Login from "../views/login";
import CadastroUsuario from "../views/cadastroUsuario";

import { Switch, Route, HashRouter } from 'react-router-dom';

function Rotas() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/home" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/cadastro-usuarios" component={CadastroUsuario} />
            </Switch>
        </HashRouter>
    )
}
export default Rotas;