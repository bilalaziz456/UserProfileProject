import React, {Component} from 'react';
import EditSkillApprove from './EditSkillApprove';
import RejectSkillApprove from "./RejectSkillApprove";

const GET_APPROVE_SKILL = 'http://127.0.0.1:3000/skillsApproval';
const APPROVED_SKILL = 'http://127.0.0.1:3000/skillApproved';
const APPROVE_SKILL = "approval skill";
const EDIT_SKILL = "edit skill";
const REJECT_SKILL = " reject skill";

class ApproveSkills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getApprovalSkill: [],
            skillName: '',
            email: '',
            action: APPROVE_SKILL,
            message: '',
            data : []
        };
        this.skillApproved = this.skillApproved.bind(this);
        this.editSkill = this.editSkill.bind(this);
        this.rejectSkill = this.rejectSkill.bind(this);
    }


    skillApproved(e) {
        fetch(APPROVED_SKILL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                approvedSkill: this.state.data[e.target.value].skill
            })
        }).then((res) => {
            res.json().then((skills) => {
                this.setState({
                    message: this.state.afterEditCategory + " Approved",
                    getApprovalSkill: skills.map((value, index) => {
                        let sNo = index + 1;
                        return (
                            <tr key={index}>
                                <td>{sNo}</td>
                                <td>{value.skill}</td>
                                <td>{value.email}</td>
                                <td>
                                    <button className="btn btn-primary"
                                            value={index}
                                            onClick={this.skillApproved}>Approved
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-primary"
                                            value={index}
                                            onClick={this.editSkill}>Edit
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.rejectSkill}
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
        e.preventDefault();
    }

    editSkill(e) {
        this.setState({
            action: EDIT_SKILL,
            skillName :  this.state.data[e.target.value].skill,
            email :  this.state.data[e.target.value].email
        });
        e.preventDefault()
    }

    rejectSkill(e) {
        this.setState({
            action: REJECT_SKILL,
            skillName :  this.state.data[e.target.value].skill,
            email :  this.state.data[e.target.value].email
        });
        e.preventDefault()
    }

    componentDidMount() {
        fetch(GET_APPROVE_SKILL).then((res) => {
            res.json().then((skills) => {
                this.setState({
                    data : skills,
                    getApprovalSkill: skills.map((value, index) => {
                        let sNo = index + 1;
                        return (
                            <tr key={index}>
                                <td>{sNo}</td>
                                <td>
                                    {value.skill}
                                </td>
                                <td>
                                    {value.email}
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.skillApproved}
                                    >
                                        Approved
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.editSkill}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary"
                                            value={index}
                                            onClick={this.rejectSkill}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>

                        )
                    })
                })
            }).catch(function (err) {
                console.log(err);
            });
        })
    }


    render() {
        if (this.state.action === APPROVE_SKILL) {
            return (
                <div className="col-md-8 col-lg-8">
                    <div className="container">
                        <div className='text-center top'>
                            <h2>Skills Approval</h2>
                        </div>
                        <table className="table table-bordered text-center">
                            <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Skill Name</th>
                                <th>Email</th>
                                <th>Approve</th>
                                <th>Edit</th>
                                <th>Reject</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.getApprovalSkill}
                            </tbody>
                        </table>
                        <p className="bottom-margin red">{this.state.message}</p>
                    </div>
                </div>

            );
        }
        else if (this.state.action === EDIT_SKILL) {
            return (
                <EditSkillApprove oldSkill={this.state.skillName} email={this.state.email}/>
            )
        } else if (this.state.action === REJECT_SKILL) {
            return (<RejectSkillApprove skill={this.state.skillName} email={this.state.email}/>)
        }
    }
}

export default ApproveSkills;