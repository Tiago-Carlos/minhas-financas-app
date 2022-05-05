import React from "react";
import { withRouter } from 'react-router-dom'

class LandingPage extends React.Component {

    goToHome = () => {
        this.props.history.push("/home")
    }
    render() {
        return (
            <div className="container text-center" >
                <h2>Bem vindo ao sistema Minhas Finanças</h2>

                <div className="offset-md-4 col-md-4">
                    <button style={{width: '100%'}} className="btn btn-success" onClick={this.goToHome}>
                        <i className="pi pi-sign-in" /> Acessar
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage)