import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import logo from './logo2.png';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loaded: false };
    }

    // eslint-disable-next-line class-methods-use-this
    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userid');
        }
    }

    Greeting() {
        if (this.state.loaded) {
            if (typeof window !== 'undefined') {
                if (localStorage.getItem('loggedIn') === null) {
                    return <li><a href='/login'>Login</a></li>;
                }
                return <>
                    <li><a href="/editProfile">User Profile</a></li>
                    <li><Link href="/"><a onClick={this.logout}>Logout</a></Link></li>
                </>;
            }
        }
        return null;
    }

    componentDidMount() {
        this.setState({ loaded: true });
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return <>
            <Head>
                <link rel="shortcut icon" href="/static/favicon.ico" />
                <link href="https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css" rel="stylesheet" key="test"/>
            </Head>
            <header className ="NavBar">
                <nav className = "NavBar_navigation">
                    <div className = "NavBar_logo"><a href = '/'><img src={logo} alt="Logo"/></a></div>
                    <div className = "spacer"/>
                    <div className = "NavBar_navigation-items">
                        <ul>
                            <li><a href = "/compare">Compare Courses</a></li>
                            <li><a href = "/recommendations">Course Recommendation</a></li>
                            <li><a href = "/dviz">Course Evaluations</a></li>
                            <li><a href = "/waitlist">Waitlists</a></li>
                            <li><a href = "/instructor">Instructor Search</a></li>
                            {this.Greeting()}
                        </ul>
                    </div>
                </nav>
            </header>
        </>;
    }
}
export default NavBar;
