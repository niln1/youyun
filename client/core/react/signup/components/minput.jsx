import React from "react";

require("./css/minput.css");

let MInput = React.createClass({
    render: () => {
        // this is undefined
        return (
            <div className="group">      
                <input type="text" required />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>{this.props.labelName}</label>
            </div>
        )
    }
})

module.exports = MInput;