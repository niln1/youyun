import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

@connect(state => ({
    parent: state.parent
}))
class UserPage extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    render() {
        return (
            <div>
                <Link to='/addchild'> Add Child </Link>
                <Link to='/welcome'> Change Name </Link>
                <Link to='/addchild/1/schedule'> schedule </Link>
            </div>
        )
    }
}

export default UserPage;