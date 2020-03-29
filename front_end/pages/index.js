import Link from 'next/link';
import Head from 'next/head';
import NavBar from '../components/NavBar/NavBar';
import './index.css';
import './hover.css';

const Index = () => (
    <div>
        <Head>
            <style>{'body,html { height:100% }'}</style>
            <link href="https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css" rel="stylesheet" key="test"/>
        </Head>
        <NavBar isLoggedIn = {true}/>
        <div className = "container">
            <div className = "back"></div>
            <h1>Course Crunch</h1>
            <div className = "buttonPanel">
                <ul className="buttonList">
                    <li><Link href="/recommendations"><button className ="hvr-grow">Course Recommendations</button></Link></li>
                    <li><Link href="#"><button className ="hvr-grow">PLACE HOLDER</button></Link></li>
                    <li><Link href="/instructor"><button className ="hvr-grow">View Instructors</button></Link></li>
                    <li><button className ="hvr-grow"> PLACE HOLDER</button></li>
                    <li><button className ="hvr-grow">PLACE HOLDER</button></li>
                </ul>
            </div>
        </div>
    </div>
);

export default Index;
