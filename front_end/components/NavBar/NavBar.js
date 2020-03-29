import React from 'react';
import Link from 'next/link';

class NavBar extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userid');
        }
    }

    Greeting() {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('loggedIn') === null) {
                return <li><Link href='/login'><a>Login</a></Link></li>;
            }
            return <><li><Link href = "/editProfile"><a>User Profile</a></Link></li>
                <li><Link href='/'><a onClick={this.logout}>Logout</a></Link></li></>;
        }
        return null;
    }

    render() {
        return <header className ="NavBar">
            <nav className = "NavBar_navigation">
                <div></div>
                <div className = "NavBar_logo"><Link href = '/'><a>THE LOGO</a></Link></div>
                <div className = "spacer"/>
                <div className = "NavBar_navigation-items">
                    <ul>
                        <li><label>CGPA Calculator</label></li>
                        <li><label>Course Review</label></li>
                        <li><Link href = "/compare"><a>Compare courses</a></Link></li>
                        <li><Link href = "/recommendations"><a>Course Recommendation</a></Link></li>
                        <li><Link href = "/dviz"><a>Course Evaluations</a></Link></li>
                        {this.Greeting(this.props)}
                    </ul>
                </div>
            </nav>
        </header>;
    }
}
export default NavBar;
/*
function Greeting(props){
    const isLoggedIn = props.isLoggedIn;
    if (!isLoggedIn){
        return <li><label>Login</label></li>
    }
    return <li><label>Logout</label></li>
}
const NavBar = props => (
    <header className ="NavBar">
        <nav className = "NavBar_navigation">
            <div></div>
            <div className = "NavBar_logo"><Link href = '/'><a>THE LOGO</a></Link></div>
            <div className = "spacer"/>
            <div className = "NavBar_navigation-items">
                <ul>
                    <li><label>CGPA Calculator</label></li>
                    <li><label>Course Review</label></li>
                    <li><label>Course Recommendation</label></li>
                    <li><label>User Profile</label></li>
                    <Greeting isLoggedIn = {props}/>
                </ul>
            </div>
        </nav>
    </header>
);

export default NavBar;
*/
