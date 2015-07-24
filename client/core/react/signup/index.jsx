import React from "react";
import Entry from "./components/entry.jsx";
import ParentStep1 from "./components/parentstep1.jsx";
import ParentStep2 from "./components/parentstep2.jsx";
import ParentStep3 from "./components/parentstep3.jsx";

// start up code
$('body').addClass('full');
$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />');

let containerStyle = {
    maxWidth: '440px',
    minHeight: '300px',
    margin: 'auto',
    position: 'relative',
    top: '50%',
    transform: 'translateY(50%)',
    '-webkit-transform': 'translateY(50%)',
    '-ms-transform': 'translateY(50%)',
    padding: '0 20px'
};

let Container = React.createClass({
    getInitialState() {
        return {
            currentStep: 'entry'
        }
    },
    changeStep(step) {
        this.setState({currentStep: step});
    },
    render: function() {
        let App;

        switch(this.state.currentStep) {
            case 'parent1':
                App = <ParentStep1 changeStep={this.changeStep} />;
                break;
            case 'parent2':
                App = <ParentStep2 changeStep={this.changeStep} />;
                break;
            case 'parent3':
                App = <ParentStep3 changeStep={this.changeStep} />;
                break;
            default: 
                App = <Entry changeStep={this.changeStep} />;
                break;
        };

        return (
            <div style={containerStyle}>
                {App}
            </div>
        )
    }
})

React.render(<Container />, document.getElementById('content'));