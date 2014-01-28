/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/kendo.web.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/i18next.d.ts" />

import CyApp = require('./cy-app');
import CyLostView = require('./ui/view/cy-lost-view');
import CyTemplates = require('./util/cy-templates');

class CyAppLost extends CyApp {
    /**
     * initialize this page, called after the base class app has initialized
     */
    public appStart() : void {

        // create simple view

        this.view = new CyLostView();

    }
}

export = CyAppLost

/**
 * start the application/page
 */
$(document).ready(() => {

    CyApp.I = new CyAppLost();

    CyTemplates.loadTemplate('lost.html', function () {
        CyApp.I.initialize();
    });

});

