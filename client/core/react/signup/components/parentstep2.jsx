import React from "react";
import Minput from "./minput.jsx";

let ParentStep2 = React.createClass({
    onNextClick() {
        this.props.changeStep('parent3');
    },
    render() {
        return (
            <div>
                <h2 style={ { "text-align" : "center" } }> { "What's your Name? :)"} </h2>
                <br/>
                <br/>
                <br/>
                <Minput labelName={"First Name"}/>
                <Minput labelName={"Last Name"}/>
                <button onClick={this.onNextClick} style={ {"width": "100%"} } className="btn btn-lg btn-success"> Next </button>
            </div>
        )
    }
})

module.exports = ParentStep2;