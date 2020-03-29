import React from 'react';
import {
    Form, Button, Alert,
} from 'react-bootstrap';
import './AddWaitlist.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewWaitlist from '../ViewWaitlist/ViewWaitlist';
// import { Alert } from 'reactstrap';

class WaitlistInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            submitErr: false,
            waitlistCourse: '',
            waitlistTerm: '',
            waitlistYear: '',
            submitted: false, // TODO: CHANGE THIS TO FALSE
            errorMessage: '',
        };
    }

    resetFields() {
        this.setState({
            waitlistCourse: '',
            waitlistTerm: '',
            waitlistYear: '',
        });
    }

    handleInputChange(inputType) {
        if (inputType === 'courseCode') {
            this.setState({
                waitlistCourse: this.courseCode.value,
            });
        } else if (inputType === 'courseTerm') {
            this.setState({
                waitlistTerm: this.courseTerm.value,
            });
        } else {
            this.setState({
                waitlistYear: this.courseYear.value,
            });
        }
    }

    handleSubmit() {
        const data = {
            course: this.state.waitlistCourse,
            term: this.state.waitlistTerm,
            year: this.state.waitlistYear,
        };
        try {
            fetch(`http://localhost:${process.env.WAITLISTPORT}/addWaitlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (res.ok) {
                    this.setState({
                        submitErr: false,
                        submitted: true,
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
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const { submitted, submitErr } = this.state;
        return <header className ="waitlistInput">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Waitlist Editor</h2>
                </div>
                <div className="currentWaitlist">
                    <label className = "form_label">Your current waitlists</label>
                    <ViewWaitlist></ViewWaitlist>
                </div>
                <div className = "form_panel">
                    <label className = "form_label">Add a course to waitlist</label>
                    <Form>
                        <Form.Group controlId="form_courseCode">
                            <Form.Label className ="inpL">Course Code</Form.Label>
                            <Form.Control
                                // eslint-disable-next-line no-return-assign
                                ref={(input) => this.courseCode = input}
                                onChange={() => this.handleInputChange('courseCode')}
                                autoComplete="no"
                                type="text" placeholder={'Ex. ANT102H5'}/>
                        </Form.Group>

                        <Form.Group controlId="form_courseYear">
                            <Form.Label className ="inpL">Course Year</Form.Label>
                            <Form.Control
                                // eslint-disable-next-line no-return-assign
                                ref={(input) => this.courseYear = input}
                                onChange={() => this.handleInputChange('courseYear')}
                                autoComplete="no"
                                type="text" placeholder={'2020'} />
                        </Form.Group>

                        <Form.Group controlId="form_courseTerm">
                            <Form.Label className ="inpL">Term</Form.Label>
                            <Form.Control
                                // eslint-disable-next-line no-return-assign
                                ref={(input) => this.courseTerm = input}
                                as="select"
                                custom
                                onChange={() => this.handleInputChange('courseTerm')}>
                                <option>fall</option>
                                <option>winter</option>
                                <option>summer</option>
                            </Form.Control>
                        </Form.Group>

                        <Button
                            onClick={() => this.handleSubmit()}
                            id="Submit_button" variant="primary" type="submit">
                            Done
                        </Button>
                        { submitted ? <Alert show={true} variant="success"> Course added successfully </Alert> : <br/>}
                        { submitErr && <Alert variant="danger"> Something went wrong while handling your request! </Alert>}
                    </Form>
                </div>
            </div>
        </header>;
    }
}

export default WaitlistInput;
