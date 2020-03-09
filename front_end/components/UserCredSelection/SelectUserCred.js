import React from 'react';
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Link from 'next/link';
import './SelectUserCred.css';

class CredSelection extends React.Component{
    render(){
        return  <header className ="credSelect">
            <div className = "panel_container">
                <div className = "pInfo_title_panel">
                    <h2>Security Settings</h2>
                </div>
                <div className = "form_panel">
                    <label className = "form_label">Select A Security Setting You Wish To Change</label>
                    <Button id="Email_button" variant="primary" type="button">
                        <div className = "buttonContainer">
                            <label className ="buttonLabel1">Email</label>
                            <label className ="buttonLabel2">rjwesthaver@gmail.com</label>
                            <label className ="buttonLabel3"> > </label>
                        </div>
                    </Button>

                    <Button id="Password_button" variant="secondary" type="button">
                        <div className = "buttonContainer">
                            <label className ="buttonLabel1">Password</label>
                            <label className ="buttonLabel2">********</label>
                            <label className ="buttonLabel3"> > </label>
                        </div>
                    </Button>
                </div>
            </div>
        </header>
    }
}
export default CredSelection
