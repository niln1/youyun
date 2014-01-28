/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/kendo.web.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/i18next.d.ts" />

import CyApp = require("./cy-app");
import CyProvisionView = require("./ui/view/cy-provision-view");
import CyAnalytics = require("./cy-analytics");
import CyEvents = require("./cy-events");
import CyUtils = require("./util/cy-utils");
import CyTemplates = require("./util/cy-templates");

/**
 * App class to show provisioning views
 */
class CyAppProvision extends CyApp {

    /**
     * Application start
     */
    public appStart() : void {

        // adds the user menu
        this.setupUser();

        this.addRoutes();
    }

    /**
     * Adding routes to single page app views
     */
    public addRoutes() {

        this.router.route("/", $.proxy(function () {
            this.createProvisionView();
        }, this));

        this.router.start();
    }

    /**
     * create provisioning view
     * @method createProvisionView
     */
    public createProvisionView() : void {

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_VIEW_OPENED, 0, "provision");

        this.view = new CyProvisionView();

    }
}

/**
 * start the application/page
 */
$(document).ready(() => {

    var option = {
        resGetPath: '/nms/i18n/__lng__/__ns__.json',
        ns: {
            namespaces: [ 'translation', 'cyms' ],
            defaultNs: 'translation'
        },
        fallbackLng: 'en',
        cookieName: 'cy.i18n',
        keyseparator: '|'
    };

    // further initialization occurs after i18n is initialized

    $.i18n.init(option, () => {
        CyApp.I = new CyAppProvision();

        CyTemplates.loadTemplate("provision.html", function () {

            CyApp.I.initialize();

        });
    });

});

export = CyAppProvision;