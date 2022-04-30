import React from "react";
import { withRouter } from "react-router-dom";
import UsuarioService from "../app/service/usuarioService";
import Card from "../components/card";
import FormGroup from "../components/form-group";
import { mensagemSucesso, mensagemErro } from "../components/toastr"

class CadastroUsuario extends React.Component {

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor() {
        super();
        this.service = new UsuarioService();
    }

    validar() {
        const msg = [];

        if (!this.state.nome) {
            msg.push("O campo nome é obrigatório.");
        }
        if (!this.state.email) {
            msg.push("O campo email é obrigatório.");
        } else if (!this.state.email.match(/^a-z0-9.]+@[a-z0-9]+\.[a-z]/)) {
            msg.push("Informe um email válido.")
        }

        if (!this.state.senha) {
            msg.push("Informe uma senha.")
        }

        if (this.state.senha !== this.state.senhaRepeticao) {
            msg.push("As senhas informadas são diferentes.")
        }
        

        return msg;
    }

    cadastrar = () => {
        const msgs = this.validar();
        if (msgs && msgs.length > 0){
            msgs.forEach( (msg, index) => {
                mensagemErro(msg)
            })
            return false;
        }
        const usuario = {
            nome: this.state.nome,
            email: this.state.email,
            senha: this.state.senha
        }

        this.service.salvar(usuario)
            .then(response => {
                mensagemSucesso("Usuario criado com sucesso!");
                this.props.history.push("/login")
            }).catch (erro => {
                mensagemErro(erro.response.data);
            })
    }

    cancelar = () => {
        this.props.history.push('/login')
    }
    render() {
        return (
            <Card title='Cadastro de Usuario'>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup label="Nome: " htmlFor="inputNome">
                                <input type="text"
                                    id="inputNome"
                                    className="form-control"
                                    name="nome"
                                    onChange={e => this.setState({ nome: e.target.value })} />
                            </FormGroup>
                            <FormGroup label="Email: " htmlFor="inputEmail">
                                <input type="email"
                                    id="inputEmail"
                                    className="form-control"
                                    name="email"
                                    onChange={e => this.setState({ email: e.target.value })} />
                            </FormGroup>
                            <FormGroup label="Senha: " htmlFor="inputSenha">
                                <input type="password"
                                    id="inputSenha"
                                    className="form-control"
                                    name="senha"
                                    onChange={e => this.setState({ senha: e.target.value })} />
                            </FormGroup>
                            <FormGroup label="Senha: " htmlFor="inputRepitaSenha">
                                <input type="password"
                                    id="inputRepitaSenha"
                                    className="form-control"
                                    name="senhaRepeticao"
                                    onChange={e => this.setState({ senhaRepeticao: e.target.value })} />
                            </FormGroup>
                            <button type="button" className="btn btn-success" onClick={this.cadastrar}>Salvar</button>
                            <button onClick={ this.cancelar } type="button" className="btn btn-danger">Cancelar</button>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroUsuario)