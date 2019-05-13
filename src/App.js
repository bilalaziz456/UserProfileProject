import React, {Component} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import UserProfile from './UserProfile'
import Login from "./Login";
import SearchUsers from "./SearchUsers";

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/' exact component={Login}/>
                    <Route path='/p/:uuid'  render={(props) => <UserProfile {...props} />}/>
                    <Route path='/search'  component={SearchUsers}/>
                </Switch>
            </Router>

        );
    }
}
export default App;
ReactDOM.render(<App/>, document.getElementById("app"));
