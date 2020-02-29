import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table-6'
import "react-table-6/react-table.css";
import withDraggableColumns from 'react-table-hoc-draggable-columns';
import 'react-table-hoc-draggable-columns/dist/styles.css';
const ReactTableDraggableColumns = withDraggableColumns(ReactTable);

export class TableItem extends Component {

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

    render () {
        return (
        <div style={ this.getStyle() }>
            <button onClick={this.props.delItem.bind(this, this.state.id)} style={btnStyle}>x</button>
            {this.props.title}<br/>
            <ReactTableDraggableColumns
            defaultPageSize={1}
            draggableColumns= {{
                mode: 'reorder',
                draggable: this.state.labels,
                enableColumnWideDrag: false
            }}
            style={{width: '98vw'}}
            data={this.state.data}
            columns={[
                {
                Header: 'First Name',
                accessor: 'firstName',
                },
                {
                Header: 'Last Name',
                accessor: 'lastName',
                },
                {
                Header: 'age',
                accessor: 'age',
                }
            ]}
            showPagination={false}
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
