/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyView = require('./cy-view');
import CyApp = require('../../cy-app');
import CyAnalytics = require('../../cy-analytics');
import CyTemplates = require('../../util/cy-templates');

/**
 * this is view within the app class. It has nothing to do with the model-view paradigm
 */
class CyLostView extends CyView {

    constructor() {

        // super first as required

        super("CyLostView");

        // show navigation headers relative to this view

        CyApp.I.hideNavigationHeaders();

        // track

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_VIEW_OPENED, 0, "lost");
    }

    /**
     * initialize view after getting the signed in user
     */
    public buildElement() : JQuery {


        // simple show some templated content

        var e:JQuery = CyTemplates.cloneTemplate('lost-content');

        return e;
    }

    /**
     * dispose the view, clean up, remove event handlers etc etc
     */
    public dispose():void {

    }
}

export = CyLostView