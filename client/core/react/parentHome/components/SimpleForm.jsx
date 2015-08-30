import React from "react";
import mui, { TextField } from 'material-ui';
import MuiMixin from "../mixins/MuiMixin";

let SimpleForm = React.createClass({
    mixins:[MuiMixin],
    getInitialState() {
        var state = {};
        this.props.textFields.map((each) => {
            state[each.ref] = '';
        })
        return state;
    },
    onChange(ref, event) {
        this.setState({
            [ref]: event.target.value
        })
    },
    _renderTextFields(textFields) {
        return textFields.map((each) => {
            return <TextField
                key={each.ref}
                value={this.state[each.ref]}
                fullWidth
                type={each.type ? each.type : 'text'}
                floatingLabelText={each.label ? each.label : null}
                ref={each.ref ? each.ref : null}
                onChange={this.onChange.bind(null, each.ref)}
            />
        });
    },
    render() {
        const { header, textFields, onNext, submitButtonText } = this.props;
        return (
            <div>
                <h2 style={ { "textAlign" : "center" } }> {header} </h2>
                {this._renderTextFields(textFields)}
                <button onClick={onNext} style={ {"width": "100%"} } className="btn btn-lg btn-success"> {submitButtonText} </button>
            </div>
        )
    }
})

module.exports = SimpleForm;