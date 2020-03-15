import React from 'react';
import { render } from 'react-dom';
import {
    Form, Button,
} from 'react-bootstrap';
import './WaitlistInput.css';

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
            status: '',
        };
    }

    resetFields() {
        this.setState({
            waitlistCourse: '',
            waitlistTerm: '',
            waitlistYear: '',
        });
    }

    componentDidMount() {
        const data = {
            course: this.state.waitlistCourse,
            term: this.state.waitlistTerm,
            year: this.state.waitlistYear,
        };

        fetch('http://localhost:3006/addWaitlist', {
            method: 'POST',
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
                    this.resetFields();
                } else {
                    this.setState({
                        submitErr: true,
                    });
                    this.resetFields();
                }
            }).catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
                this.setState({
                    submitErr: true,
                });
                this.resetFields();
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
        fetch('http://localhost:3006/addWaitlist', {
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
                    this.resetFields();
                } else {
                    this.setState({
                        submitErr: true,
                    });
                    this.resetFields();
                }
            }).catch((e) => {
                console.log(e);
                this.setState({
                    submitErr: true,
                });
                this.resetFields();
            });
    }

    render() {
        return <header className ="waitlistInput">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Waitlist Editor</h2>
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
                            <Form.Label className ="inpL">Course Term</Form.Label>
                            <Form.Control
                                // eslint-disable-next-line no-return-assign
                                ref={(input) => this.courseTerm = input}
                                onChange={() => this.handleInputChange('courseYear')}
                                autoComplete="no"
                                type="text" placeholder={'2020'} />
                        </Form.Group>

                        <Form.Group controlId="form_courseYear">
                            <Form.Label className ="inpL">Year</Form.Label>
                            <Form.Control
                                // eslint-disable-next-line no-return-assign
                                ref={(input) => this.courseYear = input}
                                as="select"
                                custom
                                onChange={() => this.handleInputChange('courseYear')} />
                            <option>fall</option>
                            <option>winter</option>
                            <option>summer</option>
                        </Form.Group>

                        <Button
                            onClick={() => this.handleSubmit()}
                            id="Submit_button" variant="primary" type="submit">
                            Done
                        </Button>
                    </Form>
                </div>
            </div>
        </header>;
    }
}

export default WaitlistInput;
