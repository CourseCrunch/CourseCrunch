import React from 'react';
import {
    Button,
} from 'react-bootstrap';
import './SelectUserCred.css';

const PORT = process.env.PROFILEPORT;

class CredSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            submitErr: false,
            uuid: '',
            oldEmail: '',
        };
    }


    componentDidMount() {
        let data = { unsanUuid: this.state.uuid };
        if (typeof window !== 'undefined') {
            data = { unsanUuid: localStorage.getItem('userid') };
        }
        fetch(`${process.env.BASE}${PORT}/change_email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    const { eMail } = result;
                    this.setState({
                        isLoaded: true,
                        oldEmail: eMail,
                    });
                    if (typeof window !== 'undefined') {
                        this.setState({
                            uuid: localStorage.getItem('userid'),
                        });
                    }
                }, (error) => {
                    this.setState({
                        isLoaded: true,
                        error,
                    });
                    if (typeof window !== 'undefined') {
                        this.setState({
                            uuid: localStorage.getItem('userid'),
                        });
                    }
                },
            );
    }

    updateStates(returnState) {
        this.props.onButtonPress(returnState);
    }

    render() {
        return <header className ="credSelect">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Security Settings</h2>
                </div>
                <div className = "form_panel">
                    <label className = "form_label">Select A Security Setting You Wish To Change</label>
                    <Button id="Email_button"
                        onClick={() => this.updateStates({ screen: 'Email' })}
                        variant="primary" type="button">
                        <div className = "buttonContainer">
                            <label className ="buttonLabel1">Email</label>
                            <label className ="buttonLabel2">{this.state.oldEmail}</label>
                            <label className ="buttonLabel3"> > </label>
                        </div>
                    </Button>

                    <Button id="Password_button"
                        onClick={() => this.updateStates({ screen: 'Password' })}
                        variant="secondary" type="button">
                        <div className = "buttonContainer">
                            <label className ="buttonLabel1">Password</label>
                            <label className ="buttonLabel2">********</label>
                            <label className ="buttonLabel3"> > </label>
                        </div>
                    </Button>
                </div>
            </div>
        </header>;
    }
}
export default CredSelection;
