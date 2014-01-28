/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/kendo.web.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/i18next.d.ts" />

/// <reference path="./cy-app.ts" />

import CyApp = require("./cy-app");
import CyTemplates = require("./util/cy-templates");
import CyTestsView = require("./ui/view/cy-tests-view");

class CyAppTests extends CyApp {

    /**
     * initialize this page, called after the base class app has initialized
     */
    public appStart() : void {

        // create simple view

        this.view = new CyTestsView();

    }
}

export = CyAppTests;

/**
 * start the application/page
 */
$(document).ready(() => {

    CyApp.I = new CyAppTests();

    CyTemplates.loadTemplate('tests.html', function () {
        CyApp.I.initialize();
    });

});
