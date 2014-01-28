/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/kendo.web.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/i18next.d.ts" />

import CyApp = require('./cy-app');
import CyAnalytics = require('./cy-analytics');
import CyAnalyticsView = require('./ui/view/cy-analytics-view');
import CyTemplates = require('./util/cy-templates');

class CyAppAnalytics extends CyApp {


    /**
     * initialize this page, called after the base class app has initialized
     */
    public appStart() : void {

        // adds the user menu
        this.setupUser();

        // create our router

        this.addRoutes();
    }

    /**
     * create and initialize the main app router
     *
     * @method initializeRouter
     * @private
     */
    private addRoutes() {

        this.router.route("/", $.proxy(function() {

            this.createAnalyticsView();

        }, this));

        // start router

        this.router.start();

    }

    /**
     * create the analytics view
     *
     * @method createAnalyticsView
     */
    public createAnalyticsView() : void {

        // track event

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_VIEW_OPENED, 0, "analytics");

        this.view = new CyAnalyticsView();
    }
}

export = CyAppAnalytics

/**
 * start the application/page
 */
$(document).ready(() => {

    CyApp.I = new CyAppAnalytics();

    CyTemplates.loadTemplate('analytics.html', function () {
        CyApp.I.initialize();
    });


});

