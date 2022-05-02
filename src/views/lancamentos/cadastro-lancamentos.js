import React from 'react'
import Card from '../../components/card'
import { withRouter } from 'react-router-dom'
import FormGroup from '../../components/form-group'
import selectMenu from '../../components/selectMenu'

import * as messages from '../../components/toastr'
import lancamentoService from '../../app/service/lancamentoService'
import SelectMenu from '../../components/selectMenu'

import LocalStorageService from '../../app/service/LocalStorageService'

class CadastoLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        valor: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        usuario: null
    }

    constructor() {
        super();
        this.service = new lancamentoService();
    }

    componentDidMount() {
        const params = this.props.match.params;
        if (params.id) {
            this.service.obterPorId(params.id)
                .then(response => {
                    this.setState({ ...response.data, atualizando: true })
                })
                .catch(erro => {
                    this.props.history.push('/consulta-lancamentos')
                    messages.mensagemErro(erro.response.data)
                })
        }
    }

    submit = () => {
        const usuario = LocalStorageService.obterItem('_usuario_logado')
        const { descricao, valor, mes, ano, tipo } = this.state;

        const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuario.id }

        try {
            this.service.validar(lancamento)
        } catch (erro) {
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => messages.mensagemErro(msg));
            return false;
        }

        this.service.salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso("Lançamento cadastrado.")
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })
    }

    atualizar = () => {
        const { descricao, valor, mes, ano, tipo, id, usuario, status } = this.state;
        const lancamento = { descricao, valor, mes, ano, tipo, id, usuario, status }

        this.service.atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso("Lançamento atualizado.")
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value })
    }

    render() {
        const tipos = this.service.obterListaTipos();
        const meses = this.service.obterListaMeses();

        return (
            <Card title={this.state.atualizando ? "Atualização de lançamento" : "Cadastro de lançamento"}>
                <div className='row'>
                    <div className='col-md-12'>
                        <FormGroup id="inputDescricao" label="Descrição: *">
                            <input id="inputDescricao"
                                type="text"
                                className="form-control"
                                name="descricao"
                                value={this.state.descricao}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className='row' >
                    <div className='col-md-6'>
                        <FormGroup id="inputAno" label="Ano: *">
                            <input id="inputAno"
                                type="text"
                                className='form-control'
                                name="ano"
                                value={this.state.ano}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className='col-md-6'>
                        <FormGroup id="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes"
                                lista={meses}
                                className="form-control"
                                name="mes"
                                value={this.state.mes}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-4'>
                        <FormGroup id="inputValor" label="Valor: *">
                            <input id="inputValor"
                                type="text"
                                className="form-control"
                                name="valor"
                                value={this.state.valor}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className='col-md-4'>
                        <FormGroup id="inputTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo"
                                lista={tipos}
                                className="form-control"
                                name="tipo"
                                value={this.state.tipo}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className='col-md-4'>
                        <FormGroup id="inputStatus" label="Status: *">
                            <input type="text" className="form-control" disabled value={this.state.status} />
                        </FormGroup>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        {this.state.atualizando ? (
                            <button onClick={this.atualizar}
                                className='btn btn-success'>
                                <i className='pi pi-refresh' /> Atualizar
                            </button>
                        ) : (
                            <button onClick={this.submit}
                                className='btn btn-success'>
                                <i className='pi pi-save' />
                                Cadastrar
                            </button>
                        )
                        }

                        <button onClick={e => (this.props.history.push('/consulta-lancamentos'))}
                            className='btn btn-danger'>
                            <i className='pi pi-times' /> Cancelar
                        </button>
                    </div>
                </div>
            </Card>
        )
    }
}

export default CadastoLancamentos