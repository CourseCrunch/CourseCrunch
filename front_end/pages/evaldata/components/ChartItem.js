import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import PropTypes from 'prop-types';

export class ChartItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.data.id,
            chartData: {
                labels: props.data.labels,
                datasets:[{
                            label: props.data.title,
                            data: props.data.data,
                         }]
            }
        }
    }

    getStyle = () => {
        return {
            background: '#f4f4f4',
            padding: '10px',
            borderBottom: '1px #ccc dotted',
        }
    }


    render() {
        return (
            <div style={ this.getStyle() }>
                <button onClick={this.props.delItem.bind(this, this.state.id)} style={btnStyle}>x</button>
                <Line
                    data={this.state.chartData}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
                
            </div>
        )
    }
}

// PropTypes
ChartItem.propTypes = {
    data: PropTypes.object.isRequired
}

const btnStyle = {
    background: '#ff0000',
    color: '#fff',
    border: 'none',
    padding: '5px 9px',
    borderRadius: '50%',
    cursor: 'pointer',
    float: 'right'
}

export default ChartItem;
