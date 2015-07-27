import React from "react";
import Minput from "./minput.jsx";

let Entry = React.createClass({
    onNextClick() {
        switch(this.refs.betatoken.state.data) {
            case 'hanlinparent':
                this.props.changeStep('parent1');
                break;
            case 'hanlinteacher':
                this.props.changeStep('teacher1');
                break;
            default:
                alert('yo');
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
                <Minput labelName={"Beta Token"} ref="betatoken" />
                <p style={ { "text-align" : "center" } }> Really sorry for any inconvenience </p>
                <p style={ { "text-align" : "center" } }> A beta invitation key is needed for register </p>
                <br/>
                <button onClick={this.onNextClick} style={ {"width": "100%"} } className="btn btn-lg btn-success"> Next </button>
            </div>
        )
    }
})

module.exports = Entry;