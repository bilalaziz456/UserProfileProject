import React, {Component} from 'react';
import ForgetPassword from "./ForgetPassword";
import UpdatePassword from "./UpdatePassword";

const URL = "http://127.0.0.1:3000/code";
const VERIFICATION_CODE = "Verification  Code";
const BACK = "Back";
const CHANGE_PASSWORD = 'Change Pasword';

class VerificationCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            message: "",
            action: VERIFICATION_CODE
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.back = this.back.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        fetch(URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                getCode: this.state.code,
            })
        }).then((res) => {
            res.json().then((value) => {
                if (value.message === "Code is correct") {
                    this.setState({
                        action: CHANGE_PASSWORD
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

    back() {
        this.setState({
            action: BACK
        })
    }

    render() {
        if (this.state.action === VERIFICATION_CODE) {
            return (
                <div className="center">
                    <div className="border-color">
                        <form align="center">
                            <h3 className="heading">Forget Password</h3>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="code">Verification Code:</label>
                                    <input type="password" className="form-control" id="code" name="code" required
                                           onChange={this.handleChange}/>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Submit
                            </button>
                            <a className="right" href="#" onClick={this.back}>Back</a>
                            <p className="red">{this.state.message}</p>
                        </form>
                    </div>
                </div>
            );
        } else if (this.state.action === BACK) {
            return (<ForgetPassword/>);
        } else if (this.state.action === CHANGE_PASSWORD) {
            return (<UpdatePassword/>);
        }

    }
}

export default VerificationCode;