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
                    <Minput/>
                </div>
            </div>
        )
    }
})

React.render(<Container />, document.getElementById('content'));