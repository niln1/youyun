import React, { Component } from "react";
import SimpleForm from "../../components/SimpleForm";
import { connect } from 'react-redux';
import { addChild } from '../../actions/actions';

@connect(state => ({
    parent: state.parent
}))
export default class AddChild extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    onNextClick = () => {
        let id = 1;
        let child = this.refs.form.state;
        this.props.dispatch(addChild(child));
        this.context.router.transitionTo(`/addchild/${id}/schedule`);
    };
    render() {
        const { parent, dispatch } = this.props;
        const textFields = [
            {type: 'text', label: 'First Name', ref: 'fname'},
            {type: 'text', label: 'Last Name', ref: 'lname'},
            {type: 'text', label: 'PickupLocation', ref: 'pickuplocation'},
            {type: 'text', label: 'Grade', ref: 'grade'},
            {type: 'text', label: 'Room', ref: 'room'}
        ];
        return (
            <div>
                <SimpleForm header="Add Child!"
                    textFields={textFields}
                    onNext={this.onNextClick}
                    submitButtonText={'Next'}
                    ref="form"
                />
            </div>
        )
    };
}