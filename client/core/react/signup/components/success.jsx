import React from "react";
import Minput from "./minput.jsx";

let Success = React.createClass({
    onNextClick() {
        this.props.changeStep('success');
        window.location.href="/";
    },
    render() {
        return (
            <div>
                <h2 style={ { "text-align" : "center" } }> { "Success!"} </h2>
                <button onClick={this.onNextClick} style={ {"width": "100%"} } className="btn btn-lg btn-success"> Next </button>
            </div>
        )
    }
})

module.exports = Success;