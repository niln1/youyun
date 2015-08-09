import React from "react";
import mui, { TextField } from 'material-ui';
import MuiMixin from "../mixins/MuiMixin";

let ParentStep1 = React.createClass({
    mixins:[MuiMixin],
    onNextClick() {
        this.props.changeStep('parent2');
    },
    handleEmailFieldChange(e) {

    },
    handlePasswordFieldChange(e) {

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

module.exports = ParentStep1;