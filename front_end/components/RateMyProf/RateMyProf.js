import React from 'react';
import { Table } from 'semantic-ui-react';

import ReviewCard from '../ReviewCard/ReviewCard';
import './RateMyProf.css';

class RateMyProf extends React.Component {
    constructor(props) {
        super(props);
        this.state = { rmp: {} };
    }

    getProperty(propName) {
        if (propName in this.state.rmp) {
            return this.state.rmp[propName];
        }
        return 'N/A';
    }

    componentDidMount() {
        const params = new URLSearchParams({
            instructor: this.props.name,
        });
        fetch(`${process.env.BASE}:${process.env.EVALSPORT}/instructors/rmp/${this.props.campus}?${params.toString()}`)
            .then((out) => out.json())
            .then((result) => {
                this.setState({ rmp: result });
            }).catch(() => {
                this.setState({ rmp: null });
            });
    }

    render() {
        if (!('rmp' in this.state) || this.state.rmp == null) {
            return <h2 style={ { fontSize: 50 } }>No RateMyProf Data Found 😢</h2>;
        }
        return <div className="rmp-container">
            <h2 style={ { fontSize: 30, textAlign: 'center' } }>RateMyProf Ratings</h2>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell>Student Ratings</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Overall Score</Table.Cell>
                        <Table.Cell>{this.getProperty('averageratingscore_rf')}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>How Helpful is this Professor</Table.Cell>
                        <Table.Cell>{this.getProperty('averagehelpfulscore_rf')}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>How Easy is this Professor</Table.Cell>
                        <Table.Cell>{this.getProperty('averageeasyscore_rf')}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>How Clear is this Professor</Table.Cell>
                        <Table.Cell>{this.getProperty('averageclarityscore_rf')}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Total Number of Reviews</Table.Cell>
                        <Table.Cell>{this.getProperty('total_number_of_ratings_i')}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
            {('tag_s_mv' in this.state.rmp)
                && <h2 style={ { fontSize: 25, textAlign: 'center' } }>Students Say</h2>}
            <div className="tag-container">
                <ReviewCard tags={this.state.rmp.tag_s_mv}></ReviewCard>
            </div>
        </div>;
    }
}

export default RateMyProf;
