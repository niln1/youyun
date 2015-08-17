import React from 'react';
import { Router, Route } from 'react-router';
import Application from './containers/App';
import Welcome from './containers/Welcome';
import AddChild from './containers/AddChild';
import StudentPickupSchedule from './containers/StudentPickupSchedule';
import Home from './containers/Home';

export default class AppRouter extends React.Component {
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    render() {
        return (
            <Router {...this.props}>
                <Route component={Application}>
                    <Route path="/" component={Home} />
                    <Route path="/welcome" component={Welcome} />
                    <Route path="/addchild" component={AddChild} />
                    <Route path="/addchild/:id/schedule" component={StudentPickupSchedule} />
                </Route>
            </Router>
        );
    }
}