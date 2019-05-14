import React, {Component} from 'react';
import Select from 'react-select/lib/Creatable';
import AddSearchFilter from './AddSearchFilters'

const SEARCH = 'http://127.0.0.1:3000/search';
const GET_IMAGE_PATH = 'http://127.0.0.1:3000/';
const GET_SUGGESTION = 'http://127.0.0.1:3000/getSuggestion';

// const getSuggestions = value => {
//     const inputValue = value.trim().toLowerCase();
//     const inputLength = inputValue.length;
//
//     return inputLength === 0 ? [] : languages.filter(lang =>
//         lang.name.toLowerCase().slice(0, inputLength) === inputValue
//     );
// };
//
// const getSuggestionValue = suggestion => suggestion.name;
// const renderSuggestion = suggestion => (
//     <div>
//         {suggestion.name}
//     </div>
// );
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
                if (result.message === "No result found") {
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
                                        <img src={GET_IMAGE_PATH + value.imagePath}/>
                                    </td>
                                    <td>
                                        <a href={'/p/' + value.userUuid}
                                           target="_blank">{value.firstName + ' ' + value.lastName}</a>
                                    </td>
                                    <td>{value.email}</td>
                                    <td>{value.category}</td>
                                    <td>{value.skill}</td>
                                    <td>{value.rating}</td>
                                    <td>{value.interest}</td>
                                    <td>{value.experience}</td>
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
        }, function () {
            console.log(this.state.sendData)
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
                    <h1 className="top">Search Users</h1>
                    <button className="btn btn-default float-right">Add Filter</button>
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
                    <div className="col-md-2">
                        <label> </label>
                        <button className='btn btn-primary search-button' onClick={this.search}>Search</button>
                    </div>
                    <table className="table table-bordered text-center top">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Category</th>
                            <th>Skill</th>
                            <th>Rating</th>
                            <th>Interest</th>
                            <th>Experience</th>
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