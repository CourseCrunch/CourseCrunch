import React from 'react';
import Link from 'next/link';
import './NavBar.css';

function Greeting(props) {
    const { isLoggedIn } = props;
    if (!isLoggedIn) {
        return <li><label>Login</label></li>;
    }
    return <><li><Link href = "/editProfile"><a>User Profile</a></Link></li>
        <li><label>Logout</label></li></>;
}
class NavBar extends React.Component {
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
                        <li><Link href = "/recommendations"><a>Course Recommendation</a></Link></li>
                        {Greeting(this.props)}
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
