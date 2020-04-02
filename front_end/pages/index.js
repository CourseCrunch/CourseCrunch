import React from 'react';
import Head from 'next/head';
import { Button } from 'semantic-ui-react';
import Router from 'next/router';
import NavBar from '../components/NavBar/NavBar';

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


    // eslint-disable-next-line class-methods-use-this
    render() {
        return (<div>
            <Head>
                <style>{'body,html { height:100% }'}</style>
                <link href="https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css" rel="stylesheet" key="test"/>
                <title>Course Crunch</title>
            </Head>
            <NavBar isLoggedIn = {true}/>
            <div className = "container">
                <div className = "back"></div>
                <h1>Course Crunch</h1>
                <div className = "buttonPanel">
                    <ul className="buttonList">
                        <li><a href='/recommendations'><Button className ="hvr-grow">Course Recommendations</Button></a></li>
                        <li><a href="/instructor"><Button className ="hvr-grow">View Instructors</Button></a></li>
                        <li><a href="/compare"><Button className ="hvr-grow"> Compare Courses</Button></a></li>
                        <li><a href="/dviz"><Button className ="hvr-grow">Course Evaluations</Button></a></li>
                    </ul>
                </div>
            </div>
        </div>);
    }
}

export default function IndexPage() {
    return (
        <Index/>
    );
}
