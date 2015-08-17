import React from "react";
import MixinDecorator from './mixinDecorator';
import mui from 'material-ui';
import hanlinTheme from "../../hanlinTheme";
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

let MuiMixin = {
    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired
    },

    getChildContext: function() {
    	ThemeManager.setTheme(hanlinTheme);
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
}

export default MixinDecorator('prepareMui', MuiMixin);