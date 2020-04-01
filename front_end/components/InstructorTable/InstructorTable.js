import _ from 'lodash';
import React from 'react';
import Head from 'next/head';

import { Table } from 'semantic-ui-react';

class InstructorTable extends React.Component {
    constructor(props) {
        super(props);
        const { data } = props;
    }


    render() {
        if (this.props.data == null) {
            return null;
        }

        console.log('in render');
        console.log(this.props.data.length);
        console.log(this.props.data);

        const rows = [];

        const roundDecimal = (x) => Math.round(x * 100) / 100;

        for (let i = 0; i < this.props.data.length; i++) {
            rows.push(
                <Table.Row>
                    <Table.Cell>{this.props.data[i]._id}</Table.Cell>
                    <Table.Cell>{this.props.data[i].lectures_taught}</Table.Cell>
                    <Table.Cell>{roundDecimal(this.props.data[i].workload)}</Table.Cell>
                    <Table.Cell>{roundDecimal(this.props.data[i].recommendation)}</Table.Cell>
                    <Table.Cell>{roundDecimal(this.props.data[i]['Intellectually stimulating'])}</Table.Cell>
                    <Table.Cell>{roundDecimal(this.props.data[i]['Deeper Understanding'])}</Table.Cell>
                    <Table.Cell>{roundDecimal(this.props.data[i]['Good Atmosphere'])}</Table.Cell>
                    <Table.Cell>{roundDecimal(this.props.data[i]['Good Assessments'])}</Table.Cell>
                    <Table.Cell>{roundDecimal(this.props.data[i]['Accurate Assessments'])}</Table.Cell>
                    <Table.Cell>{roundDecimal(this.props.data[i]['Quality of Learning'])}</Table.Cell>
                    <Table.Cell>{this.props.data[i].number_invited}</Table.Cell>
                    <Table.Cell>{this.props.data[i].responses}</Table.Cell>
                </Table.Row>,
            );
        }

        return <>
            <Head>
                <link href="https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css" rel="stylesheet" key="instructortable"/>
            </Head>

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Lectures Taught</Table.HeaderCell>
                        <Table.HeaderCell>Workload</Table.HeaderCell>
                        <Table.HeaderCell>Would Recommend</Table.HeaderCell>

                        <Table.HeaderCell>Intellectually Stimulating</Table.HeaderCell>
                        <Table.HeaderCell>Deeper Understanding</Table.HeaderCell>
                        <Table.HeaderCell>Good Atmosphere</Table.HeaderCell>
                        <Table.HeaderCell>Good Assessments</Table.HeaderCell>
                        <Table.HeaderCell>Accurate Assessments</Table.HeaderCell>
                        <Table.HeaderCell>Quality of Learning</Table.HeaderCell>
                        <Table.HeaderCell>Number Invited</Table.HeaderCell>
                        <Table.HeaderCell>Number Responses</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rows}
                </Table.Body>
            </Table>
        </>;
    }
}

export default InstructorTable;
