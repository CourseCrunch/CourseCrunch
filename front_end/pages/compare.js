import React from 'react';
import './index.css';
import './hover.css';
import NavBar from '../components/NavBar/NavBar';


class Comparison extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: 'temp data',
        };
    }

    buttonClickHandler() {
        fetch('http://localhost:3007/')
            .then((out) => out.json())
            .then((result) => {
                this.setState({ data: courses });
            }).catch((error) => {
                console.log(error);
                console.log('promise failed');
            });
    }

    render() {
        return (<div>
            <NavBar isLoggedIn = {false}/>
            <div className = "container">
                <input type="text" placeholder="Course code "/>
                <button onClick={() => this.buttonClickHandler()}>
                    search
                </button>
                <p>{this.state.data}</p>

            </div>
        </div>

        );
    }
}


const Compare = () => (
    <Comparison/>
);


export default Compare;
