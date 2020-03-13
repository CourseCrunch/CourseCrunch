import React from 'react';
import Router from 'next/router';
import Button from '@material-ui/core/Button';
import { Message } from 'semantic-ui-react';
import TextField from '@material-ui/core/TextField';
import NavBar from '../components/NavBar/NavBar';
import './index.css';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            email: '',
            error: '',
        };
    }

    // Robert's error stuff.
    dispSubmitErr() {
        if (this.state.error === 'password') {
            return <div className = "errorPanel"> <Message
                negative
                header="Invalid Password!"
            /> </div>;
        } if (this.state.error === 'internal') {
            return <div className = "errorPanel"> <Message
                negative
                header="Uh Oh!"
                content="An Error Occurred Try Again Later"
            /> </div>;
        }else {
            return;
        }
    }

    handleClick = () => {
        const data = {
            email: this.state.email,
            password: this.state.password,
        };
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok) {
                    const { userid } = res.json();
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('userid', userid);
                        localStorage.setItem('loggedin', true);
                        Router.push('/');
                    }
                } else if (res.status === 406) {
                    this.setState({
                        error: 'password',
                    });
                } else {
                    this.setState({
                        error: 'internal',
                    });
                }
            }).catch((e) => {
                console.log(e);
                this.setState({
                    error: 'unknown',
                });
            });
    }

    render() {
        return (<div>
            <NavBar/>
            <div className="loginform">
                <h2>Login</h2>
                <form className="inputfields">
                    <TextField label="Email" type="email" className="inputemail" fullWidth
                        required={true} onChange ={(e) => this.setState({ email: e.target.value })}/>
                    <br/><br/>
                    <TextField label="Password" type="password" className="inputpw" fullWidth
                        required={true} onChange ={(e) => this.setState({ password: e.target.value })}/>
                    <br/><br/><br/>
                    <Button variant="contained" color="primary" size="large" onClick={this.handleClick}>Login</Button>
                </form>
                {this.dispSubmitErr()}
            </div>
        </div>);
    }
}

const LoginPage = () => (
    <Login/>
);

export default LoginPage;
