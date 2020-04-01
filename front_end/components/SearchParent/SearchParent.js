import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import Link from 'next/link';

import InstructorSearch from '../InstructorSearch/InstructorSearch';

import '../../pages/index.css';

const campusOptions = [
    {
        key: 'utm',
        text: 'University of Toronto Missisauga',
        value: 'utm',
    },
    {
        key: 'utsg',
        text: 'University of Toronto Saint George',
        value: 'utsg',
    },
    {
        key: 'utsc',
        text: 'University of Scarbrough',
        value: 'utsc',
    },
    {
        key: 'grad',
        text: 'University of Toronto Graduate Programs',
        value: 'grad',
    },
    {
        key: 'all',
        text: 'All of University of Toronto',
        value: 'all',
    },
];

const esc = encodeURIComponent;


class SearchParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { campus: null, value: null, query: '' };
    }

    updateCampus(newCampus) {
        this.setState({ campus: newCampus.value });
    }

    updateInstructor(value) {
        const params = { fullname: value };
        const query = Object.keys(params)
            .map((k) => `${esc(k)}=${esc(params[k])}`)
            .join('&');
        this.setState({ value, query });
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        const { campus, query, value } = this.state;
        return (<div className = "container">
            <div className = "back"></div>
            <h1>Search Instructor</h1>
            <div className="buttonPanel">
                <div className="selectionBox">
                    <Dropdown
                        placeholder='Select School'
                        fluid
                        button
                        icon={false}
                        selection
                        options={campusOptions}
                        className="LeftBox"
                        onChange={(e, d) => this.updateCampus(d)}
                    />
                    <InstructorSearch campus={campus}
                        update={(newValue) => this.updateInstructor(newValue)}/>
                    <Link href={`/instructor/${campus}?${query}`}>
                        <a>
                            <Button size="huge"
                                style={{ width: '33vw', marginTop: '5vh' }}
                                disabled={value === null || value === ''}
                                onClick={() => console.log(value)}>
                                Search For Instructor!
                            </Button>
                        </a>
                    </Link>
                </div>
            </div>
        </div>);
    }
}

export default SearchParent;
