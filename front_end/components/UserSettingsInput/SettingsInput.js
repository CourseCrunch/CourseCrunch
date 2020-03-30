import React from 'react';
import { render } from 'react-dom';
import {
    Form, Button, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';
import './SettingsInput.css';

const PORT = process.env.PROFILEPORT;

class SettingsInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            submitErr: false,
            uuid: '',
            oldFName: '',
            oldLName: '',
            oldProgram: '',
            newFName: '',
            newLName: '',
            newProg: '',
        };
    }

    componentDidMount() {
        let data = { unsanUuid: this.state.uuid };
        if (typeof window !== 'undefined') {
            data = { unsanUuid: localStorage.getItem('userid') };
        }
        fetch(`http://localhost:${PORT}/edit_profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    const { fNam, lNam, prog } = result;
                    this.setState({
                        isLoaded: true,
                        oldFName: fNam,
                        oldLName: lNam,
                        oldProgram: prog,
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

    handleInputChange(inputType) {
        if (inputType === 'firstName') {
            this.setState({
                newFName: this.firstName.value,
            });
        } else if (inputType === 'lastName') {
            this.setState({
                newLName: this.lastName.value,
            });
        } else {
            this.setState({
                newProg: this.prog.value,
            });
        }
    }

    handleSubmit() {
        const data = {
            unsanUuid: this.state.uuid,
            unsanFname: this.state.newFName,
            unsanLname: this.state.newLName,
            unsanProgram: this.state.newProg,
        };
        fetch(`http://localhost:${PORT}/edit_profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok) {
                    this.setState({
                        submitErr: false,
                    });
                } else {
                    this.setState({
                        submitErr: true,
                    });
                }
            }).catch((e) => {
                console.log(e);
                this.setState({
                    submitErr: true,
                });
            });
    }

    render() {
        return <header className ="settingsInput">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Edit Profile</h2>
                </div>
                <div className = "form_panel">
                    <label className = "form_label">Edit Your Information</label>
                    <Form>
                        <Form.Group controlId="form_firstName">
                            <Form.Label className ="inpL">First Name</Form.Label>
                            <Form.Control
                                ref={(input) => this.firstName = input}
                                onChange={() => this.handleInputChange('firstName')}
                                autoComplete="no"
                                type="text" placeholder={this.state.oldFName}/>
                        </Form.Group>

                        <Form.Group controlId="form_lastName">
                            <Form.Label className ="inpL">Last Name</Form.Label>
                            <Form.Control
                                ref={(input) => this.lastName = input}
                                onChange={() => this.handleInputChange('lastName')}
                                autoComplete="new-password"
                                type="text" placeholder={this.state.oldLName} />
                        </Form.Group>

                        <Form.Group controlId="form_program">
                            <Form.Label className ="inpL">Program</Form.Label>
                            <Form.Control
                                ref={(input) => this.prog = input}
                                onChange={() => this.handleInputChange('program')}
                                autoComplete="new-password"
                                type="text" placeholder={this.state.oldProgram} />
                        </Form.Group>

                        <Button
                            onClick={() => this.handleSubmit()}
                            id="Submit_button" variant="primary" type="submit">
                            Done
                        </Button>

                        <Button id="Reset_button" variant="secondary" type="reset">
                            Reset
                        </Button>
                    </Form>
                </div>
            </div>
        </header>;
    }
}

export default SettingsInput;
