import React from 'react';

import PropTypes from 'prop-types';
import ChartItem from './ChartItem';
import TableItem from './TableItem';


class Display extends React.Component {
    createItem(d) {
        if (d.isChart) {
            return <ChartItem key={d.id} data={d} delItem={this.props.delItem}/>;
        }
        return <TableItem key={d.id} data={d} delItem={this.props.delItem}/>;
    }

    render() {
        return this.props.data.map((d) => (
            <div key={d.id}>
                {this.createItem(d)}
            </div>
        ));
    }
}

// PropTypes
Display.propTypes = {
    data: PropTypes.array.isRequired,
};

export default Display;
