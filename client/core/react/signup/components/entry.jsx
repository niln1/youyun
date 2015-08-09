import React from "react";
import mui, { TextField } from 'material-ui';
import MuiMixin from "../mixins/MuiMixin";

let Entry = React.createClass({
    mixins:[MuiMixin],
    onNextClick() {
        switch(this.refs.betatoken.getValue()) {
            case 'hanlinparent':
                this.props.changeStep('parent1');
                break;
            case 'hanlinteacher':
                this.props.changeStep('teacher1');
                break;
            default:
                window.location.href = "/";
                break;
        }      
    },
    render: function () {
        return (
            <div>
                <h2 style={ { "text-align" : "center" } }> Do u have a beta token? </h2>
                <br/>
                <br/>
                <br/>
                <TextField
                    fullWidth
                    floatingLabelText="Beta Token"
                    ref="betatoken"
                    // onChange={this._handleFloatingErrorInputChange}
                />
                <br/>
                <p style={ { "text-align" : "center" } }> Really sorry for any inconvenience </p>
                <p style={ { "text-align" : "center" } }> A beta invitation key is needed for register </p>
                <br/>
                <button onClick={this.onNextClick} style={ {"width": "100%"} } className="btn btn-lg btn-success"> Next </button>
            </div>
        )
    }
})

module.exports = Entry;