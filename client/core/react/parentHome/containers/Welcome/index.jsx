import React, { Component } from "react";
import SimpleForm from "../../components/SimpleForm";

@connect(state => ({
    parent: state.parent
}))
export default class Welcome extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    onNextClick = () => {
        this.context.router.transitionTo('/addchild');
    };
    render() {
        return (
            <div>
                <SimpleForm header="Welcome To Hanlin!"
                    textFields={[{type: 'text', label: 'First Name', ref: 'fname'},
                        {type: 'text', label: 'Last Name', ref: 'lname'}]}
                    onNext={this.onNextClick}
                    submitButtonText={'Next'}
                />
            </div>
        )
    }
}