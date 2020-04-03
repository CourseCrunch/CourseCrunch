import React from 'react';
import Avatar from 'react-avatar';
import ClipLoader from 'react-spinners/ClipLoader';

import './InstructorHeader.css';


class InstructorHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true, img: null };
    }

    componentDidMount() {
        const params = new URLSearchParams({
            instructor: this.props.name,
        });
        fetch(`http://krishchow.me:${process.env.EVALSPORT}/instructors/pfp/${this.props.campus}?${params.toString()}`)
            .then((out) => out.json())
            .then((result) => {
                this.setState({ isLoading: false, img: result });
            }).catch(() => {
                this.setState({ isLoading: false, img: null });
            });
    }

    render() {
        return <div className="flex-container">
            {this.state.isLoading ? (
                <ClipLoader animation="border" size={150}
                    color={'#123abc'}
                    loading={this.state.isLoading}
                ></ClipLoader>
            )
                : (<>
                    <Avatar name={this.props.name}
                        round={true}
                        size="175"
                        src={this.state.img}
                    ></Avatar>
                    <h2 style={ { fontSize: 50, marginLeft: 20 } }>{this.props.name}</h2>
                </>)}
        </div>;
    }
}

export default InstructorHeader;
