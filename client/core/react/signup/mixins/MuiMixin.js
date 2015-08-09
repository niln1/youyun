import React from "react";
import mui, { TextField } from 'material-ui';
import hanlinTheme from "../hanlinTheme";
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

export default {
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
    	ThemeManager.setTheme(hanlinTheme);
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
}