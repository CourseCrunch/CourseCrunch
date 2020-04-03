import _ from 'lodash';
import React from 'react';
import Head from 'next/head';

import { Dropdown } from 'semantic-ui-react';

class Filter extends React.Component {
    constructor(props) {
        super(props);
        const { onChange } = props;
        this.onChange = onChange;
        this.state = { courseCodes: [] };
    }

    componentDidMount() {
        fetch(`${process.env.BASE}:${process.env.EVALSPORT}/courses`)
            .then((out) => out.json())
            .then((result) => {
                let courses = [];
                Object.entries(JSON.parse(JSON.stringify(result))).forEach(([, value]) => {
                    /* eslint no-underscore-dangle: ["error", {"allow": ["_id"]}] */
                    courses.push(value._id);
                });

                courses = courses.sort();
                const courseOptions = _.map(courses, (course) => ({
                    key: course,
                    text: course,
                    value: course,
                }));

                this.setState({ courseCodes: courseOptions });
            }).catch(() => {
                console.log('promise failed');
            });
    }

    render() {
        return <>
            <Head>
                <title>{this.props.campus}</title>
            </Head>
            <Dropdown
                placeholder='Filtered Courses'
                fluid
                multiple
                search
                selection
                options={this.state.courseCodes}
                onChange={this.onChange}/>
        </>;
    }
}

export default Filter;
