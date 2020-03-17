import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import VertNavBar from '../components/UserProfile/VertNavBar';
import WaitlistInput from '../components/WaitlistInput/WaitlistInput';

import './index.css';
import './hover.css';

class WaitlistComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 'None',
        };
    }

    updState = (state) => {
        this.setState(state);
    };

    getState() {
        return this.state;
    }

    // eslint-disable-next-line class-methods-use-this
    displayState() {
        return <WaitlistInput/>;
    }

    render() {
        return (
            <div>
                <NavBar isLoggedIn = {true}/>
                <VertNavBar onButtonPress={this.updState}/>
                <div className = "waitlistSettingCont">
                    <div className = "waitlistSettingsInputPanel">
                        {this.displayState()}
                    </div>
                </div>
            </div>
        );
    }
}

export default function Waitlist() {
    return (
        <WaitlistComp/>
    );
}
