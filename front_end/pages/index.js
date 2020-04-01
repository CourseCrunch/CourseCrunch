import Link from 'next/link';
import Head from 'next/head';
import NavBar from '../components/NavBar/NavBar';
import Router from 'next/router';

import './index.css';
import './hover.css';

class Index extends React.Component {

    constructor(props) {
        super(props);
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('loggedIn') === null) {
                Router.push('/login');
            }
        }
    }


    render() {
        return (
            <div>
                <NavBar isLoggedIn = {true}/>
                <div className = "container">
                    <div className = "back"></div>
                    <h1>Course Crunch</h1>
                    <div className = "buttonPanel">
                        <ul className="buttonList">
                            <li><button className ="hvr-grow">Course Recommendations</button></li>
                            <li><button className ="hvr-grow">PLACE HOLDER</button></li>
                            <li><button className ="hvr-grow">PLACE HOLDER</button></li>
                            <li><button className ="hvr-grow"> PLACE HOLDER</button></li>
                            <li><button className ="hvr-grow">PLACE HOLDER</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default function IndexPage() {
    return (
        <Index/>
    );
}
