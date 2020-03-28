import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import Filter from '../components/Filter/Filter';
import './index.css';
import './hover.css';
// import './recommendations.css';
import WeekCalendar from 'react-week-calendar';
import moment from 'moment';
import CustomModal from '../components/CustomModal/CustomModal';
import 'react-week-calendar/dist/style.css';


class Recommendations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            lastUid: -1,
            selectedIntervals: [],
            selectedFilters: [],
            selectedCourses: [],
        };
    }

    handleEventRemove = (event) => {
        const { selectedIntervals } = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            selectedIntervals.splice(index, 1);
            this.setState({ selectedIntervals });
        }
    }

    handleEventUpdate = (event) => {
        const { selectedIntervals } = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            selectedIntervals[index] = event;
            this.setState({ selectedIntervals });
        }
    }

    handleClick = () => {
        const data = {
            courses: this.state.selectedCourses,
            limit: 25,
            timings: this.state.selectedIntervals,
        };
        fetch('http://localhost:3007/recommendation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => response.json()).then((result) => result.filter(Boolean)).then((response) => {
            console.log(response);
            this.setState({ results: response });
        });
    }


    onChange = (event, { value }) => {
        this.setState({ selectedCourses: value });
        console.log(value);
    }

    handleSelect = (newIntervals) => {
        const { lastUid, selectedIntervals } = this.state;
        const intervals = newIntervals.map((interval, index) => ({
            ...interval,
            uid: lastUid + index,
        }));

        this.setState({
            selectedIntervals: selectedIntervals.concat(intervals),
            lastUid: lastUid + newIntervals.length,
        });
    }

    render() {
        return (<div>
            <NavBar isLoggedIn = {false}/>
            <div className = "container">
                <WeekCalendar
                    startTime = {moment({ h: 9, m: 0 })}
                    endTime = {moment({ h: 20, m: 0 })}
                    scaleUnit ={60}
                    cellHeight = {50}
                    numberOfDays= {5}
                    selectedIntervals = {this.state.selectedIntervals}
                    onIntervalSelect = {this.handleSelect}
                    onIntervalUpdate = {this.handleEventUpdate}
                    onIntervalRemove = {this.handleEventRemove}
                    dayFormat = {'dddd'}
                    firstDay = {moment().day('Monday').year('2020')}
                    modalComponent = {CustomModal}
                />
                <button onClick={this.handleClick}>Send Schedule</button>
                <Filter onChange = {this.onChange} />
                <ul>
                    {this.state.results.map((results) => <li key={results._id} >{results._id}</li>)}
                </ul>

            </div>
        </div>

        );
    }
}


const Recommend = () => (
    <Recommendations/>
);


export default Recommend;
