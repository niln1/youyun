/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/kendo.web.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/i18next.d.ts" />

/// <reference path="./cy-app.ts" />

import CyApp = require("./cy-app");
import CyLoginView = require("./ui/view/cy-login-view");
import CyTemplates = require("./util/cy-templates");

class CyAppLogin extends CyApp {

    /**
     * initialize this page, called after the base class app has initialized
     */
    public appStart() : void {

        // create simple view

        this.view = new CyLoginView();

    }
}

export = CyAppLogin;

/**
 * start the application/page
 */
$(document).ready(() => {

    CyApp.I = new CyAppLogin();

    CyTemplates.loadTemplate('login.html', function () {
        CyApp.I.initialize();
    });

});
