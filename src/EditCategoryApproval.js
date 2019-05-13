import React, {Component} from 'react';
import ApproveCategory from "./ApproveCategory";

const CATEGORY_APPROVAL = 'category approval';
const EDIT_CATEGORY = 'http://127.0.0.1:3000/editCategoryApproved';
class EditCategoryApproval extends Component {
    constructor(props){
        super(props);
        this.state = {
            categoryName : '',
            action : ''
        };
        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editCategoryApproved = this.editCategoryApproved.bind(this);
    }
    editCategoryApproved(e){
        fetch(EDIT_CATEGORY, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                beforeEditCategory : this.props.category,
                afterEditCategory: this.state.categoryName,
                email : this.props.email
            })
        }).then((res)=>{
            res.json().then(()=>{
                this.setState({
                    action : CATEGORY_APPROVAL
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
            action : CATEGORY_APPROVAL
        });
        e.preventDefault();
    }
    render() {
        if(this.state.action === CATEGORY_APPROVAL){
            return(<ApproveCategory/>)
        }else {
            return (
                <div className="col-md-8 col-lg-8">
                    <div className="container">
                        <h1>Edit Category:</h1>
                        <h3>Category Name: {this.props.category}</h3>
                        <h3>Email: {this.props.email}</h3>
                        <div className="col-md-4 removePaddingleft" >
                            <div className="form-group">
                                <label htmlFor="categoryName">Category Name:</label>
                                <input type="text" className="form-control" id="categoryName"
                                       name="categoryName"
                                       onChange={this.handleChange} required/>
                            </div>
                            <button className="btn btn-primary" onClick={this.editCategoryApproved}>Save</button>
                            <button className="btn btn-primary float-right" onClick={this.back}>Back</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default EditCategoryApproval;