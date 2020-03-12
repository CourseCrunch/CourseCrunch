import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import './index.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "", //uuid or email?
            password: "",
            email: "",
            loggedIn: false
        };
    }

    handleClick = () => {
        this.setState({loggedIn: true});
        //fetch('/login', {
          //  method: 'POST',
            //username: this.state.username,
            //password: this.state.password
        //}) // More stuffs
    }

    render() {
        return(<div>
            <NavBar isLoggedIn = {this.state.loggedIn}/>
            <div className="loginform">
                <h2>Login</h2>
                <form className="inputfields">
                    <TextField label="Email" type="email" className="inputemail" fullWidth
                    required={true} onChange ={(newValue) => this.setState({email:newValue})}/>
                    <br/><br/>
                    <TextField label="Password" type="password" className="inputpw" fullWidth
                    required={true} onChange ={(newValue) => this.setState({password:newValue})}/>
                    <br/><br/><br/>
                    <Button variant="contained" color="primary" size="large" onClick={this.handleClick}>Login</Button>
                </form>
            </div>
        </div>);
    };
}

const LoginPage = () => (
    <Login/>
);

export default LoginPage;