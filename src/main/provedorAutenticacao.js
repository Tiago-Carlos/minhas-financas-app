import React from "react";
import ApiService from "../app/apiservice";
import AuthService from "../app/service/authService";
import jwt from 'jwt-decode'
export const AuthContext = React.createContext();
export const AuthConsumer = AuthContext.Consumer;
const AuthProvider = AuthContext.Provider;

class ProvedorAutenticacao extends React.Component {
    state = {
        usuarioAutenticado: null,
        isAutenticado: false
    }
    
    iniciarSessao = (tokenDTO) => {
        const token = tokenDTO.token
        const claims = jwt(token);
        const usuario = {
            id: claims.userid,
            nome: claims.nome
        }
        ApiService.registrarToken(token);
        AuthService.logar(usuario, token);
        this.setState({isAutenticado: true, usuarioAutenticado:usuario})
    }

    encerrarSessao = () => {
        AuthService.removerUsuarioAutenticado();
        this.setState( {isAutenticado: false, usuarioAutenticado: null} )
    }

    componentDidMount() {
        const isAutenticado = AuthService.isUsuarioAutenticado()
        if (isAutenticado) {
            const usuario = AuthService.refreshSession()
            this.setState({
                isAutenticado: true,
                usuarioAutenticado: usuario
            })
        }
    }

    render () {
        const contexto = {
            usuarioAutenticado: this.state.usuarioAutenticado,
            isAutenticado: this.state.isAutenticado,
            iniciarSessao: this.iniciarSessao,
            encerrarSessao: this.encerrarSessao
        }
        return (
            <AuthProvider value={contexto}>
                {this.props.children}
            </AuthProvider>
        )
    }
}

export default ProvedorAutenticacao;