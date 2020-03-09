import React from "react";
import { render } from "react-dom";
import NavBar from '../components/NavBar/NavBar';
import VertNavBar from '../components/UserProfile/VertNavBar';
import SettingsInput from '../components/UserSettingsInput/SettingsInput';
import SelectUserCred from '../components/UserCredSelection/SelectUserCred';
import AddCourse from '../components/AddCourse/AddCourse';

import './index.css';
import './hover.css';

class EditProf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: "None"
        };
    }

    updState = (state) => {
        this.setState(state);
    };

    getState(){
        return this.state;
    }

    displayState(){
        if(this.getState()["screen"] === "Sec"){
            return <SelectUserCred/>
        } else if (this.getState()["screen"] == "uInfo" || this.getState()["screen"] == "None"){
            return <SettingsInput/>
        } else {
            return <AddCourse/>
        }
    }
    
    render(){
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
