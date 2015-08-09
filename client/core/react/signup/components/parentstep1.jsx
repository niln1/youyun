import React from "react";
import mui, { TextField } from 'material-ui';
import MuiMixin from "../mixins/MuiMixin";

let ParentStep1 = React.createClass({
    mixins:[MuiMixin],
    persist() {
        let { emailInput, passwordInput, verifyPasswordInput }
            = this.refs;

        let valid = true;

        if (!validateEmail(emailInput.getValue())) {
            emailInput.setErrorText('Please Enter a Valid Email');
            valid = false;
        }

        if (passwordInput.getValue().length < 8) {
            passwordInput.setErrorText('Password must have at Least 8 Characters');
            valid = false;
        }

        if (passwordInput.getValue() !== verifyPasswordInput.getValue()) {
            verifyPasswordInput.setErrorText('Make sure ur password match');
            valid = false;
        }

        return valid;

    },
    onNextClick() {
        if (this.persist()) this.props.changeStep('parent2');
    },
    handleEmailFieldChange(e) {
        let email = this.refs.emailInput.getValue();

        if (!this.refs.emailInput.errorText) return;

        if (!email || validateEmail(email)) {
            this.refs.emailInput.setErrorText();
            return;
        } else {
            this.refs.emailInput
                .setErrorText('Please Enter a Valid Email');
            return;
        }
    },
    handlePasswordFieldChange(e) {
        let { passwordInput } = this.refs;
        if (!passwordInput.errorText) return;

    },
    handleVerifyPasswordFieldChange(e) {

    },
    render() {
        return (
            <div>
                <h2 style={ { "text-align" : "center" } }> Welcome! Parent! </h2>
                <br/>
                <br/>
                <TextField
                    fullWidth
                    type="email"
                    floatingLabelText="Email"
                    ref="emailInput"
                    onChange={this.handleEmailFieldChange}
                />
                <TextField
                    fullWidth
                    type="password"
                    floatingLabelText="Password"
                    ref="passwordInput"
                    onChange={this.handlePasswordFieldChange}
                />
                <TextField
                    fullWidth
                    type="password"
                    floatingLabelText="Verify Password"
                    ref="verifyPasswordInput"
                    onChange={this.handleVerifyPasswordFieldChange}
                />
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <button onClick={this.onNextClick} style={ {"width": "100%"} } className="btn btn-lg btn-success"> Create Parent Account </button>
            </div>
        )
    }
})

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

module.exports = ParentStep1;