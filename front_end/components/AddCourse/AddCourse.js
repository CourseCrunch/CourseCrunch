import React from 'react';
import {
    Form, Button, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';
import './AddCourse.css';

class SettingsInput extends React.Component {
    render() {
        return <header className ="courseInput">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Add Completed Courses</h2>
                </div>
                <div className = "form_panel">
                    <label className = "form_instruct">Add Courses You Have Completed So That We May Find Courses For You</label>
                    <label className = "hint">Tip: You can search course titles, hit enter to add course</label>
                    <Form>
                        <Form.Group controlId="form_course">
                            <Form.Label className ="inpLabel">Enter Course</Form.Label>
                            <Form.Control type="text" placeholder="Eg: CSC108" />
                        </Form.Group>

                        <Button id="add_button" variant="primary" type="submit">
                            Add
                        </Button>
                    </Form>
                </div>
            </div>
        </header>;
    }
}
export default SettingsInput;
