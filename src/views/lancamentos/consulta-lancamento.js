import React from "react";
import lancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/LocalStorageService";
import Card from "../../components/card"
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import LancamentosTable from "./lancamentosTable";
import * as messages from "../../components/toastr"
import { Button } from 'primereact/button';

import { Dialog } from 'primereact/dialog';

class ConsultaLancamentos extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.service = new lancamentoService();
    }

    alterarStatus = (lancamento, status) => {
        this.service.alterarStatus(lancamento.id, status)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if (index !== -1) {
                    lancamento["status"] = status;
                    lancamentos[index] = lancamento;
                    this.setState({ lancamento });
                }
                messages.mensagemSucesso("Status atualizado.")
            })
    }

    buscar = () => {
        if (!this.state.ano) {
            messages.mensagemErro("O campo ano é obrigatório!")
            return false;
        }
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service.consultar(lancamentoFiltro)
            .then(resposta => {
                const lista = resposta.data;

                if(lista.length < 1) {
                    messages.mensagemAlerta("Nenhum resultado encontrado.");
                }
                this.setState({ lancamentos: resposta.data })
            }).catch(error => {
                //TODO
                console.log(error)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmarDeletar = (lancamento) => {
        this.setState({ showConfirmDialog: true, lancamentoDeletar: lancamento })
    }

    fecharConfirmarDeletar = () => {
        this.setState({ showConfirmDialog: false })
    }

    deletar = () => {
        this.service.deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.lancamentoDeletar);
                lancamentos.splice(index, 1);
                this.setState({ lancamentos: lancamentos, showConfirmDialog: false })
                messages.mensagemSucesso("Lançamento deletado com sucesso.")
            })
            .catch(error => {
                console.log(error)
                messages.mensagemErro("Ocorreu um erro ao tentar deletar o lancamento.")
                this.setState({ lancamentos: null, showConfirmDialog: false })
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    render() {
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Deletar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.fecharConfirmarDeletar} />
            </div>
        )

        return (
            <Card title="Consulta Lancamentos">
                <div className="row">
                    <div className="col-mb-12">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano:* ">
                                <input type="text"
                                    className="form-control"
                                    id="inputAno"
                                    value={this.state.ano}
                                    onChange={e => this.setState({ ano: e.target.value })}
                                    placeholder="Digite o Ano" />
                            </FormGroup>

                            <FormGroup htmlFor="inputMes" label="Mês">
                                <SelectMenu id="inputMes"
                                    value={this.state.mes}
                                    onChange={e => this.setState({ mes: e.target.value })}
                                    className="form-control"
                                    lista={meses} />
                            </FormGroup>

                            <FormGroup htmlFor="inputDesc" label="Descrição: ">
                                <input type="text"
                                    className="form-control"
                                    id="inputDesc"
                                    value={this.state.descricao}
                                    onChange={e => this.setState({ descricao: e.target.value })}
                                    placeholder="Digite a descricao" />
                            </FormGroup>

                            <FormGroup htmlFor="inputTipo" label="Tipo">
                                <SelectMenu id="inputTipo"
                                    value={this.state.tipo}
                                    onChange={e => this.setState({ tipo: e.target.value })}
                                    className="form-control"
                                    lista={tipos} />
                            </FormGroup>

                            <button onClick={this.buscar}
                                className='btn btn-success'>
                                <i className="pi pi-search" /> Buscar
                            </button>
                            <button onClick={this.preparaFormularioCadastro}
                                className='btn btn-danger'>
                                <i className="pi pi-plus" /> Cadastrar
                            </button>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos}
                                editarAction={this.editar}
                                deletarAction={this.abrirConfirmarDeletar}
                                alterarStatus={this.alterarStatus} />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmar Exclusão"
                        visible={this.state.showConfirmDialog}
                        style={{ width: '50vw' }}
                        position="bottom"
                        modal={true}
                        footer={confirmDialogFooter}
                        onHide={() => this.setState({ showConfirmDialog: false })}>
                        <p>Deseja mesmo deletar o lancamento {this.state.lancamentoDeletar.descricao}?</p>
                    </Dialog>
                </div>
            </Card>
        )
    }
}

// TODO: Achar erro ao deletar 2 seguidos

export default ConsultaLancamentos;