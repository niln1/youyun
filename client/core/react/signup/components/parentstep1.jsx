import React from "react";
import mui, { TextField, Snackbar } from 'material-ui';
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
        if (!this.persist()) return; // no submit until valid
        let { emailInput, passwordInput, verifyPasswordInput }
            = this.refs;

        var url = "/api/v1/account/register";

        var data = {
            email: emailInput.getValue(),
            password: verifyPasswordInput.getValue(),
            userType: 4, // for parent 2 for teacher
            signature: "tempkey"
        };

        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function(result) {
                console.log('success');
                this.refs.dialog.show();
            }.bind(this),
            error: function(result) {
                console.log('error');
            }
        });
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
    _onDialogSubmit(e) {
        // log people in.. make this a new page.
        window.location.href = "/";
    },
    render() {
        let standardActions = [
            { text: 'Cancel' },
            { text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }
        ];
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
                <Snackbar
                    message="Account Created!"
                    action="Next"
                    openOnMount
                    autoHideDuration={1000}
                />
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