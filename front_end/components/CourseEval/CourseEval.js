import React from 'react';

import './CourseEval.css';
import { Table } from 'semantic-ui-react';

function getState(value) {
    if (typeof value !== 'number') {
        return <Table.Cell>N/A</Table.Cell>;
    }
    if (value > 4) {
        return <Table.Cell positive>{Math.round(value * 100) / 100}</Table.Cell>;
    }
    if (value > 2.5) {
        return <Table.Cell warning>{Math.round(value * 100) / 100}</Table.Cell>;
    }
    return <Table.Cell negative>{Math.round(value * 100) / 100}</Table.Cell>;
}

class CourseEval extends React.Component {
    constructor(props) {
        super(props);
        this.state = { evals: {} };
    }

    componentDidMount() {
        const params = new URLSearchParams({
            instructor: this.props.name,
        });
        fetch(`${process.env.BASE}${process.env.EVALSPORT}/instructors/eval/${this.props.campus}?${params.toString()}`)
            .then((out) => out.json())
            .then((result) => {
                this.setState({ evals: result });
            }).catch(() => {
                this.setState({ evals: null });
            });
    }

    render() {
        if (!('evals' in this.state) || this.state.evals == null) {
            return <h2 style={ { fontSize: 50 } }>No Evals Found :(</h2>;
        }
        let index = 0;
        return (
            <div className="eval-container">
                <h2 style={ { fontSize: 30, textAlign: 'center' } }>Course Evaluation Ratings</h2>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell>Student Ratings</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {Object.keys(this.state.evals).map((key) => {
                            index += 1;
                            return <Table.Row key={index}>
                                <Table.Cell>{key}</Table.Cell>
                                {getState(this.state.evals[key])}
                            </Table.Row>;
                        })}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

export default CourseEval;
