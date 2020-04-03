import React from 'react';
import Router from 'next/router';
import { Message } from 'semantic-ui-react';
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

    // eslint-disable-next-line class-methods-use-this
    render() {
        return (<div>
            <title>Login</title>
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
