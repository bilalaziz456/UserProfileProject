import React, {Component} from 'react';
import AddSearchFilter from './AddSearchFilters'

const SEARCH = 'http://127.0.0.1:3000/search';
const GET_IMAGE_PATH = 'http://127.0.0.1:3000/';
const GET_SUGGESTION = 'http://127.0.0.1:3000/getSuggestion';


class SearchUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            data: [],
            suggestions: [],
            value: '',
            getSuggestion: [],
            sendData: [{
                skill: '',
                fromRating: '',
                toRating: '',
                fromInterest: '',
                toInterest: '',
                fromExperience: '',
                toExperience: ''
            }],
            bool: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);

    }

    componentDidMount() {
        fetch(GET_SUGGESTION).then((res) => {
            res.json().then((value) => {
                this.setState({
                    getSuggestion: value
                })
            })
        });
    }


    search(e) {
        fetch(SEARCH, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
               sendData : this.state.sendData
            })
        }).then((res) => {
            res.json().then((result) => {
                if (result.message) {
                    this.setState({
                        bool: false,
                        message: result.message
                    })
                } else {

                    this.setState({
                        bool: true,
                        data: result.map((value, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <img src={GET_IMAGE_PATH + value.image_path}/>
                                    </td>
                                    <td>
                                        <a href={'/p/' + value.user_uuid}
                                           target="_blank">{value.first_name + ' ' + value.last_name}</a>
                                    </td>
                                    <td>{value.login_id}</td>
                                </tr>
                            )
                        })
                    })
                }
            })
        });
        e.preventDefault()
    }

    handleChange(searchIndex, searchObject) {
        let manipulateData = this.state.sendData;
        manipulateData[searchIndex] = searchObject;
        this.setState({
            sendData: manipulateData
        })
    }


    addFilter(e) {
        let manipulate = this.state.sendData;
        manipulate.push({
            skill: '',
            fromRating: '',
            toRating: '',
            fromInterest: '',
            toInterest: '',
            fromExperience: '',
            toExperience: ''
        });
        this.setState({
            filter: manipulate
        });
        e.preventDefault()
    }

    removeFilter(index) {
        let manipulateData = this.state.sendData;
        manipulateData.splice(index, 1);
        this.setState({
            sendData: manipulateData
        });
    }

    render() {
        if (this.state.bool === true) {
            return (
                <div className="container">
                    <button className="btn btn-primary float-right button-top" onClick={this.addFilter}>+Add Filter</button>
                    <h1 className="top">Search Users</h1>
                    <div>
                        {
                            this.state.sendData.map((value, index) => {
                                return (
                                    <AddSearchFilter
                                        key={Math.random()} id={index} value={value} options={this.state.getSuggestion}
                                        removeFilter={this.removeFilter} handleSearchChange={this.handleChange}
                                    />

                                )
                            })
                        }
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-2">
                            <button className='btn btn-primary search-button' onClick={this.search}>Search</button>
                        </div>
                    </div>
                    <table className="table table-bordered text-center top">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.data}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <button className="btn btn-primary float-right button-top" onClick={this.addFilter}>+Add Filter
                    </button>
                    <h1 className="top">Search Users</h1>
                    <div>
                        {
                            this.state.sendData.map((value, index) => {
                                return (
                                    <AddSearchFilter
                                        key={Math.random()} id={index} value={value} options={this.state.getSuggestion}
                                        removeFilter={this.removeFilter} handleSearchChange={this.handleChange}
                                    />

                                )
                            })
                        }
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-2">
                            <button className='btn btn-primary search-button' onClick={this.search}>Search</button>
                        </div>
                    </div>
                    <p className="red">{this.state.message}</p>

                </div>
            );
        }

    }
}

export default SearchUsers;