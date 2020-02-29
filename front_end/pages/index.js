import NavBar from '../components/NavBar/NavBar';
import './index.css';
import './hover.css';

const Index = () => (
    <div>
        <NavBar isLoggedIn = {false}/>
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

export default Index;
