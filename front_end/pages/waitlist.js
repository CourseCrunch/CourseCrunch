import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import VertNavBar from '../components/UserProfile/VertNavBar';
import AddWaitlist from '../components/AddWaitlist/AddWaitlist';
import ViewWaitlist from '../components/ViewWaitlist/ViewWaitlist';

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
        return [<AddWaitlist/>, <ViewWaitlist/>];
    }

    render() {
        const state = this.displayState();
        return (
            <div>
                <NavBar isLoggedIn = {true}/>
                <VertNavBar onButtonPress={this.updState}/>
                <div className = "waitlistSettingCont">
                    <div className = "waitlistSettingsInputPanel">
                        {state[0]}
                        {state[1]}
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
