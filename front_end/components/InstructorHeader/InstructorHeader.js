import React from 'react';
import Avatar from 'react-avatar';

import './InstructorHeader.css';


class InstructorHeader extends React.Component {
    render() {
        return <div className="flex-container">
            <Avatar name={this.props.name}
                round={true}
                size="175"
                src={this.props.img}
            ></Avatar>
            <h2 style={ { fontSize: 50, marginLeft: 20 } }>{this.props.name}</h2>
        </div>;
    }
}

export default InstructorHeader;
