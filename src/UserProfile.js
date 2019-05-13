import React, {Component} from 'react';

const IMAGE = 'http://127.0.0.1:3000/';
const GET_IMAGE = 'http://127.0.0.1:3000/getProfile/';
const GET_DATA = 'http://127.0.0.1:3000/getProfileDetail/';
const GET_JOB_TYPE = 'http://127.0.0.1:3000/getJobType/';
const PROFILE = 'profile';
const NO_PROFILE = 'no profile';
class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePath: '',
            firstName: '',
            lastName: '',
            email : '',
            number : '',
            country : '',
            city : '',
            jobType : [],
            data: [],
            message: '',
            cat: '',
            action: NO_PROFILE
        }
    }

    componentDidMount() {
        fetch(GET_IMAGE + this.props.match.params.uuid).then((res) => {
            res.json().then((value) => {

                if (value.message === "User does not exist") {
                    this.setState({
                        message: value.message,
                    })
                }
                else {
                    this.setState({
                        action : PROFILE,
                        imagePath: IMAGE + value.imageURL,
                        firstName: value.firstName,
                        lastName: value.lastName,
                        email : value.primaryEmail,
                        number : value.primaryNumber,
                        country : value.country,
                        city : value.city
                    });
                    fetch(GET_JOB_TYPE + this.props.match.params.uuid).then((res)=>{
                        res.json().then((result)=>{
                            this.setState({
                                jobType : result.map((value, index)=>{
                                    if(index === result.length - 1){
                                       return(<span key={index}>{value.interestName}</span>)
                                    }else {
                                       return(<span key={index}>{value.interestName + ', '}</span>)
                                    }
                                })
                            })
                        })
                    })
                    fetch(GET_DATA + this.props.match.params.uuid).then((res) => {
                        res.json().then((value) => {
                            this.setState({
                                data: value.map((result, index) => {
                                    if(this.state.cat !== result.category){
                                        return (
                                            <div className="top" key={index}>
                                                <p value={this.setState({cat : result.category})}><b>Category Name: </b>{result.category}</p>
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <span ><b>Skill Name: </b>{result.skill} </span>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <span className="profile-display-margin"><b>Rating: </b>{result.rating} </span>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <span className="profile-display-margin"><b>Experience: </b>{result.experience} </span>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <span className="profile-display-margin"><b>Interest: </b>{result.interest} </span>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <span className="profile-display-margin"><b>Remarks: </b>{result.comment} </span>
                                                    </div>
                                                </div>
                                            </div>

                                        )
                                    }else {
                                        return(
                                            <div className="row">
                                                <div className="col-md-2">
                                                    <span ><b>Skill Name: </b>{result.skill} </span>
                                                </div>
                                                <div className="col-md-2">
                                                    <span className="profile-display-margin"><b>Rating: </b>{result.rating} </span>
                                                </div>
                                                <div className="col-md-2">
                                                    <span className="profile-display-margin"><b>Experience: </b>{result.experience} </span>
                                                </div>
                                                <div className="col-md-2">
                                                    <span className="profile-display-margin"><b>Interest: </b>{result.interest} </span>
                                                </div>
                                                <div className="col-md-2">
                                                    <span className="profile-display-margin"><b>Remarks: </b>{result.comment} </span>
                                                </div>
                                            </div>
                                            )

                                    }
                                })
                            });
                        })
                    })
                }
            })
        });
    }

    render() {
        if (this.state.action === PROFILE) {
            return (
                <div className="container">
                    <div className='row'>
                        <div className='col-md-4'>
                            <img src={this.state.imagePath} className='display-image'/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 top">
                            <h4>{this.state.firstName + " " + this.state.lastName}</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 top">
                            <p><b>Email: </b>{this.state.email}</p>
                            <p><b>Contact Number: </b>{this.state.number}</p>
                            <p><b>Country: </b>{this.state.country}</p>
                            <p><b>City: </b>{this.state.city}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-md-12'>
                            <p><b>Job Type: </b>{this.state.jobType}</p>
                        </div>
                    </div>
                    {this.state.data}
                </div>
            );
        } else if (this.state.action === NO_PROFILE){
            return(<h2>User does not Exist</h2>)
        }

    }
}

export default UserProfile;