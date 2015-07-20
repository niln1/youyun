import React from "react";

require("./css/minput.css");

let MInput = React.createClass({
    getInitialState: () => {
        return {
            currentStep: 0
        }
    },
    render: () => {
        return (
            <div className="group">      
                <input type="text" required />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Name</label>
            </div>
        )
    }
})

module.exports = MInput;