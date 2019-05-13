import React, {Component} from 'react';
import ApproveCategory from "./ApproveCategory";

const REJECT_CATEGORY = "http://127.0.0.1:3000/rejectCategory";
const APPROVE_CATEGORY = 'Skill Approve';
class RejectCategoryApproval extends Component {
    constructor(props){
        super(props);
        this.state = {
            action : '',
            rejectCategory : ''
        };
        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.rejectCategory = this.rejectCategory.bind(this);
    }
    rejectCategory(e){
        fetch(REJECT_CATEGORY, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                rejectCategory: this.state.rejectCategory,
                categoryName : this.props.category,
                email : this.props.email
            })
        }).then((res)=>{
            res.json().then(()=>{
                this.setState({
                    action : APPROVE_CATEGORY
                })
            })
        });
        e.preventDefault();
    }
    back(e){
        this.setState({
            action : APPROVE_CATEGORY
        });
        e.preventDefault();
    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render() {
        if (this.state.action === APPROVE_CATEGORY){
            return(<ApproveCategory/>)
        }
        else{
            return (
                <div className="col-md-8 col-lg-8">
                    <div className="container">
                        <h1>Edit Category:</h1>
                        <h3>Category Name: {this.props.category}</h3>
                        <h3>Email: {this.props.email}</h3>
                        <div className="col-md-6 removePaddingleft" >
                            <div className="form-group">
                                <label htmlFor="rejectCategory">Reject Category:</label>
                                <textarea rows={5} className="form-control" id="rejectCategory"
                                          name="rejectCategory"
                                          onChange={this.handleChange} required/>
                            </div>
                            <button className="btn btn-primary" onClick={this.rejectCategory}>Save</button>
                            <button className="btn btn-primary float-right" onClick={this.back}>Back</button>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

export default RejectCategoryApproval;