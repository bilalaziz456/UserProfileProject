import React, {Component} from 'react';
import  Login from './Login';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import ApproveSkill from './ApproveSkills';
import ApproveCategory from './ApproveCategory';
import ApproveImage from './ApproveImage';
const ADMIN_PANEL = "Admin Panel";
const LOG_OUT = "log out";
class AdminPanel extends Component {
    constructor(props){
        super(props);
        this.state = {
            action : ADMIN_PANEL
        };
        this.logOut = this.logOut.bind(this);
    }
    logOut(){
        this.setState({
            action : LOG_OUT
        })
    }
    render() {
        if(this.state.action === ADMIN_PANEL){
            return (
                <div className="container-fluid">
                    <Router>
                        <div className="btn-group float-right mt-2" role="group">
                            <a className="btn btn-primary btn-md" onClick={this.logOut}>Log Out</a>
                        </div>
                        <div className="row">
                            <div className="col-md-2 col-lg-2">
                                <div className="sidenav ">
                                    <li>
                                        <Link to="/ApproveImage">Approve Image</Link>
                                    </li>
                                    <li>
                                        <Link to="/ApproveCategory">Approve Category</Link>
                                    </li>
                                    <li>
                                        <Link to="/ApproveSkill">Approve Skill</Link>
                                    </li>
                                </div>
                            </div>
                            <Route path='/ApproveImage' component={ApproveImage}/>
                            <Route path='/ApproveCategory' component={ApproveCategory}/>
                            <Route path='/ApproveSkill' component={ApproveSkill}/>
                        </div>
                    </Router>
                </div>

            );
        }
       else if (this.state.action === LOG_OUT){
           return (<Login/>);
        }
    }
}

export default AdminPanel;