import React, {Component} from 'react';
import AddSearchFilter from './AddSearchFilters'
import Select from 'react-select';
const SEARCH = 'http://127.0.0.1:3000/search';
const GET_IMAGE_PATH = 'http://127.0.0.1:3000/';
const GET_SUGGESTION = 'http://127.0.0.1:3000/getSuggestion';
const JOB_TYPE = 'http://127.0.0.1:3000/jobType';
const GET_COUNTRY = 'http://127.0.0.1:3000/country';
const GET_CITY = 'http://127.0.0.1:3000/city';

class SearchUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            data: [],
            suggestions: [],
            value: '',
            jobType : [],
            jobTypeData: [],
            checkedJobType : [],
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
            countryOptions: [],
            cityOptions : [],
            country : '',
            city : '',
            currentSalary : '',
            minExpectedPerHour : '',
            maxExpectedPerHour : '',
            maxExpectedSalary : '',
            minExpectedSalary : '',
            bool: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.handleCheckBox =this.handleCheckBox.bind(this);
        this.getCity = this.getCity.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleSalary = this.handleSalary.bind(this);
    }

    componentDidMount() {
        fetch(GET_SUGGESTION).then((res) => {
            res.json().then((value) => {
                this.setState({
                    getSuggestion: value
                })
            })
        });
        fetch(JOB_TYPE).then((res) => {
            res.json().then((jobType) => {
                this.setState({
                    jobTypeData : jobType,
                    jobType: jobType.map((value, index) => {
                        return (
                            <div className="form-check-inline" key={index}>
                                <label className="form-check-label">
                                    <input type="checkbox" className="form-check-input" onChange={this.handleCheckBox} value={index}/>{value.jobType}
                                </label>
                            </div>
                        )
                    })
                })
            })
        });
        fetch(GET_COUNTRY).then((res) => {
            res.json().then((value) => {
                this.setState({
                    countryOptions: value.map((opt) => opt)
                });
            });
        });
    }
    getCity() {
        fetch(GET_CITY, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                country: this.state.country
            })
        }).then((res) => {
            res.json().then((value) => {
                this.setState({
                    cityOptions: value.map((opt) => opt)
                });
            });
        })
    }
    handleCountryChange(value) {
        this.setState({
            country: value.value
        });

    }
    handleCityChange(value) {
        this.setState({
            city: value.value
        });

    }
    handleSalary(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleCheckBox(e){
        let checkBox = this.state.checkedJobType;

        if(e.target.checked){
            checkBox.push( this.state.jobTypeData[e.target.value].jobType);
            this.setState({
                checkedJobType : checkBox
            });
        } else {
            let found = this.state.checkedJobType.indexOf(this.state.jobTypeData[e.target.value].jobType);
            checkBox.splice(found , 1);
            this.setState({
                checkedJobType : checkBox
            });
        }

    }
    search(e) {
        if(this.state.minExpectedPerHour > this.state.maxExpectedPerHour){
            this.setState({
                bool: false,
                message : 'Min expected salary per hour can not be greater then max expected salary per hour'
            })
        } else {
            if(this.state.minExpectedSalary > this.state.maxExpectedSalary){
                this.setState({
                    bool: false,
                    message : 'Min expected salary can not be greater then max expected salary'
                })
            } else {
                fetch(SEARCH, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        jobType : this.state.checkedJobType,
                        currentSalary : this.state.currentSalary,
                        minExpectedPerHour : this.state.minExpectedPerHour,
                        maxExpectedPerHour : this.state.maxExpectedPerHour,
                        maxExpectedSalary : this.state.maxExpectedSalary,
                        minExpectedSalary : this.state.minExpectedSalary,
                        country : this.state.country,
                        city : this.state.city,
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
            }
        }
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
                    <div>{this.state.jobType}</div>
                    <div className='row top'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="currentSalary">Current Salary</label>
                                <input type='number' className='form-control' id='currentSalary' name='currentSalary'
                                       onChange={this.handleSalary} required/>
                            </div>
                        </div>
                    </div>
                    <div className='row top'>
                        <div className='col-md-6'>
                            <div className='form-group'>
                                <label htmlFor="expectedPerHour">Expected Per Hour Salary</label>
                                <div className="form-inline ">
                                    <label htmlFor='min' className="mr-sm-2">Min: </label>
                                    <input type='number' className='form-control mb-2 mr-sm-2' id='min' name='minExpectedPerHour'
                                           onChange={this.handleSalary} min="1" max="160" required/>
                                    <label htmlFor='max' className="mr-sm-2">Max: </label>
                                    <input type='number' className='form-control mb-2 mr-sm-2' id='max' name='maxExpectedPerHour'
                                           onChange={this.handleSalary} min="1" max="160" required/>
                                </div>

                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='form-group'>
                                <label >Expected Salary</label>
                                <div className="form-inline ">
                                    <label htmlFor='minExpectedSalary' className="mr-sm-2">Min: </label>
                                    <input type='number' className='form-control mb-2 mr-sm-2' id='minExpectedSalary' name='minExpectedSalary'
                                           onChange={this.handleSalary} min="160" max="1600000" required/>
                                    <label htmlFor='maxExpectedSalary' className="mr-sm-2">Max: </label>
                                    <input type='number' className='form-control mb-2 mr-sm-2' min="160" max="1600000" id='maxExpectedSalary' name='maxExpectedSalary'
                                           onChange={this.handleSalary} required/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row top">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="city">Country:</label>
                                <Select options={this.state.countryOptions}
                                        onBlur={this.getCity}
                                        onChange={this.handleCountryChange}
                                        isClearable={true}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="country">City:</label>
                                <Select options={this.state.cityOptions}
                                        onChange={this.handleCityChange}
                                        isClearable={true}
                                        />
                            </div>
                        </div>
                    </div>
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
                    <div>{this.state.jobType}</div>
                    <div className='row top'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="currentSalary">Current Salary</label>
                                <input type='number' className='form-control' id='currentSalary' name='currentSalary'
                                       onChange={this.handleSalary} required/>
                            </div>
                        </div>
                    </div>
                    <div className='row top'>
                        <div className='col-md-6'>
                            <div className='form-group'>
                                <label>Expected Per Hour Salary</label>
                                <div className="form-inline ">
                                    <label htmlFor='min' className="mr-sm-2">Min: </label>
                                    <input type='number' className='form-control mb-2 mr-sm-2' id='min' name='minExpectedPerHour'
                                           onChange={this.handleSalary} min="1" max="160" required/>
                                    <label htmlFor='max' className="mr-sm-2">Max: </label>
                                    <input type='number' className='form-control mb-2 mr-sm-2' id='max' name='maxExpectedPerHour'
                                           onChange={this.handleSalary} min="1" max="160" required/>
                                </div>

                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='form-group'>
                                <label >Expected Salary</label>
                                <div className="form-inline ">
                                    <label htmlFor='minExpectedSalary' className="mr-sm-2">Min: </label>
                                    <input type='number' className='form-control mb-2 mr-sm-2' id='minExpectedSalary' name='minExpectedSalary'
                                           onChange={this.handleSalary} min="160" max="1600000" required/>
                                    <label htmlFor='maxExpectedSalary' className="mr-sm-2">Max: </label>
                                    <input type='number' className='form-control mb-2 mr-sm-2' min="160" max="1600000" id='maxExpectedSalary' name='maxExpectedSalary'
                                           onChange={this.handleSalary} required/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row top">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="city">Country:</label>
                                <Select options={this.state.countryOptions}
                                        onBlur={this.getCity}
                                        onChange={this.handleCountryChange} required/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="country">City:</label>
                                <Select options={this.state.cityOptions}
                                        onChange={this.handleCityChange}
                                        required/>
                            </div>
                        </div>
                    </div>
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