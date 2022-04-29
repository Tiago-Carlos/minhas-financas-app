import React from "react";

import Login from "../views/login";
import CadastroUsuario from "../views/cadastroUsuario";

import { Switch, Route, HashRouter } from 'react-router-dom'

import createHistory from 'history/createBrowserHistory';

const history = createHistory();

function Rotas() {
    return (
        <HashRouter history={history}>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/cadastro-usuarios" component={CadastroUsuario} />
            </Switch>
        </HashRouter>
    )
}
export default Rotas;