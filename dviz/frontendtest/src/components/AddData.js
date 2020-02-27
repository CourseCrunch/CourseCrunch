import React, { Component } from 'react'
import axios from 'axios';

export class AddData extends Component {
    state = {
        title: '',
        labels: [],
        data: []
    }

    onSubmit = (e) => {
        e.preventDefault();
        axios.get('http://localhost:3000/viz/cours/' + this.state.title)
          .then(res => {
            this.setState({labels: res.data.labels});
            this.setState({data: res.data.data});
            this.props.addData(this.state.title, this.state.labels, this.state.data);
        })
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            <form onSubmit={this.onSubmit} style={{ display: 'flex' }}>
                <input 
                type="text"
                name="title"
                style={{ flex: '10', padding: '5px' }}
                placeholder="Ex. CSC08 ..."
                value={this.state.title}
                onChange={this.onChange}
                />
                <input
                type="submit"
                value="Submit"
                className="btn"
                style={{flex: '1'}}
                />
            </form>
        )
    }
}

export default AddData;