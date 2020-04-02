import React from 'react';
import { render } from 'react-dom';
import NavBar from '../components/NavBar/NavBar';
import VertNavBar from '../components/UserProfile/VertNavBar';
import SettingsInput from '../components/UserSettingsInput/SettingsInput';
import SelectUserCred from '../components/UserCredSelection/SelectUserCred';
import AddCourse from '../components/AddCourse/AddCourse';
import ChangeEmail from '../components/ChangeEmail/ChangeEmail';
import ChangePassword from '../components/ChangePassword/ChangePassword';
import Router from 'next/router';


import './index.css';
import './hover.css';

class EditProf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 'None',
        };

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('loggedIn') === null) {
                Router.push('/login');
            }
        }
    }

    

    updState = (state) => {
        this.setState(state);
    };

    getState() {
        return this.state;
    }

    displayState() {
        if (this.getState().screen === 'Sec') {
            return <SelectUserCred onButtonPress={this.updState}/>;
        } if (this.getState().screen === 'Comp') {
            return <AddCourse/>;
        } if (this.getState().screen === 'Email') {
            return <ChangeEmail onButtonPress={this.updState}/>;
        } if (this.getState().screen === 'Password') {
            return <ChangePassword onButtonPress={this.updState}/>;
        }
        return <SettingsInput/>;
    }

    render() {
        return (
            <div>
                <NavBar isLoggedIn = {true}/>
                <VertNavBar onButtonPress={this.updState}/>
                <div className = "profileSettingsCont">
                    <div className = "profileSettingsInputPanel">
                        {this.displayState()}
                    </div>
                </div>
            </div>
        );
    }
}

export default function EditProfile() {
    return (
        <EditProf/>
    );
}
