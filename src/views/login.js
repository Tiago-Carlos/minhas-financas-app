import React from 'react'
import { withRouter } from "react-router-dom";
import Card from '../components/card'
import FormGroup from '../components/form-group'
import UsuarioService from '../app/service/usuarioService';
import LocalStorageService from '../app/service/LocalStorageService';
import { mensagemErro } from '../components/toastr';

class Login extends React.Component {

    state = {
        email: '',
        senha: ''
    }

    constructor () {
        super();
        this.service = new UsuarioService();
    }

    entrar = () => {
        // axios -> cliente http baseado em promises, é async
        this.service.autenticar ({
                email: this.state.email,
                senha: this.state.senha
            }).then ( response => {
                LocalStorageService.adicionarItem ('_usuario_logado', JSON.stringify(response.data))
                this.props.history.push("/home")
            }).catch ( erro => {
                mensagemErro(erro.response.data)
            } )
    }

    prepareCadastrar = () => {
        this.props.history.push("/cadastro-usuarios")
    }

    render() {
        return (
            <div className='row'>
                <div className='col-md-6' style={{ position: 'relative', left: '300px' }}>
                    <div className='bs-docs-section'>
                        <Card title='login'>
                            <div className='row'>
                                <span>{this.state.mensagemErro}</span>
                            </div>
                            <div className='col-lv-12'>
                                <div className='bd-component'>
                                    <fieldset>
                                        <FormGroup label='Email: ' htmlFor='exampleInputEmail1'>
                                            <input type="email"
                                                value={this.state.email}
                                                onChange={e => this.setState({ email: e.target.value })}
                                                class="form-control"
                                                id="exampleInputEmail1"
                                                aria-describedby='emailHelp'
                                                placeholder='Digite o email' />
                                        </FormGroup>
                                        <FormGroup label='Senha: ' htmlFor='exampleInputPassword1'>
                                            <input type="password"
                                                value={this.state.senha}
                                                onChange={e => this.setState({ senha: e.target.value })}
                                                className='form-control'
                                                id="exampleInputPassword1"
                                                placeholder='Password' />
                                        </FormGroup>
                                        <button onClick={this.entrar} className='btn btn-success'>Entrar</button>
                                        <button onClick={this.prepareCadastrar} className='btn btn-danger'>Cadastrar</button>
                                    </fieldset>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(Login)