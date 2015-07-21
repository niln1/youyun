import React from "react";
import Minput from "./minput.jsx";

let Step1 = React.createClass({
    render: function () {
        return (
            <div>
                <h2 style={ { "text-align" : "center" } }> Do u have a beta token? </h2>
                <br/>
                <br/>
                <br/>
                <Minput labelName={"Beta Token"}/>
                <p style={ { "text-align" : "center" } }> HanLin is currently in beta, you need a Beta invitation key to register. </p>
                <button style={ {"width": "100%"} } className="btn btn-lg btn-success"> Submit </button>
            </div>
        )
    }
})

module.exports = Step1;