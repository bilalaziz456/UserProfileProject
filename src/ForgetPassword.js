import React, {Component} from "react";
import VerificationCode from "./VerificationCode";
import Login from "./Login";
const URL = "http://127.0.0.1:3000/verificationEmail";
const SEND_EMAIL = "Send Email";
const SEND_CODE = "Send Code";
const BACK = "Back";

class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            message: "",
            action: SEND_EMAIL
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
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }),
            method: 'POST',
            body: JSON.stringify({
                email: this.state.email,
            })
        }).then((res) => {
            res.json().then((value) => {
                if (value.message === "Email does not exist") {
                    this.setState({
                        message: value.message
                    })
                } else {
                    if (value.message === "Code Send") {
                        this.setState({
                            action: SEND_CODE
                        })
                    }
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
        if (this.state.action === SEND_EMAIL) {
            return (
                <div className="center">
                    <div className="border-color">
                        <form align="center">
                            <h3 className="heading">Forget Password</h3>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" className="form-control" id="email" name="email" required
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
        } else if (this.state.action === SEND_CODE) {
            return (
                <VerificationCode/>
            );
        } else if (this.state.action === BACK) {
            return (<Login/>);
        }
    }
}

export default ForgetPassword