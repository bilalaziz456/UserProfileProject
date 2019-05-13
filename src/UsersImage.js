import React, {Component} from 'react';
import Category from './Category';
import Login from './Login'
import ChangePassword from './ChangePassword'

const LOGING_OUT = 'http://127.0.0.1:3000/logout';
const URL = 'http://127.0.0.1:3000/getImage';
const UPLOAD_IMAGE = 'http://127.0.0.1:3000/upload';
const DISPLAY_IMAGE_URL = 'http://127.0.0.1:3000/';
const REJECTION_REASON = 'http://127.0.0.1:3000/rejectionReason';
const USER_IMAGE = 'userImage';
const LOG_OUT = 'log out';
const CHANGE_PASSWORD = 'ChangePassword';
class UsersImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayImage: '',
            file: '',
            text: "test text",
            action: USER_IMAGE,
            rejectionReason : ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.logOut = this.logOut.bind(this);
        this.changePassword = this.changePassword.bind(this)
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0]
        });
    }

    changePassword() {
        this.setState({
            action: CHANGE_PASSWORD
        })
    }

    logOut() {
        fetch(LOGING_OUT).then((res) => {
            res.json().then(() => {
                this.setState({
                    action: LOG_OUT
                })
            })
        })
    }

    componentDidMount() {
        fetch(URL).then((res) => {
            res.json().then((value) => {
                this.setState({
                    displayImage: DISPLAY_IMAGE_URL + value.displayImage
                })
            })
        });
        fetch(REJECTION_REASON).then((res)=>{
            res.json().then((value)=>{
                value.map((rejection)=>{
                    this.setState({
                        rejectionReason : rejection.map((value, index)=>{
                            console.log(value.message);
                            return(<p key={index} className='red'>{value.message}</p>)
                        })
                    })
                })
            })
        })
    }


    uploadImage(e) {
        const file = new FormData();
        file.append('image', this.state.file);
        fetch(UPLOAD_IMAGE, {
            method: 'POST',
            body: file
        }).then((res) => {
            res.json().then((value) => {
                console.log(value.message);
                this.setState({
                    displayImage: DISPLAY_IMAGE_URL + value.displayImage,
                    message: value.message
                })
            })
        }).catch((err) => console.log(err));
        e.preventDefault();
    }


    render() {
        if (this.state.action === USER_IMAGE) {

            return (
                <div className='container'>
                    <div className="btn-group float-right mt-2" role="group">
                        <a href='#' onClick={this.changePassword}>Change Password</a>
                        <a className="btn btn-primary btn-md" onClick={this.logOut}>Log Out</a>
                    </div>
                    <div className='row'>
                        <div className='col-md-4'>
                            <img src={this.state.displayImage} className='display-image'/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <form onSubmit={this.uploadImage}>
                                <input type="file" name="image" onChange={this.handleChange}/>
                                <button type="submit">Upload</button>
                                <p className='red'>{this.state.message}</p>
                                {this.state.rejectionReason}
                            </form>
                        </div>
                    </div>
                    <Category/>
                </div>
            );
        } else if (this.state.action === LOG_OUT) {
            return (<Login/>);
        } else if (this.state.action === CHANGE_PASSWORD) {
            return (<ChangePassword/>);
        }

    }
}

export default UsersImage;