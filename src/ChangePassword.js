import React, {Component} from 'react';
import UsersImage from './UsersImage'
const CHANGE_PASSWORD = 'http://127.0.0.1:3000/changePassword';
const CURRENT_PAGE = 'change Password';
const BACK = 'back';
class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: "",
            message: '',
            action : CURRENT_PAGE
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        fetch(CHANGE_PASSWORD, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword,
                confirmPassword: this.state.confirmPassword
            })
        }).then((res) => {
            res.json().then((value) => {
                this.setState({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    message: value.message
                })

            })
        });
        e.preventDefault();
    }
    back(){
        this.setState({
            action : BACK
        })
    }
    render() {
        if(this.state.action === CURRENT_PAGE){
            return (
                <div>
                    <div className="center">
                        <div className="border-color">
                            <form align="center">
                                <h3 className="heading">Login</h3>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Current Password:</label>
                                        <input type="password" className="form-control" id="currentPassword"
                                               name="currentPassword" value={this.state.currentPassword}
                                               onChange={this.handleChange} required/>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password:</label>
                                        <input type="password" className="form-control" id="newPassword"
                                               value={this.state.newPassword} name="newPassword"
                                               onChange={this.handleChange} required/>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password:</label>
                                        <input type="password" className="form-control" id="confirmPassword"
                                               value={this.state.confirmPassword} name="confirmPassword"
                                               onChange={this.handleChange} required/>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Submit
                                </button>
                                <div>
                                    <a href="#" onClick={this.back}>Back</a>
                                </div>
                                <p className="red">{this.state.message}</p>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }else if (this.state.action === BACK){
            return(<UsersImage/>);
        }

    }
}

export default ChangePassword;