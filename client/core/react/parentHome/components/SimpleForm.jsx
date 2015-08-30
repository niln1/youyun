import React from "react";
import mui, { TextField } from 'material-ui';
import MuiMixin from "../mixins/MuiMixin";

let SimpleForm = React.createClass({
    mixins:[MuiMixin],
    render() {
        const { header, textFields, onNext, submitButtonText } = this.props;
        return (
            <div>
                <h2 style={ { "textAlign" : "center" } }> {header} </h2>
                {textFields.map((each) => {
                    return <TextField
                        key={each.ref}
                        fullWidth
                        type={each.type ? each.type : 'text'}
                        floatingLabelText={each.label ? each.label : null}
                        ref={each.ref ? each.ref : null}
                        onChange={each.onChange ? each.onChange : null}
                    />
                })}
                <button onClick={onNext} style={ {"width": "100%"} } className="btn btn-lg btn-success"> {submitButtonText} </button>
            </div>
        )
    }
})

module.exports = SimpleForm;