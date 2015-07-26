import React from "react";
import Minput from "./minput.jsx";

let ParentStep3 = React.createClass({
    onNextClick() {
        this.props.changeStep('success');
    },
    render() {
        return (
            <div>
                <h2 style={ { "text-align" : "center" } }> { "Who is your child? :)"} </h2>
                <br/>
                <br/>
                <br/>
                <Minput labelName={"Who is your child?"}/>
                <button onClick={this.onNextClick} style={ {"width": "100%"} } className="btn btn-lg btn-success"> Next </button>
            </div>
        )
    }
})

module.exports = ParentStep3;