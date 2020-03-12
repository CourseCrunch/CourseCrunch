import React from 'react';
import '../../front_end/pages/index.css';
import '../../front_end/pages/hover.css';
import WeekCalendar from 'react-week-calendar';
import NavBar from '../../front_end/components/NavBar/NavBar';

class Waitlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            lastUid: -1,
            selectedIntervals: [],
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
          fetch('https://randomuser.me/api/?results=10', {
              method: 'GET',
              params: this.state.selectedIntervals,
          })
              .then((response) => response.json())
              .then(
                  (data) => {
                      this.setState({ randomJson: data.results });
                  },
              );
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
              </div>
          </div>
          );
      }
}

const Recommend = () => (
    <Recommendations/>
);

export default Recommend;
