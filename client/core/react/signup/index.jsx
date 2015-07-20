import React from "react";
import Minput from "./components/minput.jsx";

// start up code
$('body').addClass('full');

let containerStyle = {
    maxWidth: '640px',
    minHeight: '300px',
    margin: 'auto',
    position: 'relative',
    top: '50%',
    transform: 'translateY(50%)'
};

let Container = React.createClass({
    getInitialState: () => {
        return {
            currentStep: 0
        }
    },
    render: () => {
        return (
            <div style={containerStyle}>
                <div>
                    <Minput labelName={"School Token"}/>
                </div>
                <div>
                    <Minput labelName={"Email"}/>
                    <Minput labelName={"Password"}/>
                    <Minput labelName={"Retype Password"}/>
                </div>
                <div>
                    <Minput labelName={"First Name"}/>
                    <Minput labelName={"Last Name"}/>
                </div>
            </div>
        )
    }
})

React.render(<Container />, document.getElementById('content'));