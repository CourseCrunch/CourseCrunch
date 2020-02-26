import React, { Component } from 'react';
import axios from 'axios';
//import PropTypes from 'prop-types';

export class Dataq extends Component {
    state = {
        script: ""
    }

    componentDidMount() {
        console.log(this.props.dataq[0].id);
        axios.get('http://localhost:3000/viz/cours/CSC108/' + this.props.dataq[0].id)
          .then(res => {
            this.setState({script: res.data})
          });
      }

    render() {
        return (
            <div>
                <canvas id={this.props.dataq[0].id}  width="600" height="400"></canvas>
                <script>{this.state.script}</script>
            </div>
        )
    }
}

export default Dataq
