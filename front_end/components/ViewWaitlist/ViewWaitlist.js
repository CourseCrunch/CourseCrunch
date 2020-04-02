/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import React from 'react';
import {
    Form, Button, ButtonGroup,
} from 'react-bootstrap';
import './ViewWaitlist.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Alert } from 'reactstrap';

class ViewWaitlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            errorMessage: '',
            removeCourse: false,
            waitlists: [],
        };
    }

    componentDidMount() {
        this.reloadWaitlist();
    }

    reloadWaitlist() {
        let userid = '';
        if (typeof window !== 'undefined') {
            userid = localStorage.getItem('userid');
        }
        const data = {
            userid,
        };
        try {
            fetch(`http://localhost:${process.env.WAITLISTPORT}/getWaitlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (res.ok) {
                    // eslint-disable-next-line no-unused-vars
                    res.json().then((data) => {
                        this.setState({
                            waitlists: data,
                            error: false,
                        });
                    }).catch(() => {
                        this.setState({
                            error: true,
                        });
                    });
                }
            }).catch(() => {
                this.setState({
                    error: true,
                });
            });
        } catch {
            this.setState({
                error: true,
            });
        }
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

    handleCourseRemoval(waitlist) {
        if (!this.state.removeCourse) return;
        let userid = '';
        if (typeof window !== 'undefined') {
            userid = localStorage.getItem('userid');
        }
        const data = {};
        Object.assign(data, waitlist);
        data.userid = userid;
        console.log(data);
        try {
            fetch(`http://localhost:${process.env.WAITLISTPORT}/deleteWaitlist`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then(() => {
                this.setState({
                    removeCourse: false,
                });
            }).catch((e) => {
                console.log(e);
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        this.reloadWaitlist();
        const { waitlists, removeCourse } = this.state;
        const waitlistButtons = [];
        const waitlistVariant = removeCourse ? 'danger' : 'primary';
        const toggleRemove = !removeCourse;
        const toggleButton = <Button
            variant={removeCourse ? 'outline-primary' : 'outline-danger'}
            onClick={() => {
                this.setState({ removeCourse: toggleRemove });
            }}
        >
            { removeCourse ? 'Cancel' : 'Remove Courses' }
        </Button>;
        waitlists.forEach((waitlist) => {
            waitlistButtons.push(
                <Button
                    variant = {waitlistVariant}
                    disabled= {!removeCourse}
                    onClick={() => this.handleCourseRemoval(waitlist)}
                >
                    {waitlist.course}, {waitlist.year}, {waitlist.term}
                </Button>,
            );
        });

        return <Form>
            {(waitlists.length >= 1) ? (<ButtonGroup class = "waitlistPanel">
                { toggleButton }
                { waitlistButtons }
            </ButtonGroup>) : (<label> No courses in waitlist </label>)}
        </Form>;
    }
}

export default ViewWaitlist;
