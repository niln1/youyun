import React from "react";
import Minput from "./minput.jsx";

let ParentStep1 = React.createClass({
    render: function () {
        return (
            <div>
                <h2 style={ { "text-align" : "center" } }> Do u have a teacher token? </h2>
                <br/>
                <br/>
                <br/>
                <Minput labelName={"Beta Token"}/>
                <p style={ { "text-align" : "center" } }> Really sorry for any inconvenience </p>
                <p style={ { "text-align" : "center" } }> A beta invitation key is needed for register </p>
                <br/>
                <button style={ {"width": "100%"} } className="btn btn-lg btn-success"> Next </button>
            </div>
        )
    }
})

module.exports = ParentStep1;