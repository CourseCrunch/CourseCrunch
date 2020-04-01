import React from 'react';
import Link from 'next/link';
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
                    return <li><Link href='/login'><a>Login</a></Link></li>;
                }
            } else {
                return <>
                    <li><Link href = "/editProfile"><a>User Profile</a></Link></li>
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
                            <li><Link href = "#"><a>Course Reviews</a></Link></li>
                            <li><Link href = "/compare"><a>Compare Courses</a></Link></li>
                            <li><Link href = "/recommendations"><a>Course Recommendation</a></Link></li>
                            <li><Link href = "/dviz"><a>Course Evaluations</a></Link></li>
                            <li><Link href = "/instructor"><a>Instructor Search</a></Link></li>
                            {this.Greeting()}
                        </ul>
                    </div>
                </nav>
            </header>
        </>;
    }
}
export default NavBar;
