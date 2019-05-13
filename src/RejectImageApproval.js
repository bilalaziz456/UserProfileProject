import React, {Component} from 'react';
import ApproveImage from "./ApproveImage";

const DISPLAY_IMAGE_URL = 'http://127.0.0.1:3000/';
const REJECT_IMAGE = 'http://127.0.0.1:3000/rejectImage';
const APPROVE_IMAGE = 'approve image';

class RejectImageApproval extends Component {
    constructor(props){
        super(props);
        console.log(this.props.imagePath);
        this.state = {
            rejectImage : '',
            action : ''
        };
        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.rejectImage = this.rejectImage.bind(this);
    }
    rejectImage(e){
        fetch(REJECT_IMAGE, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                rejectImage: this.state.rejectImage,
                imagePath : this.props.imagePath,
                email : this.props.email
            })
        }).then((res)=>{
            res.json().then(()=>{
                this.setState({
                    action : APPROVE_IMAGE
                })
            })
        });
        e.preventDefault();
    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    back(e){
        this.setState({
            action : APPROVE_IMAGE
        });
        e.preventDefault();
    }
    render() {
        if(this.state.action === APPROVE_IMAGE){
            return(<ApproveImage/>)
        }
        else {
            return (
                <div className="col-md-8 col-lg-8">
                    <div className="container">
                        <img src={DISPLAY_IMAGE_URL + this.props.imagePath} className='display-image'/>
                        <h3>Email : {this.props.email}</h3>
                        <div className="col-md-6 removePaddingleft" >
                            <div className="form-group">
                                <label htmlFor="rejectImage">Rejection Reason:</label>
                                <textarea rows={5} className="form-control" id="rejectImage"
                                          name="rejectImage"
                                          onChange={this.handleChange} required/>
                            </div>
                            <button className="btn btn-primary" onClick={this.rejectImage}>Save</button>
                            <button className="btn btn-primary float-right" onClick={this.back}>Back</button>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

export default RejectImageApproval;