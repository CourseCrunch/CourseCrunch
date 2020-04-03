import React from 'react';
import Router from 'next/router';
import {
    Form, Button,
} from 'react-bootstrap';
import './Registration.css';
import { Message } from 'semantic-ui-react';

const PORT = process.env.AUTHPORT;


class SettingsInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            submitErr: '',
            uuid: '',
            email: '',
            password: '',
            confPassword: '',
            fName: '',
            lName: '',
            program: '',
        };
    }

    componentDidMount() {
        fetch(`http://localhost:${PORT}/register`, { method: 'GET' })
            .then((res) => res.json())
            .then(
                () => {
                    this.setState({
                        isLoaded: true,
                    });
                }, (error) => {
                    this.setState({
                        isLoaded: true,
                        error,
                    });
                },
            );
    }

    handleInputChange(inputType) {
        if (inputType === 'email') {
            this.setState({
                email: this.email.value,
            });
        } else if (inputType === 'firstName') {
            this.setState({
                fName: this.fName.value,
            });
        } else if (inputType === 'lastName') {
            this.setState({
                lName: this.lName.value,
            });
        } else if (inputType === 'program') {
            this.setState({
                program: this.program.value,
            });
        } else if (inputType === 'password') {
            this.setState({
                password: this.password.value,
            });
        } else {
            this.setState({
                confPassword: this.confPassword.value,
            });
        }
    }


    handleSubmit() {
        if (this.state.email === '') {
            this.setState({
                submitErr: 'email',
            });
        } else if (this.state.fName === ''
            || this.state.password === '' || this.state.confPassword === '') {
            this.setState({
                submitErr: 'emptyFields',
            });
        } else if (this.state.password !== this.state.confPassword) {
            this.setState({
                submitErr: 'password',
            });
        } else {
            const data = {
                email: this.state.email,
                fName: this.state.fName,
                lName: this.state.lName,
                program: this.state.program,
                password: this.state.password,
            };
            fetch(`http://localhost:${PORT}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((res) => {
                    if (res.ok) {
                        res.json().then((result) => {
                            const { uuid } = result;
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('userid', uuid);
                                localStorage.setItem('loggedIn', 'true');
                                console.log(localStorage.getItem('loggedIn'));
                                Router.push('/');
                            }
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
        if (this.state.submitErr === 'email') {
            return <div className = "regErrorPanel"> <Message
                negative
                header="Invalid Email!"
            /> </div>;
        } if (this.state.submitErr === 'emptyFields') {
            return <div className = "regErrorPanel"> <Message
                negative
                header="Please Fill In The Mandatory Fields"
            /> </div>;
        } if (this.state.submitErr === 'password') {
            return <div className = "regErrorPanel"> <Message
                negative
                header="Both Passwords Must Match!"
            /> </div>;
        } if (this.state.submitErr === 'internal') {
            return <div className = "regErrorPanel"> <Message
                negative
                header="Uh Oh! An Error Occurred! Try Again Later"
            /> </div>;
        }
        return <></>;
    }

    render() {
        return <header className ="registerInput">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Register With Us!</h2>
                </div>
                <div className = "regForm_panel">
                    <label className = "form_label">Change Your Email Address For Logging In</label>
                    <Form>
                        <Form.Group controlId="form_email">
                            <Form.Label className ="inpL">Email*</Form.Label>
                            <Form.Control
                                ref={(input) => {
                                    this.email = input;
                                }
                                }
                                onChange={() => this.handleInputChange('email')}
                                type="email" placeholder="bob@example.com" />
                        </Form.Group>

                        <Form.Group controlId="form_fName">
                            <Form.Label className ="inpL">First Name*</Form.Label>
                            <Form.Control
                                ref={(input) => {
                                    this.fName = input;
                                }
                                }
                                onChange={() => this.handleInputChange('firstName')}
                                autoComplete="yes"
                                type="text" placeholder="Bob" />
                        </Form.Group>

                        <Form.Group controlId="form_lName">
                            <Form.Label className ="inpL">Last Name</Form.Label>
                            <Form.Control
                                ref={(input) => {
                                    this.lName = input;
                                }
                                }
                                onChange={() => this.handleInputChange('lastName')}
                                autoComplete="yes"
                                type="text" placeholder="Smith" />
                        </Form.Group>

                        <Form.Group controlId="form_program">
                            <Form.Label className ="inpL">Program</Form.Label>
                            <Form.Control
                                ref={(input) => {
                                    this.program = input;
                                }
                                }
                                onChange={() => this.handleInputChange('program')}
                                autoComplete="yes"
                                type="text" placeholder="Computer Science" />
                        </Form.Group>

                        <Form.Group controlId="form_password">
                            <Form.Label className ="inpL">Password*</Form.Label>
                            <Form.Control
                                ref={(input) => {
                                    this.password = input;
                                }
                                }
                                onChange={() => this.handleInputChange('password')}
                                autoComplete="new-password"
                                type="password" placeholder="***********" />
                        </Form.Group>

                        <Form.Group controlId="form_confPassword">
                            <Form.Label className ="inpL">Confirm Password*</Form.Label>
                            <Form.Control
                                ref={(input) => {
                                    this.confPassword = input;
                                }
                                }
                                onChange={() => this.handleInputChange('confPassword')}
                                autoComplete="new-password"
                                type="password" placeholder="***********" />
                        </Form.Group>

                        <Button
                            onClick={() => this.handleSubmit()}
                            id="register_button" variant="primary" type="button">
                            Register
                        </Button>

                        <a id="login"
                            href="/login">
                            Already Have An Account? Sign In Here!
                        </a>
                    </Form>
                    {this.dispSubmitErr()}
                </div>
            </div>
        </header>;
    }
}
export default SettingsInput;
