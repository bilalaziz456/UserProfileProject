import React, {Component} from 'react';
import Login from './Login';
import EmailVerification from './EmailVerification';
import PhoneInput, {formatPhoneNumber} from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
const REGISTER = 'http://127.0.0.1:3000/register';
const GET_COUNTRY = 'http://127.0.0.1:3000/country';
const GET_CITY = 'http://127.0.0.1:3000/city';
const DURING_REGISTER = 'registering';
const LOG_IN = 'Log_in';
const EMAIL_VERIFICATION = 'Email Verification';
import Select from 'react-select';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: DURING_REGISTER,
            countryOptions: [],
            cityOptions: [],
            firstName: '',
            lastName: '',
            primaryEmail: '',
            countryCodePrimaryNumber: '',
            secondaryEmail: '',
            password: '',
            confirmPassword: '',
            country: '',
            city: '',
            primaryNumber: '',
            secondaryNumber: '',
            countryCodeSecondaryNumber : '',
            message: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getCity = this.getCity.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handleSecondaryNumberChange = this.handleSecondaryNumberChange.bind(this);
    }

    handleNumberChange(telNumber) {
        let number = telNumber && formatPhoneNumber(telNumber, 'International');
        console.log(number);
        if (number !== undefined) {
            this.setState({
                primaryNumber: number.split(/\s(.+)/)[1],
                countryCodePrimaryNumber: number.split(" ", 1).toString()
            }, function () {
                console.log("primaryNumber: ", this.state.primaryNumber)
            });
        }
    }
    handleSecondaryNumberChange(telNumber) {
        let number = telNumber && formatPhoneNumber(telNumber, 'International');
        console.log(number);
        if (number !== undefined) {
            this.setState({
                secondaryNumber: number.split(/\s(.+)/)[1],
                countryCodeSecondaryNumber: number.split(" ", 1).toString()
            }, function () {
                console.log("secondaryNumber: ", this.state.primaryNumber)
            });
        }
    }
    handleSubmit(e) {
        fetch(REGISTER, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                primaryEmail: this.state.primaryEmail,
                secondaryEmail: this.state.secondaryEmail,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
                country: this.state.country,
                city: this.state.city,
                primaryNumber: this.state.primaryNumber,
                countryCodePrimaryNumber : this.state.countryCodePrimaryNumber,
                secondaryNumber: this.state.secondaryNumber,
                countryCodeSecondaryNumber : this.state.countryCodeSecondaryNumber
            })
        }).then((res) => {
            res.json().then((value) => {
                console.log(value.message);
                if (value.message === "User successfully registered") {
                    this.setState({
                        action: EMAIL_VERIFICATION
                    })
                } else {
                    this.setState({
                        message: value.message
                    })
                }
            })
        });
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    componentDidMount() {
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

    handleCityChange(value) {
        this.setState({
            city: value.value
        });

    }

    handleCountryChange(value) {
        this.setState({
            country: value.value
        });

    }

    login() {
        this.setState({
            action: LOG_IN
        })
    }

    render() {
        if (this.state.action === DURING_REGISTER) {
            return (
                <div className="container">
                    <div className="border-color">
                        <form align="center">
                            <h3 className="heading">Register</h3>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name:<span className="red">*</span></label>
                                        <input type="text" className="form-control" id="firstName" name="firstName"
                                               value={this.state.firstName} onChange={this.handleChange} required/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name:<span className="red">*</span></label>
                                        <input type="text" className="form-control" id="lastName" name="lastName"
                                               value={this.state.lastName} onChange={this.handleChange} required/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="primaryEmail">Primary Email:<span
                                            className="red">*</span></label>
                                        <input type="email" className="form-control" id="primaryEmail"
                                               name="primaryEmail"
                                               value={this.state.primaryEmail} onChange={this.handleChange}
                                               required/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="secondaryEmail">Secondary Email:</label>
                                        <input type="email" className="form-control" id="secondaryEmail"
                                               name="secondaryEmail"
                                               value={this.state.secondaryEmail} onChange={this.handleChange}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="password">Password:<span className="red">*</span></label>
                                        <input type="password" className="form-control" id="password"
                                               name="password"
                                               value={this.state.password} onChange={this.handleChange} required/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password:</label>
                                        <input type="password" className="form-control" id="confirmPassword"
                                               value={this.state.confirmPassword} name="confirmPassword"
                                               onChange={this.handleChange} required/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="primaryNumber">Primary Contact Number:<span
                                            className="red">*</span></label>
                                        <PhoneInput
                                            placeholder="Enter phone number"
                                            onChange={this.handleNumberChange}
                                        />

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="secondaryNumber">Secondary Contact Number:</label>
                                        <PhoneInput
                                            placeholder="Enter phone number"
                                            onChange={this.handleSecondaryNumberChange}
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="city">Country:<span className="red">*</span></label>
                                        <Select options={this.state.countryOptions}
                                                onBlur={this.getCity}
                                                onChange={this.handleCountryChange} required/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="country">City:<span className="red">*</span></label>
                                        <Select options={this.state.cityOptions}
                                                onChange={this.handleCityChange}
                                                required/>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Submit
                                </button>
                                <a className="right" href="#" onClick={this.login}>Login</a>
                                <p className="red">{this.state.message}</p>
                            </div>

                        </form>
                    </div>
                </div>
            );
        } else if (this.state.action === LOG_IN) {
            return (<Login/>)
        } else if (this.state.action === EMAIL_VERIFICATION) {
            return (<EmailVerification/>)
        }

    }
}

export default Register;