import React, {Component} from 'react';
import ApproveSkills from './ApproveSkills';
const APPROVE_SKILL = 'approve skill';
const EDIT_SKILL = "http://127.0.0.1:3000/editSkillApproved";
class EditSkillApprove extends Component {
    constructor(props){
        super(props);
        this.state = {
            action : '',
            skillName : ''
        };
        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editSkillApproved = this.editSkillApproved.bind(this);
    }
    editSkillApproved (e){
        fetch(EDIT_SKILL , {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                beforeSkillEdit : this.props.oldSkill,
                afterEditSkill: this.state.skillName,
                email : this.props.email
            })
        }).then((res)=>{
            res.json().then(()=>{
                this.setState({
                    action : APPROVE_SKILL
                })
            })
        });
        e.preventDefault()
    }
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    back(){
        this.setState({
            action : APPROVE_SKILL
        })
    }
    render() {

        if(this.state.action === APPROVE_SKILL){
            return(<ApproveSkills/>)
        }
        else {
            return (
                <div className="col-md-8 col-lg-8">
                    <div className="container">
                        <h1>Edit Skill:</h1>
                        <h3>Skill Name: {this.props.oldSkill}</h3>
                        <h3>Email: {this.props.email}</h3>
                        <div className="col-md-4 removePaddingleft" >
                            <div className="form-group">
                                <label htmlFor="skillName">Skill Name:</label>
                                <input type="text" className="form-control" id="skillName"
                                       name="skillName"
                                       onChange={this.handleChange} required/>
                            </div>
                            <button className="btn btn-primary" onClick={this.editSkillApproved}>Save</button>
                            <button className="btn btn-primary float-right" onClick={this.back}>Back</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default EditSkillApprove;