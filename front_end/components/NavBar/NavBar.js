import React from 'react';
import Head from 'next/head';
import logo from './logo2.png';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loaded: false };
    }

    Greeting() {
        if (this.state.loaded) {
            if (typeof window !== 'undefined') {
                if (localStorage.getItem('loggedIn') === null) {
                    return <li><a href='/login'>Login</a></li>;
                }
            } else {
                return <>
                    <li><a href="/editProfile">User Profile</a></li>
                    <li><label>Logout</label></li>
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
                    <div className = "NavBar_logo"><Link href = '/'><a><img src={logo} alt="Logo"/></a></Link></div>
                    <div className = "spacer"/>
                    <div className = "NavBar_navigation-items">
                        <ul>
                            <li><a href="#">Course Reviews</a></li>
                            <li><a href="/compare">Compare Courses</a></li>
                            <li><a href="/recommendations">Course Recommendation</a></li>
                            <li><a href="/dviz">Course Evaluations</a></li>
                            <li><a href="/instructor">Instructor Search</a></li>
                            {this.Greeting()}
                        </ul>
                    </div>
                </nav>
            </header>
        </>;
    }
}
export default NavBar;
