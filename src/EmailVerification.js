import React, {Component} from 'react';
import Login from './Login';
const EMAIL_VERIFY = "http://127.0.0.1:3000/code/verifyEmail";
const EMAIL_VERIFICATION = 'EmailVerification';
const LOG_IN = 'login';
class EmailVerification extends Component {
    constructor(props){
        super(props);
        this.state = {
            code : '',
            message : '',
            action : EMAIL_VERIFICATION
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit(e){
        fetch(EMAIL_VERIFY, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                code: this.state.code,
            })
        }).then((res) => {
            res.json().then((value) => {
                if (value.message === "Code is correct") {
                    this.setState({
                        action: LOG_IN
                    })
                } else {
                    this.setState({
                        message: value.message
                    })
                }
            })
        });
        e.preventDefault()
    }
    render() {
        if(this.state.action === EMAIL_VERIFICATION){
            return (
                <div className="center">
                    <div className="border-color">
                       <h3>Kindly Verify your email by clicking on the link send to your Email:</h3>
                    </div>
                </div>
            );
        } else if (this.state.action === LOG_IN){
            return (<Login/>)
        }

    }
}

export default EmailVerification;