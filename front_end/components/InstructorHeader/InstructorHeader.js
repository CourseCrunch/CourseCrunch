import React from 'react';
import Avatar from 'react-avatar';

import './InstructorHeader.css';


class InstructorHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { img: null };
    }

    componentDidMount() {
        // const params = new URLSearchParams({
        //     instructor: this.props.name,
        // });
        // fetch(`http://localhost:${process.env.EVALSPORT}/instructors/pfp/${this.props.campus}?${params.toString()}`)
        //     .then((out) => out.json())
        //     .then((result) => {
        //         console.log(result);
        //         this.setState({ img: result });
        //     }).catch(() => {
        //         this.setState({ img: null });
        //     });
    }

    render() {
        console.log(this.state);
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
