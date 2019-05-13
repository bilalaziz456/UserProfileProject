import React, {Component} from 'react';
import EditCategoryApproval from "./EditCategoryApproval";
import RejectCategoryApproval from "./RejectCategoryApproval";

const GET_APPROVAL_CATEGORY = 'http://127.0.0.1:3000/categoryApproval';
const  APPROVED_CATEGORY =  'http://127.0.0.1:3000/categoryApproved';
const APPROVAL_CATEGORY = 'Approval Category';
const EDIT_CATEGORY = 'Edit Category';
const REJECT_CATEGORY = 'Reject CATEGORY';

class ApproveCategory extends Component {
    constructor(props){
        super(props);
        this.state = {
            categoryName : '',
            email : '',
            getApprovalCategory : [],
            action : APPROVAL_CATEGORY,
            message : '',
            data : []
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.categoryApproved = this.categoryApproved.bind(this);
        this.editCategory = this.editCategory.bind(this);
        this.rejectCategory = this.rejectCategory.bind(this);
    }
    categoryApproved(e){
        fetch(APPROVED_CATEGORY, {
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                approvedCategory :this.state.data[e.target.value].category
            })
        }).then((res)=>{
            res.json().then((category)=>{
                this.setState({
                    message :this.state.categoryName + " Approved",
                    data : category,
                    getApprovalCategory: category.map((value, index) => {
                        let sNo = index + 1;
                        return (
                            <tr key={index}>
                                <td>{sNo}</td>
                                <td>{value.category}</td>
                                <td>{value.email}</td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.categoryApproved}>Approved
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.editCategory}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.rejectCategory}
                                    >
                                        Reject
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
        e.preventDefault()
    }
    componentDidMount(){
        fetch(GET_APPROVAL_CATEGORY).then((res) => {
            res.json().then((category) => {
                this.setState({
                    data : category,
                    getApprovalCategory: category.map((value, index) => {
                        let sNo = index + 1;
                        return (
                            <tr key={index}>
                                <td>{sNo}</td>
                                <td>{value.category}</td>
                                <td>{value.email}</td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.categoryApproved}>Approved
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.editCategory}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.rejectCategory}
                                    >
                                        Reject
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
    editCategory(e){
        this.setState({
            action : EDIT_CATEGORY,
            categoryName : this.state.data[e.target.value].category,
            email : this.state.data[e.target.value].email
        });
        e.preventDefault();
    }
    rejectCategory(e){
        this.setState({
            action : REJECT_CATEGORY,
            categoryName : this.state.data[e.target.value].category,
            email : this.state.data[e.target.value].email
        });
        e.preventDefault();
    }
    render() {
        if(this.state.action === APPROVAL_CATEGORY){
            return (
                <div className="col-md-8 col-lg-8">
                    <div className="container">
                        <div className='text-center top'>
                            <h2>Category Approval</h2>
                        </div>
                        <table className="table table-bordered text-center">
                            <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Email</th>
                                <th>Category Name</th>
                                <th>Approve</th>
                                <th>Edit</th>
                                <th>Reject</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.getApprovalCategory}
                            </tbody>
                        </table>
                        <p className="bottom-margin red">{this.state.message}</p>
                    </div>
                </div>
            );
        }else if(this.state.action === EDIT_CATEGORY){
            return(<EditCategoryApproval category={this.state.categoryName} email={this.state.email}/>)
        }else if(this.state.action === REJECT_CATEGORY){
            return(<RejectCategoryApproval category={this.state.categoryName} email={this.state.email}/>)
        }
    }
}

export default ApproveCategory;