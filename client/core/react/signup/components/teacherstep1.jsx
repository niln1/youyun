import React from "react";
import Minput from "./minput.jsx";

let TeacherStep1 = React.createClass({
    onNextClick() {
        this.props.changeStep('teacher2');
    },
    render() {
        return (
            <div>
                <h2 style={ { "text-align" : "center" } }> Welcome! Teacher! </h2>
                <br/>
                <br/>
                <br/>
                <Minput labelName={"Email"}/>
                <Minput labelName={"Password"}/>
                <Minput labelName={"Verify Password"}/>
                <button onClick={this.onNextClick} style={ {"width": "100%"} } className="btn btn-lg btn-success"> Create Teacher Account </button>
            </div>
        )
    }
})

module.exports = TeacherStep1;