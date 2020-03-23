import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table-6'
import "react-table-6/react-table.css";
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
                datasets:[{
                            label: props.data.title,
                            data: props.data.data,
                         }]
            }
        }
    }

    getStyle = () => {
        return {
            background: '#f4f4f4',
            padding: '10px',
            borderBottom: '1px #ccc dotted',
        }
    }

    toColumns(labels){
        var i;
        var columns = [];
        for (i = 0; i < labels.length; i++) {
        }
    }

    sizeLimit() {
        if (this.props.data.data.length > 10) {
            return 10;
        }
        return this.props.data.data.length;
    }

    render () {
        return (
        <div style={ this.getStyle() }>
            <button onClick={this.props.delItem.bind(this, this.state.id)} style={btnStyle}>x</button>
            {this.props.title}<br/>
            <ReactTableDraggableColumns
            defaultPageSize={this.sizeLimit()}
            draggableColumns= {{
                mode: 'reorder',
                draggable: ['Code', 'Dept', 'Course', 'First_Name', 'Last_Name', 'Term'],
                enableColumnWideDrag: false
            }}
            style={{width: '98vw'}}
            data={this.props.data.data}
            columns={[
                {
                    Header: 'Code',
                    accessor: 'Code',
                },
                {
                    Header: 'Department',
                    accessor: 'Dept',
                },
                {
                    Header: 'Course',
                    accessor: 'Course',
                },
                {
                    Header: 'L.Name',
                    accessor: 'Last_Name',
                },
                {
                    Header: 'F.Name',
                    accessor: 'First_Name',
                },
                {
                    Header: 'Term',
                    accessor: 'Term',
                },
                {
                    Header: 'Year',
                    accessor: 'Year',
                },
                {
                    Header: 'Intellectually Stimulating',
                    accessor: 'Item_1',
                }
            ]}
            showPagination={this.props.data.data.length > 10}
            />
            </div>
        )
    }
}

// PropTypes
TableItem.propTypes = {
    data: PropTypes.object.isRequired
}

const btnStyle = {
    background: '#ff0000',
    color: '#fff',
    border: 'none',
    padding: '5px 9px',
    borderRadius: '50%',
    cursor: 'pointer',
    float: 'right'
}

export default TableItem;
