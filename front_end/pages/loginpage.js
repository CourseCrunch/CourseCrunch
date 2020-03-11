import React from 'react';
import NavBar from '../components/NavBar/NavBar';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "", //uuid or email?
            password: "",
            loggedIn: false
        };
    }

    handleClick = () => {
        fetch('/login', {
            method: 'POST',
            username: this.state.username,
            password: this.state.password
        }) // More stuffs
    }

    render () {

    };
}

export default Login;