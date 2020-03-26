import React from 'react';
import Router from 'next/router';
import Button from '@material-ui/core/Button';
import { Message } from 'semantic-ui-react';
import TextField from '@material-ui/core/TextField';
import NavBar from '../components/NavBar/NavBar';
import Registration from '../components/Registration/Registration';

import './index.css';

const PORT = process.env.AUTHPORT;

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            fName: '',
            lName: '',
            program: '',
            error: '',
        };
    }

    render() {
        return (<div>
            <NavBar/>
            <div className="registerForm">
                <Registration/>
            </div>
        </div>);
    }
}

export default function RegisterUser() {
    return (
        <Register/>
    );
}
