import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import VertNavBar from '../components/UserProfile/VertNavBar';
<<<<<<< HEAD
import WaitlistInput from '../components/WaitlistInput/WaitlistInput';
=======
import AddWaitlist from '../components/AddWaitlist/AddWaitlist';
import ViewWaitlist from '../components/ViewWaitlist/ViewWaitlist';
>>>>>>> parent of 2bb2dc7... Add working front end for waitlists

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
<<<<<<< HEAD
        return <WaitlistInput/>;
=======
        return [<AddWaitlist/>, <ViewWaitlist/>];
>>>>>>> parent of 2bb2dc7... Add working front end for waitlists
    }

    render() {
        return (
            <div>
                <NavBar isLoggedIn = {true}/>
                <VertNavBar onButtonPress={this.updState}/>
                <div className = "waitlistSettingCont">
                    <div className = "waitlistSettingsInputPanel">
<<<<<<< HEAD
                        {this.displayState()}
=======
                        {state[0]}
                        {state[1]}
>>>>>>> parent of 2bb2dc7... Add working front end for waitlists
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
