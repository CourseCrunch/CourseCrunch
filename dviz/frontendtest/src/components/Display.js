import React from 'react';

import ChartItem from './ChartItem';

import PropTypes from 'prop-types';

class Display extends React.Component {
    render() {
        return this.props.data.map((d) => (
            <div>
            <ChartItem key={d.id} data={d} delItem={this.props.delItem}/>
            </div>
        ));
    }
  }

// PropTypes
Display.propTypes = {
    data: PropTypes.array.isRequired
}
  
export default Display;
