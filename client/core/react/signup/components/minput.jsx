import React from "react";

require("./css/minput.css");

let MInput = React.createClass({
    getInitialState() {
        return { data: "" };
    },
    onInputChange(e) {
        this.setState({ data: e.target.value });
    },
    render() {
        return (
            <div className="group">      
                <input type="text" required onChange={this.onInputChange} value={this.state.data}/>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>{this.props.labelName}</label>
            </div>
        )
    }
})

module.exports = MInput;