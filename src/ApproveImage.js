import React, {Component} from 'react';
import RejectImageApproval from "./RejectImageApproval";
const DISPLAY_IMAGE_URL = 'http://127.0.0.1:3000/';
const GET_APPROVAL_IMAGE = 'http://127.0.0.1:3000/imageApproval';

const APPROVED_IMAGE = 'http://127.0.0.1:3000/imageApproved';
const APPROVE_IMAGE = 'approve image';
const REJECT_IMAGE = 'reject image';
class ApproveImage extends Component {
    constructor(props){
        super(props);
        this.state = {
            getApprovalImage : [],
            email : '',
            imagePath : '',
            message : '',
            action : APPROVE_IMAGE,
            data : []
        };
        this.imageApproved = this.imageApproved.bind(this);
        this.reject = this.reject.bind(this);
    }
    reject(e){
        this.setState({
            action :  REJECT_IMAGE,
            email : this.state.data[e.target.value].email,
            imagePath : this.state.data[e.target.value].imagePath
        });
        e.preventDefault()
    }
    imageApproved(e){
        let imagePath = this.state.data[e.target.value].imagePath;
        let email = this.state.data[e.target.value].email;
        console.log(imagePath);
        fetch(APPROVED_IMAGE, {
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                email : email,
                imagePath : imagePath
            })
        }).then((res)=>{
            res.json().then((image)=>{
                this.setState({
                    message :" Approved",
                    data : image,
                    getApprovalImage: image.map((value, index) => {
                        let sNo = index + 1;
                        return (
                            <tr key={index}>
                                <td>{sNo}</td>
                                <td>
                                    <img src={DISPLAY_IMAGE_URL + value.imagePath} className='display-image'/>
                                </td>
                                <td>{value.email}</td>
                                <td>
                                    <button type="submit" className="btn btn-primary" value={index}
                                            onClick={this.imageApproved}>Approved
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary" value={index}
                                            onClick={this.reject}>Reject
                                    </button>
                                </td>
                            </tr>

                        )
                    })
                });
            })
        }).catch(function (err) {
            console.log(err);
        });
        e.preventDefault();
    }
    componentDidMount(){
        fetch(GET_APPROVAL_IMAGE).then((res) => {
            res.json().then((image) => {
                this.setState({
                    data: image,
                    getApprovalImage: image.map((value, index) => {
                        let sNo = index + 1;
                        return (
                            <tr key={index}>
                                <td>{sNo}</td>
                                <td>
                                    <img src={DISPLAY_IMAGE_URL + value.imagePath} className='display-image'/>
                                </td>
                                <td>{value.email}</td>

                                <td>
                                    <button type="button" className="btn btn-primary" value={index}
                                            onClick={this.imageApproved}>Approved
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary" value={index}
                                            onClick={this.reject}>Reject
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                });
            }).catch(function (err) {
                console.log(err);
            });
        })
    }
    render() {
        if(this.state.action === APPROVE_IMAGE){
            return (
                <div className="col-md-8 col-lg-8">
                    <div className="container">
                        <div className='text-center top'>
                            <h2>Image Approval</h2>
                        </div>
                        <table className="table table-bordered text-center">
                            <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Image</th>

                                <th>Email</th>
                                <th>Approve</th>
                                <th>Reject</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.getApprovalImage}
                            </tbody>
                        </table>
                        <p className="bottom-margin red">{this.state.message}</p>
                    </div>
                </div>
            );
        }
        else if(this.state.action === REJECT_IMAGE){
            return(<RejectImageApproval imagePath={this.state.imagePath} email={this.state.email}/>)
        }
    }
}

export default ApproveImage;