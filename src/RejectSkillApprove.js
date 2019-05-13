import React, {Component} from 'react';
import ApproveSkills from "./ApproveSkills";
const APPROVE_SKILL  = "approve skill";
const REJECT_SKILL = "http://127.0.0.1:3000/rejectSkill";
class RejectSkillApprove extends Component {
    constructor(props){
        super(props);
        this.state = {
            action : '',
            rejectSkill : ''
        };
        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.rejectSkill = this.rejectSkill.bind(this);
    }
    back(e){
        this.setState({
            action : APPROVE_SKILL
        });
        e.preventDefault()
    }
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    rejectSkill(e){
        fetch(REJECT_SKILL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                rejectSkill: this.state.rejectSkill,
                skillName : this.props.skill,
                email : this.props.email
            })
        }).then((res)=>{
            res.json().then(()=>{
                this.setState({
                    action : APPROVE_SKILL
                })
            })
        });
        e.preventDefault();
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
                        <h3>Skill Name: {this.props.skill}</h3>
                        <h3>Email: {this.props.email}</h3>
                        <div className="col-md-6 removePaddingleft" >
                            <div className="form-group">
                                <label htmlFor="rejectSkill">Reject Skill:</label>
                                <textarea rows={5} className="form-control" id="rejectSkill"
                                       name="rejectSkill"
                                       onChange={this.handleChange} required/>
                            </div>
                            <button className="btn btn-primary" onClick={this.rejectSkill}>Save</button>
                            <button className="btn btn-primary float-right" onClick={this.back}>Back</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default RejectSkillApprove;