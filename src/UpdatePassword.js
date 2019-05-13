import React, {Component} from 'react';
import Login from "./Login";

const URL = "http://127.0.0.1:3000/updatePassword";
const CHANGE_PASSOWRD = 'Change Password';
const LOGIN = "Login";

class UpdatePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            confirmPassword: "",
            message: "",
            action: CHANGE_PASSOWRD
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {

        if (this.state.newPassword !== this.state.confirmPassword) {
            this.setState({
                message: "Password does not match."
            })
        } else {
            fetch(URL, {
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }),
                method: 'POST',
                body: JSON.stringify({
                    newPassword: this.state.newPassword,
                    confirmPassword: this.state.confirmPassword
                })
            }).then((res) => {
                res.json().then((value) => {
                    if (value.message === "Password is updated") {
                        this.setState({
                            action: LOGIN
                        })
                    }else{
                        this.setState({
                            message: value.message
                        })
                    }
                })
            });
        }

        e.preventDefault();
    }

    render() {
        if (this.state.action === CHANGE_PASSOWRD) {
            return (
                <div>
                    <div className="center">
                        <div className="border-color">
                            <form align="center">
                                <h3 className="heading">New Password</h3>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password:</label>
                                        <input type="password" className="form-control" id="newPassword" required
                                               name="newPassword" onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password:</label>
                                        <input type="password" className="form-control" id="confirmPassword" required
                                               name="confirmPassword" onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Submit
                                </button>
                                <p className="red">{this.state.message}</p>
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<Login/>);
        }

    }
}

export default UpdatePassword;