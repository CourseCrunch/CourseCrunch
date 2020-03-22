import React from 'react';
import {
    Form, Button, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';
import './AddCourse.css';

const PORT = process.env.PROFILEPORT;

// set up component with default states
class SettingsInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            submitErr: false,
            uuid: 'b17f1135-501f-4397-b257-653897375000',
            firstYrCourses: [],
            seconYrCourses: [],
            thirdYrCourses: [],
            fourtYearCoursesPlus: [],
            addedCourse: '',
            deletedCourse: '',
        };
    }

    // init component and make call to backend for default page data
    componentDidMount() {
        const data = { unsanUuid: this.state.uuid };

        fetch(`http://localhost:${PORT}/edit_Completed_Courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    const {
                        firstYear, seconYear, thirdYear, fourYear,
                    } = result;
                    this.setState({
                        isLoaded: true,
                        firstYrCourses: firstYear,
                        seconYrCourses: seconYear,
                        thirdYrCourses: thirdYear,
                        fourtYrCoursesPlus: fourYear,
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
        if (inputType === 'course') {
            this.setState({
                addedCourse: this.course.value,
            });
        }
    }

    handleSubmit() {
        const data = {
            unsanUuid: this.state.uuid,
            unsanCourseCode: this.state.addedCourse,
        };
        fetch(`http://localhost:${PORT}/edit_Completed_Courses`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok) {
                    const refreshData = { unsanUuid: this.state.uuid };

                    fetch(`http://localhost:${PORT}/edit_Completed_Courses`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(refreshData),
                    })
                        .then((res) => res.json())
                        .then(
                            (result) => {
                                const {
                                    firstYear, seconYear, thirdYear, fourYear,
                                } = result;
                                this.setState({
                                    firstYrCourses: firstYear,
                                    seconYrCourses: seconYear,
                                    thirdYrCourses: thirdYear,
                                    fourtYrCoursesPlus: fourYear,
                                });
                            }, (error) => {
                                console.log(error);
                            },
                        );
                } else if (res.status === 406) {
                    this.setState({
                        submitErr: 'cCode',
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

    handleDelete(event) {
        const data = {
            unsanUuid: this.state.uuid,
            unsanCourseCode: event.target.id,
        };
        fetch(`http://localhost:${PORT}/edit_Completed_Courses`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok) {
                    const refreshData = { unsanUuid: this.state.uuid };

                    fetch(`http://localhost:${PORT}/edit_Completed_Courses`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(refreshData),
                    })
                        .then((res) => res.json())
                        .then(
                            (result) => {
                                const {
                                    firstYear, seconYear, thirdYear, fourYear,
                                } = result;
                                this.setState({
                                    firstYrCourses: firstYear,
                                    seconYrCourses: seconYear,
                                    thirdYrCourses: thirdYear,
                                    fourtYrCoursesPlus: fourYear,
                                });
                            }, (error) => {
                                console.log(error);
                            },
                        );
                } else if (res.status === 406) {
                    this.setState({
                        submitErr: 'cCode',
                    });
                } else {
                    this.setState({
                        submitErr: 'internal',
                    });
                }
            }).catch((e) => {
                console.log(e);
            });
    }

    fetchCourses(year) {
        if (year === 'first') {
            if (this.state.firstYrCourses !== undefined) {
                return <ul>
                    {this.state.firstYrCourses.map((courseCode) => <label key={courseCode}> {courseCode}
                        <Button
                            onClick={this.handleDelete.bind(this)}
                            id={courseCode} variant="primary" type="button">
                                X
                        </Button>
                    </label>)}
                </ul>;
            }
            return <></>;
        } if (year === 'second') {
            if (this.state.seconYrCourses !== undefined) {
                return <ul>
                    {this.state.seconYrCourses.map((courseCode) => <label key={courseCode}> {courseCode}
                        <Button
                            onClick={this.handleDelete.bind(this)}
                            id={courseCode} variant="primary" type="button">
                                X
                        </Button>
                    </label>)}
                </ul>;
            }
            return <></>;
        } if (year === 'third') {
            if (this.state.thirdYrCourses !== undefined) {
                return <ul>
                    {this.state.thirdYrCourses.map((courseCode) => <label key={courseCode}> {courseCode}
                        <Button
                            onClick={this.handleDelete.bind(this)}
                            id={courseCode} variant="primary" type="button">
                                X
                        </Button>
                    </label>)}
                </ul>;
            }
            return <></>;
        }
        if (this.state.fourtYrCoursesPlus !== undefined) {
            return <ul>
                {this.state.fourtYrCoursesPlus.map((courseCode) => <label key={courseCode}> {courseCode}
                    <Button
                        id = {courseCode}
                        onClick={this.handleDelete.bind(this)}
                        variant="primary" type="button">
                                X
                    </Button>
                </label>)}
            </ul>;
        }
        return <></>;
    }


    render() {
        return <header className ="courseInput">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Add Completed Courses</h2>
                </div>
                <div className = "course_form_panel">
                    <label className = "form_instruct">Add Courses You Have Completed So That We May Find Courses For You</label>
                    <label className = "hint">Tip: Please Use the course code with the session and campus code at the end eg "H5" (UTM 1 semester)</label>
                    <Form>
                        <Form.Group controlId="form_course">
                            <Form.Label className ="inpLabel">Enter Course</Form.Label>
                            <Form.Control
                                ref={(input) => this.course = input}
                                onChange={() => this.handleInputChange('course')}
                                onSubmit={() => this.handleSubmit()}
                                autoComplete="new-password"
                                type="text" placeholder="Eg: CSC108H5" />

                            <Button
                                onClick={() => this.handleSubmit()}
                                id="add_button" variant="primary" type="reset">
                                    Add
                            </Button>
                        </Form.Group>


                    </Form>
                </div>
                <div className = "course_panel">
                    <div className = "firstYr_panel">
                        <label className = "firstYrCourse_label">Your First Year Courses:</label>
                        <div className = "firstCourseCode_panel">
                            {this.fetchCourses('first')}
                        </div>
                    </div>
                    <div className = "seconYr_panel">
                        <label className = "firstYrCourse_label">Your Second Year Courses:</label>
                        <div className = "secondCourseCode_panel">
                            {this.fetchCourses('second')}
                        </div>
                    </div>
                    <div className = "thirdYr_panel">
                        <label className = "firstYrCourse_label">Your Third Year Courses:</label>
                        <div className = "thirdCourseCode_panel">
                            {this.fetchCourses('third')}
                        </div>
                    </div>
                    <div className = "four+Yr_panel">
                        <label className = "firstYrCourse_label">Your Fourth Year and Other Courses:</label>
                        <div className = "fourthCourseCode_panel">
                            {this.fetchCourses('fourth')}
                        </div>
                    </div>
                </div>
            </div>
        </header>;
    }
}

export default SettingsInput;
