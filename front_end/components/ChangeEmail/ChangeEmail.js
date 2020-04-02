import React from 'react';
import {
    Form, Button, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';
import './ChangeEmail.css';
import { Message } from 'semantic-ui-react';

const PORT = process.env.PROFILEPORT;

class SettingsInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            submitErr: '',
            uuid: '',
            newEmail: '',
            password: '',
        };
    }

    componentDidMount() {
        fetch(`http://localhost:${PORT}/change_email`, { method: 'GET' })
            .then((res) => res.json())
            .then(
                () => {
                    this.setState({
                        isLoaded: true,
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

    handleInputChange(inputType) {
        if (inputType === 'email') {
            this.setState({
                newEmail: this.email.value,
            });
        } else {
            this.setState({
                password: this.password.value,
            });
        }
    }

    handleSubmit() {
        if (this.state.newEmail === '') {
            this.props.onButtonPress({ screen: 'Sec' });
        } else {
            const data = {
                unsanUuid: this.state.uuid,
                email: this.state.newEmail,
                password: this.state.password,
            };
            fetch(`http://localhost:${PORT}/change_email`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((res) => {
                    if (res.ok) {
                        this.props.onButtonPress({ screen: 'Sec' });
                    } else if (res.status === 406) {
                        this.setState({
                            submitErr: 'password',
                        });
                    } else {
                        this.setState({
                            submitErr: 'internal',
                        });
                    }
                }).catch((e) => {
                    console.log(e);
                    this.setState({
                        submitErr: true,
                    });
                });
        }
    }

    dispSubmitErr() {
        if (this.state.submitErr === 'password') {
            return <div className = "errorPanel"> <Message
                negative
                header="Invalid Password!"
            /> </div>;
        } if (this.state.submitErr === 'internal') {
            return <div className = "errorPanel"> <Message
                negative
                header="Uh Oh!"
                list={['An Error Occurred Try Again Later']}
            /> </div>;
        }
        return <></>;
    }

    render() {
        return <header className ="emailInput">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Change Email</h2>
                </div>
                <div className = "form_panel">
                    <label className = "form_label">Change Your Email Address For Logging In</label>
                    <Form>
                        <Form.Group controlId="form_newEmail">
                            <Form.Label className ="inpL">New Email</Form.Label>
                            <Form.Control
                                ref={(input) => this.email = input}
                                onChange={() => this.handleInputChange('email')}
                                type="email" placeholder="bob@example.com" />
                        </Form.Group>

                        <Form.Group controlId="form_password">
                            <Form.Label className ="inpL">Password</Form.Label>
                            <Form.Control
                                ref={(input) => this.password = input}
                                onChange={() => this.handleInputChange('password')}
                                autoComplete="new-password"
                                type="password" placeholder="*******" />
                        </Form.Group>

                        <Button
                            onClick={() => this.handleSubmit()}
                            id="Submit_button" variant="primary" type="button">
                            Done
                        </Button>

                        <Button id="Cancel_button"
                            onClick={() => this.updateStates({ screen: 'Sec' })}
                            variant="secondary" type="button">
                            Cancel
                        </Button>
                    </Form>
                    {this.dispSubmitErr()}
                </div>
            </div>
        </header>;
    }
}
export default SettingsInput;
