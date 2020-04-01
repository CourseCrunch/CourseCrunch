import React from 'react';
import _ from 'lodash';
import fetch from 'isomorphic-unfetch';
import { Search } from 'semantic-ui-react';

const initialState = { isLoading: false, results: [], value: '' };


class InstructorSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.state.source = [];
        this.state.timer = null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.campus !== this.props.campus) {
            this.setState({ isLoading: true });
            fetch('http://localhost:3007/instructors/allInstructors',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ campus: this.props.campus }),
                }).then((data) => data.json()).then((json) => {
                this.setState({ source: json, isLoading: false });
            });
        }
    }

    handleResultSelect = (e, { result }) => {
        this.props.update(result.title);
        this.setState({ value: result.title });
    };

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });
        if (this.state.timer === null) {
            this.props.update(value);
            const timer = setTimeout(() => {
                if (this.state.value.length < 1) {
                    this.setState({
                        isLoading: false,
                        results: [],
                        value: '',
                        timer: null,
                    });
                    return;
                }
                const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
                const isMatch = (result) => re.test(result.title);

                const filteredResults = _.reduce(
                    this.state.source,
                    (memo, data, name) => {
                        const results = _.filter(data.results, isMatch);
                        if (results.length) {
                            // eslint-disable-next-line no-param-reassign
                            memo[name] = { name, results };
                        }
                        return memo;
                    },
                    {},
                );

                this.setState({
                    isLoading: false,
                    results: filteredResults,
                    timer: null,
                });
            }, 300);
            this.setState({ timer });
        }
    }

    render() {
        const { isLoading, value, results } = this.state;
        return <Search
            category
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true,
            })}
            results={results}
            value={value}
            className="RightBox"
            size="huge"
            icon={this.props.campus === null ? 'exclamation circle' : 'search'}
            disabled={this.props.campus === null}
        />;
    }
}


export default InstructorSearch;
