import React, { Component } from "react";
import SimpleForm from "../../components/SimpleForm";
import { connect } from 'react-redux';

@connect(state => ({
    parent: state.parent
}))
export default class AddChild extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    onNextClick = () => {
        this.context.router.transitionTo('/');
    };
    render() {
        const textFields = [
            {type: 'time', label: 'Monday Schedule', ref: 'monday'},
            {type: 'time', label: 'Tuesday Schedule', ref: 'tuesday'},
            {type: 'time', label: 'Wednesday Schedule', ref: 'wednesday'},
            {type: 'time', label: 'Thursday Schedule', ref: 'thursday'},
            {type: 'time', label: 'Friday Schedule', ref: 'friday'},
            {type: 'time', label: 'Saturday Schedule', ref: 'saturday'},
            {type: 'time', label: 'Sunday Schedule', ref: 'sunday'}
        ];
        return (
            <div>
                <SimpleForm header="Modify Child Pickup Detail"
                    textFields={textFields}
                    onNext={this.onNextClick}
                    submitButtonText={'Finish'}
                />
            </div>
        )
    };
}