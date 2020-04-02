import React from 'react';
import './index.css';
import './hover.css';
import Router from 'next/router';
import NavBar from '../components/NavBar/NavBar';

import InstructorTable from '../components/InstructorTable/InstructorTable';


class Comparison extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        };
        this.buttonClickHandler = this.buttonClickHandler.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('loggedIn') === null) {
                Router.push('/login');
            }
        }
    }

    searchChangeHandler(event) {
        this.setState({ searchText: event.target.value });
    }

    buttonClickHandler() {
        fetch(`http://localhost:3007/compare/instructors/${this.state.searchText}`)
            .then((out) => out.json())
            .then((result) => {
                console.log(result);
                this.setState({ data: result });
            }).catch((error) => {
                console.log(error);
                console.log('promise failed');
            });
    }

    render() {
        return (<div>
            <NavBar isLoggedIn = {false}/>
            <div className = "container">
                <input type="text" onInput={this.searchChangeHandler} placeholder="Course code"/>
                <button onClick={this.buttonClickHandler}>
                    search
                </button>
                <InstructorTable data={this.state.data}/>
            </div>
        </div>
        );
    }
}


const Compare = () => (
    <Comparison/>
);


export default Compare;
