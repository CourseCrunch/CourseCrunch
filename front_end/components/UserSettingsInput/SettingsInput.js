import React from 'react';
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Link from 'next/link';
import './SettingsInput.css';

if (typeof window !== 'undefined'){
    const uName = localStorage.getItem('uName');
}
class SettingsInput extends React.Component{
    render(){
        return  <header className ="settingsInput">
            <div className = "panel_container">
            <div className = "pInfo_title_panel">
                <h2>Edit Profile</h2>
            </div>
                <div className = "form_panel">
                    <label className = "form_label">Edit Your Information</label>
                    <Form>
                        <Form.Group controlId="form_firstName">
                            <Form.Label className ="inpL">First Name</Form.Label>
                            <Form.Control type="text" placeholder="Robert" />
                        </Form.Group>
    
                        <Form.Group controlId="form_lastName">
                            <Form.Label className ="inpL">Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Westhaver" />
                        </Form.Group>

                        <Form.Group controlId="form_program">
                            <Form.Label className ="inpL">Program</Form.Label>
                            <Form.Control type="text" placeholder="Computer Science" />
                        </Form.Group>

                        <Button id="Submit_button" variant="primary" type="submit">
                            Done
                        </Button>

                        <Button id="Reset_button" variant="secondary" type="reset">
                            Reset
                        </Button>
                    </Form>
                </div>
            </div>
        </header>
    }
}
export default SettingsInput
