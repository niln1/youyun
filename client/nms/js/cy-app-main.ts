/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/kendo.web.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/i18next.d.ts" />

import CyApp = require("./cy-app");
import CyAnalytics = require("./cy-analytics");
import CyEvents = require("./cy-events");
import CySettings = require("./cy-settings");
import CyAlarmInfo = require("./ui/component/cy-alarm-info");
import CyMainView = require("./ui/view/cy-mainview");
import CyGrunt = require("./util/cy-grunt");
import CyUtils = require("./util/cy-utils");
import CyTemplates = require("./util/cy-templates");
import CyWidget = require("./ui/component/cy-widget");


class CyAppMain extends CyApp {


    /**
     * this is called from the base class after it is initialized.
     */
    public appStart() : void {

        // adds the user menu
        this.setupUser();

        // add routes to base class router

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

            this.createMainView();

        }, this));


        // start router

        this.router.start();

    }

    /**
     * alarm info selector
     *
     * @property {JQuery} _alarmInfo
     * @private
     */
    private _alarmInfo:JQuery;

    /**
     * alarm info selector
     *
     * @method alarmInfo
     * @return {JQuery} alarmInfo
     */
    public get alarmInfo() : JQuery {

        return this._alarmInfo || (this._alarmInfo = $('div.header > span.header-hideable', CyTemplates.body));
    }

    /**
     * actual alarm info panel
     *
     * @property {CyUI.CyAlarmInfo} alarmInfoPanel
     * @private
     */
    private alarmInfoPanel:CyAlarmInfo;


    /**
     * create main view
     * @method createMainView
     */
    public createMainView():void {

        // track event

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_VIEW_OPENED, 0, "main");

        this.view = new CyMainView();

        // alarm info panel

        /* Removed per POW-93
        this.alarmInfoPanel = new CyAlarmInfo();

        this.alarmInfoPanel.element.appendTo(this.alarmInfo);
        */


    }

    /**
     * dispose, explicitly remove alarmInfoPanel because it is not part
     * of the view DOM tree.
     */
    public dispose():void {

        if (this.alarmInfoPanel) {
            CyWidget.disposeTree(this.alarmInfoPanel.element);
        }
    }

}

/**
 * start the application/page
 */
$(document).ready(() => {

    // request animation frame shim

    //  ----------------------------------- shim for request animation frame ---------------------------------------

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element?:any) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    CyApp.I = new CyAppMain();

    CyTemplates.loadTemplate("main.html", function () {

        CyApp.I.initialize();

    });

});

export = CyAppMain;

