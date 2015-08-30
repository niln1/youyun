import React, { Component } from "react";
import SimpleForm from "../../components/SimpleForm";

@connect(state => ({
    parent: state.parent
}))
export default class AddChild extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    onNextClick = () => {
        let id = 1;
        this.context.router.transitionTo(`/addchild/${id}/schedule`);
    };
    render() {
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
                />
            </div>
        )
    };
}