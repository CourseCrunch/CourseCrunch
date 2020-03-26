import React from 'react';
import { Table } from 'semantic-ui-react';

import ReviewCard from '../../components/ReviewCard/ReviewCard';
import './RateMyProf.css';

class RateMyProf extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    getProperty(propName) {
        if (propName in this.props.rmp) {
            return this.props.rmp[propName];
        }
        return 'N/A';
    }

    render() {
        if (!('rmp' in this.props) || this.props.rmp == null) {
            return <h2 style={ { fontSize: 50 } }>No RateMyProf Data Found :(</h2>;
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
            {('tag_s_mv' in this.props.rmp)
                && <h2 style={ { fontSize: 25, textAlign: 'center' } }>Students Say</h2>}
            <div className="tag-container">
                <ReviewCard tags={this.props.rmp.tag_s_mv}></ReviewCard>
            </div>
        </div>;
    }
}

export default RateMyProf;
