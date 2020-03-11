import React from 'react';
import './VertNavBar.css';

class VertNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 'UInfo',
        };
    }

    updateStates(returnState, internalState) {
        this.setState(internalState);
        this.props.onButtonPress(returnState);
    }

    getButton(type) {
        if (type === 'uInfo') {
            if (this.state.selected === 'UInfo') {
                return <button className = "active"
                    onClick={() => this.updateStates({ screen: 'uInfo' }, { selected: 'UInfo' })}
                > Edit Profile
                </button>;
            }
            return <button
                onClick={() => this.updateStates({ screen: 'uInfo' }, { selected: 'UInfo' })}
            > Edit Profile
            </button>;
        } if (type === 'Sec') {
            if (this.state.selected === 'Sec') {
                return <button className = "active"
                    onClick={() => this.updateStates({ screen: 'Sec' }, { selected: 'Sec' })}
                > Security Settings
                </button>;
            }
            return <button
                onClick={() => this.updateStates({ screen: 'Sec' }, { selected: 'Sec' })}
            > Security Settings
            </button>;
        }
        if (this.state.selected === 'Comp') {
            return <button className = "active"
                onClick={() => this.updateStates({ screen: 'Comp' }, { selected: 'Comp' })}
            > Add Completed Courses
            </button>;
        }
        return <button
            onClick={() => this.updateStates({ screen: 'Comp' }, { selected: 'Comp' })}
        > Add Completed Courses
        </button>;
    }

    render() {
        return <header className ="VertNavBar">
            <nav className = "VertNavBar_navigation">
                <div></div>
                <div className = "spacer"/>
                <div className = "VertNavBar_navigation-items">
                    <ul>
                        <li>{this.getButton('uInfo')}</li>
                        <li>{this.getButton('Sec')}</li>
                        <li>{this.getButton('Comp')}</li>
                    </ul>
                </div>
            </nav>
        </header>;
    }
}
export default VertNavBar;
