import LocalStorageService from "./LocalStorageService";
import jwt from 'jwt-decode'
import ApiService from '../apiservice'

export const USUARIO_LOGADO = '_usuario_logado'
export const TOKEN = 'access_token'

export default class AuthService {
    static isUsuarioAutenticado() {
        const token = LocalStorageService.obterItem(TOKEN);
        if (token) {
            const decodedToken = jwt(token);
            const expiration = decodedToken.exp;
            const venceu = Date.now() >= (expiration * 1000)
            return !venceu;
        }
        return false;
    }

    static removerUsuarioAutenticado () {
        LocalStorageService.removerItem(USUARIO_LOGADO)
        LocalStorageService.removerItem(TOKEN)
    }

    static logar(usuario, token) {
        LocalStorageService.adicionarItem(USUARIO_LOGADO, usuario)
        LocalStorageService.adicionarItem(TOKEN, token)
        var teste = LocalStorageService.obterItem(USUARIO_LOGADO)
    }

    static obterUsuarioAutenticado() {
        return LocalStorageService.obterItem(USUARIO_LOGADO);
    }

    static refreshSession() {
        const token = LocalStorageService.obterItem(TOKEN);
        const usuario = AuthService.obterUsuarioAutenticado();
        AuthService.logar(usuario, token);
        return usuario;
    }
}