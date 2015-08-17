import React, { Component } from "react";
import mui, { TextField } from 'material-ui';
import prepareMui from "../../decorators/prepareMui";
import SimpleForm from "../../components/SimpleForm";

export default class Entry extends Component {
    onNextClick() {
        console.log('yo');
    }
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