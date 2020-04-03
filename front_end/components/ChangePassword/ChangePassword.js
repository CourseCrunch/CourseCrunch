import React from 'react';
import {
    Form, Button,
} from 'react-bootstrap';
import './ChangePassword.css';
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
            oldPassword: '',
            newPassword: '',
        };
    }

    componentDidMount() {
        fetch(`http://krishchow.me:${PORT}/change_password`, { method: 'GET' })
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
        if (inputType === 'newPassword') {
            this.setState({
                newPassword: this.newPass.value,
            });
        } else {
            this.setState({
                oldPassword: this.oldPass.value,
            });
        }
    }

    handleSubmit() {
        if (this.state.newPassword === '') {
            this.props.onButtonPress({ screen: 'Sec' });
        } else {
            const data = {
                unsanUuid: this.state.uuid,
                newPassword: this.state.newPassword,
                oldPassword: this.state.oldPassword,
            };
            fetch(`http://krishchow.me:${PORT}/change_password`, {
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
                content="An Error Occurred Try Again Later"
            /> </div>;
        }
        return <></>;
    }

    render() {
        return <header className ="passwordInput">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Change Password</h2>
                </div>
                <div className = "form_panel">
                    <label className = "form_label">Change Your Password For Logging In</label>
                    <Form>
                        <Form.Group controlId="form_newPassword">
                            <Form.Label className ="inpL">New Password</Form.Label>
                            <Form.Control
                                ref={(input) => {
                                    this.newPass = input;
                                }
                                }
                                onChange={() => this.handleInputChange('newPassword')}
                                autoComplete="new-password"
                                type="Password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group controlId="form_password">
                            <Form.Label className ="inpL">Old Password</Form.Label>
                            <Form.Control
                                ref={(input) => {
                                    this.oldPass = input;
                                }
                                }
                                onChange={() => this.handleInputChange('oldPass')}
                                autoComplete="new-password"
                                type="Password" placeholder="*******" />
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
