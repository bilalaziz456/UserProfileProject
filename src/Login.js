import React, {Component} from 'react';
import UsersImage from './UsersImage';
import AdminPanel from './AdminPanel';
import Register from './Register';
import ForgetPassword from './ForgetPassword';
const LOG_IN = "login";
const URL = "http://127.0.0.1:3000/login";
const REGISTER = 'register';
const FORGET_PASSWORD = 'ForgetPassword';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '',
            message : '',
            action : LOG_IN,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.switchToRegister = this.switchToRegister.bind(this);
        this.switchToForgetPassword = this.switchToForgetPassword.bind(this);
    }
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e){
        fetch(URL,{
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                email: this.state.email,
                password : this.state.password,
            })
        }).then((res)=>{
            res.json().then((value)=>{
                if(value.message ){
                    this.setState({
                        message: value.message
                    })
                }else if (value.roles === 0 || value.roles === 1){
                    this.setState({
                        action :value.roles
                    })
                }
            })
        });
        e.preventDefault();
    }
    switchToRegister(){
        this.setState({
            action : REGISTER
        })
    }
    switchToForgetPassword(){
        this.setState({
            action : FORGET_PASSWORD
        })
    }
    render() {
        if(this.state.action === LOG_IN){
            return (
                <div className="center">
                    <div className="border-color">
                        <form align="center">
                            <h3 className="heading">Login</h3>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input type="email"  pattern='/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi' className="form-control" id="email" name="email" value={this.state.email} onChange={this.handleChange} required/>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input type="password" className="form-control" id="password" value={this.state.password} name="password" onChange={this.handleChange} required/>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Login</button>
                            <p className="red">{this.state.message}</p>
                        </form>
                        <div className="col-md-12">
                            <a className="centerBlock" href="#" onClick={this.switchToRegister}>Register</a>
                            <a className="centerBlock" href="#" onClick={this.switchToForgetPassword}>Forget Password</a>
                        </div>
                    </div>
                </div>
            );
        }else if(this.state.action === 0){
            return(<UsersImage/>);
        }
        else if(this.state.action === 1){
            return(<AdminPanel/>);
        }
        else if(this.state.action === REGISTER){
            return(
                <Register/>
            );
        }else if(this.state.action === FORGET_PASSWORD){
            return(<ForgetPassword/>)
        }

    }
}

export default Login;