import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table-6';
import './del.css';
import 'react-table-6/react-table.css';
import withDraggableColumns from 'react-table-hoc-draggable-columns';
import 'react-table-hoc-draggable-columns/dist/styles.css';

const ReactTableDraggableColumns = withDraggableColumns(ReactTable);

export class TableItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.data.id,
            chartData: {
                labels: props.data.labels,
                datasets: [{
                    label: props.data.title,
                    data: props.data.data,
                }],
            },
        };
    }

    getStyle = () => ({
        background: '#f4f4f4',
        padding: '10px',
        borderBottom: '1px #ccc dotted',
    })

    toColumns(labels) {
        let i;
        const columns = [];
        for (i = 0; i < labels.length; i++) {
        }
    }

    sizeLimit() {
        if (this.props.data.data.length > 10) {
            return 10;
        }
        return this.props.data.data.length;
    }

    getHeaderProps() {
        return { whiteSpace: 'normal !important', overflow: 'unset' };
    }

    render() {
        return (
            <div style={ this.getStyle() }>
                {this.props.title}
                <button id='delbut' onClick={this.props.delItem.bind(this, this.state.id)}>x</button><br/><br/>
                <ReactTableDraggableColumns
                    defaultPageSize={this.sizeLimit()}
                    draggableColumns= {{
                        mode: 'reorder',
                        draggable: ['Code', 'Dept', 'Course', 'First_Name', 'Last_Name', 'Term'],
                        enableColumnWideDrag: false,
                    }}
                    style={{ width: '100%' }}
                    data={this.props.data.data}
                    columns={[
                        {
                            Header: () => <div>Code</div>,
                            accessor: 'Code',
                            style: { whiteSpace: 'unset' },
                        },
                        {
                            Header: () => <div>Department</div>,
                            accessor: 'Dept',
                            style: { whiteSpace: 'unset' },
                        },
                        {
                            Header: () => <div>Course</div>,
                            accessor: 'Course',
                        },
                        {
                            Header: () => <div>L. Name</div>,
                            accessor: 'Last_Name',
                        },
                        {
                            Header: () => <div>F. Name</div>,
                            accessor: 'First_Name',
                        },
                        {
                            Header: () => <div>Term</div>,
                            accessor: 'Term',
                            minWidth: 80,
                        },
                        {
                            Header: () => <div>Year</div>,
                            accessor: 'Year',
                            minWidth: 50,
                        },
                        {
                            Header: () => <div>Intellectually <br/>Stimulating</div>,
                            accessor: 'Item_1',
                            minWidth: 120,
                        },
                        {
                            Header: () => <div>Depth</div>,
                            minWidth: 60,
                            accessor: 'Item_2',
                        },
                        {
                            Header: () => <div>Learning <br/>Atmosphere</div>,
                            minWidth: 100,
                            accessor: 'Item_3',
                        },
                        {
                            Header: () => <div>Course Work<br/>Improved Learning</div>,
                            minWidth: 140,
                            accessor: 'Item_5',
                        },
                        {
                            Header: () => <div>Course Work<br/>Relevance</div>,
                            minWidth: 100,
                            accessor: 'Item_5',
                        },
                        {
                            Header: () => <div>Course<br/>Quality</div>,
                            minWidth: 80,
                            accessor: 'Item_6',
                        },
                        {
                            Header: () => <div>Course<br/>Workload</div>,
                            minWidth: 80,
                            accessor: 'Item_7',
                        },
                        {
                            Header: () => <div>Recommendation<br/>Score</div>,
                            minWidth: 80,
                            accessor: 'Item_8',
                        },
                        {
                            Header: () => <div>Attendance</div>,
                            minWidth: 80,
                            accessor: 'Item_9',
                        },
                        {
                            Header: () => <div>Learning<br/>Incentive</div>,
                            minWidth: 80,
                            accessor: 'Item_10',
                        },
                        {
                            Header: () => <div>Number<br/>Invited</div>,
                            minWidth: 80,
                            accessor: 'Item_11',
                        },
                        {
                            Header: () => <div>Number of<br/>Survey Responses</div>,
                            minWidth: 120,
                            accessor: 'Item_12',
                        },
                        {
                            Header: 'Department',
                            accessor: 'Department',
                        },
                    ]}
                    showPagination={this.props.data.data.length > 10}
                />
            </div>
        );
    }
}

// PropTypes
TableItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default TableItem;
