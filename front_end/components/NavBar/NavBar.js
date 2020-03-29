import React from 'react';
import Link from 'next/link';
import './NavBar.css';

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
        return <header className ="NavBar">
            <nav className = "NavBar_navigation">
                <div className = "NavBar_logo"><Link href = '/'><a>THE LOGO</a></Link></div>
                <div className = "spacer"/>
                <div className = "NavBar_navigation-items">
                    <ul>
                        <li><label>CGPA Calculator</label></li>
                        <li><label>Course Review</label></li>
                        <li><Link href = "/recommendations"><a>Course Recommendation</a></Link></li>
                        <li><Link href = "/instructor"><a>Instructor Search</a></Link></li>
                        {this.Greeting()}
                    </ul>
                </div>
            </nav>
        </header>;
    }
}
export default NavBar;
