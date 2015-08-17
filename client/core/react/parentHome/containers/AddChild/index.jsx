import React, { Component } from "react";
import SimpleForm from "../../components/SimpleForm";

export default class AddChild extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    onNextClick = () => {
        this.context.router.transitionTo('/addchild');
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