import React from 'react';
import './index.css';
import './hover.css';
// import './recommendations.css';
import WeekCalendar from 'react-week-calendar';
import moment from 'moment';
import CustomModal from '../components/CustomModal/CustomModal';
import 'react-week-calendar/dist/style.css';
import NavBar from '../components/NavBar/NavBar';

import Filter from '../components/Filter/Filter';


class Recommendations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            lastUid: -1,
            selectedIntervals: [],
            randomJson: [],
            selectedFilters: []
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
        alert(this.state.selectedCourses);
        alert(this.state.selectedIntervals);
    }


    onChange = (event, {value}) =>{
        this.setState({selectedCourses:value});
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
                    firstDay = {moment().day('Monday')}
                    modalComponent = {CustomModal}
                />
                <button onClick={this.handleClick}>Send Schedule</button>
                <ul>
                     {this.state.randomJson.map((results) => <li>{results.name.first}</li>)}
                </ul>
                <Filter onChange = {this.onChange} />

            </div>
        </div>

        );
    }
}


const Recommend = () => (
    <Recommendations/>
);


export default Recommend;
