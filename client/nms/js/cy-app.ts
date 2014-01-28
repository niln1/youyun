/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/kendo.web.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/i18next.d.ts" />
/// <reference path="./definitions/moment.d.ts" />
/// <reference path="./interfaces/i-cy-navigation-header.d.ts" />

import CyPendingRequests = require("./cy-pending-requests");
import CyAnalytics = require("./cy-analytics");
import CySettings = require("./cy-settings");
import CyEvents = require("./cy-events");
import CyTemplates = require("./util/cy-templates");
import CyUtils = require("./util/cy-utils");
import CyGrunt = require("./util/cy-grunt");
import CyWidget = require("./ui/component/cy-widget");
import CyView = require("./ui/view/cy-view");
import CyWindow = require("./ui/window/cy-window");
import CyDialog = require("./ui/window/cy-dialog");
import CyCapsWindow = require("./ui/window/cy-caps-window");
import CyFormTestWindow = require("./ui/window/cy-form-test-window");
import CyNodeSelector = require("./ui/window/cy-node-selector");
import CyDateTimePicker = require("./ui/window/cy-date-time-picker");
import CyAlarmRangePicker = require("./ui/window/cy-alarm-range-picker");
import CyMessage = require("./cy-message");
import CyUserConnector = require("./data/connectors/cy-user-connector");
import CyAboutWindow = require("./ui/window/cy-about-window");
import CyUserMenu = require("./ui/component/cy-user-menu");

/**
 * the app class.
 *
 * @class CyApp
 */
class CyApp {

    /**
     * singleton instance for the app class. Access via the I() public/static method
     *
     * @method I
     * @return {CyApp} A singleton instance of the application.
     */
    public static instance:CyApp;

    public static get I():CyApp {

        return CyApp.instance;
    }

    public static set I(i:CyApp) {
        CyApp.instance = i;
    }

    /**
     * initialize the application
     *
     * @property {boolean} isInitialized
     * @default false
     * @private
     */
    private isInitialized:boolean = false;

    /**
     * Initialize the application
     *
     * @method initialize
     * @return void
     */
    public initialize():void {

        // once only

        CyUtils.assert(this.isInitialized === false, "App is already initialized");

        this.isInitialized = true;

        // add a global handler for uncaught exceptions and report them via the analytics logs

        window.onerror = $.proxy(this.handleGlobalErrors, this);

        // initialize the i18n system

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

            $.each($('#cyan-templates').children(), function () {
                $(this).i18n()
            });

            // bind the DOMNodeInserted event. When this occurs to a CyWidget
            // its addedToDOM method is called ( and recursively on other CyWidgets in
            // its children tree

            $(document).bind('DOMNodeInserted', (e:JQueryEventObject) => {

                // let the widget class figure it all out based on the type of the widget

                CyWidget.DOMNodeInserted($(e.target));
            });

            // initialize the router

            this.initializeRouter();

            // add all navigation headers that are app wide...typically these are the pages.
            // Individual views with in a single page should be initialized in the page router configuration

            this.addNavigationHeader({
                text: "Monitoring",
                id: CyApp.kNAV_NMS,
                url: "/"
            });

            this.addNavigationHeader({
                text: "Provisioning",
                id: CyApp.kNAV_PROVISION,
                url: "/provision"
            });

            this.addNavigationHeader({
                text: "Analytics",
                id: CyApp.kNAV_ANALYTICS,
                url: "/analytics"
            });

            // highlight current view fragment

            this.highlightHeader();

            // create a global event for when the browser is resized

            $(window).resize($.proxy(this.browserResized, this));

            // initialize main menu

            this.mainMenu = $('[data-element="main-menu"]').kendoMenu({

                select: $.proxy(this.onMenuItemSelected, this)

            });


            // handle events that trigger dialogs, these may come from i-frames that can't run
            // their own dialogs

            this.eventBus.on('show-datetime-picker', (payload?:any) => {

                alert(moment.utc(payload.start).toString());

                var rangePicker:CyAlarmRangePicker = new CyAlarmRangePicker( moment.utc(payload.start), moment.utc(payload.end) );

                rangePicker.once(CyWindow.kEVENT_CLOSING, () => {

                    if (rangePicker.modalResult === CyDialog.kMODAL_OK) {

                        alert("Start:" + rangePicker.startDateTime.toString());

                        alert("End:" + rangePicker.endDateTime.toString());

                        // TODO, update the event that sends the new date/time

                        this.eventBus.trigger('completed-datetime-picker', {
                            resolver: payload.resolver,
                            when: rangePicker.startDateTime.valueOf()
                        });

                    } else {

                        this.eventBus.trigger('cancel-datetime-picker', {
                            resolver: payload.resolver
                        });
                    }
                });

                return;


                // TODO: Remove this old range picker code
                // construct moment based ranges for date and time from start and end unix MS were passed

                var range = {
                  min: moment.utc(payload.start),
                  max: moment.utc(payload.end)
                };

                var dateTimePicker:CyDateTimePicker = new CyDateTimePicker("Start Time", range, range, payload.includeTime);

                dateTimePicker.once(CyWindow.kEVENT_CLOSING, () => {

                    if (dateTimePicker.modalResult === CyDialog.kMODAL_OK) {

                        this.eventBus.trigger('completed-datetime-picker', {
                            resolver: payload.resolver,
                            when: dateTimePicker.dateTime.valueOf()
                        });

                    } else {

                        this.eventBus.trigger('cancel-datetime-picker', {
                            resolver: payload.resolver
                        });
                    }
                });
            });

            this.eventBus.on(CyMessage.kUSER_MENU_ITEM_SELECTED, $.proxy(this.onMenuItemSelected, this));

            // setup user connector
            this.userConnector = new CyUserConnector();
            this.userConnector.on(CyMessage.kCONNECTOR_DATA_CHANGED, $.proxy(this.addUserMenu, this));

            // call app start, which must be overridden

            this.appStart();

            // initialize pending request manager to ensure that all calls being made at app start won't get cancelled
            CyPendingRequests.I.initialize();
        });
    }

    /**
     * when a menu item is selected
     * @param e
     */
    private onMenuItemSelected(e:any) : void {

        switch ($(e.item).attr('data-item'))  {

            case "browser-caps": {

                this.showBrowserCaps();
            }
                break;

            case "node-selector": {

                this.showNodeSelector();
            }
                break;

            case "form-test": {

                this.showFormTest();
            }
                break;

            case "date-time-picker": {

                this.showDateTimePicker();

            }
                break;

            case "user-menu-about": {

                this.showAbout();

            }
                break;

            case "user-menu-signout": {

                this.goLogin();

            }
                break;
        }
    }

    /**
     * run the browser capabilities window
     */
    public showFormTest() : void {

        if (!this.formTestWindow) {

            this.formTestWindow = new CyFormTestWindow();

            this.formTestWindow.on(CyWindow.kEVENT_CLOSING, () => {

                this.formTestWindow = null;
            });
        }
    }

    /**
     * run the browser capabilities window
     */
    public showBrowserCaps() : void {

        if (!this.capsWindow) {

            this.capsWindow = new CyCapsWindow();

            this.capsWindow.on(CyWindow.kEVENT_CLOSING, () => {

                this.capsWindow = null;
            });
        }
    }

    /**
     * node selector window
     */
    public showNodeSelector() : void {

        if (!this.nodeSelector) {

            this.nodeSelector = new CyNodeSelector();

            this.nodeSelector.on(CyWindow.kEVENT_CLOSING, () => {
                this.nodeSelector = null;
            });
        }
    }

    /**
     * date time picker window
     */
    public showDateTimePicker() : void {

        if (!this.dateTimePicker) {
            this.dateTimePicker = new CyDateTimePicker("Select Date and Time");

            this.dateTimePicker.on(CyWindow.kEVENT_CLOSING, () => {

                this.dateTimePicker = null;
            });
        }
    }

    /**
     * capabilities window when shown
     */
    private capsWindow:CyCapsWindow;

    private formTestWindow:CyFormTestWindow;


    /**
     * window for date time picker
     */
    private dateTimePicker:CyDateTimePicker;

    /**
     *
     */
    private nodeSelector:CyNodeSelector;

    /**
     * window for about box
     */
    private aboutWindow:CyAboutWindow;

    /**
     * main app menu
     */
    private mainMenu:JQuery;

    /**
     * override in actual app class
     */
    public appStart() : void {

        CyUtils.assert(false,"You must override this method");

    }

    /**
     * constants representing location in login view
     *
     * @property kNAV_LOGIN
     * @type {string}
     * @static
     */
    public static kNAV_LOGIN:string = "nav-login";

    /**
     * constants representing location in main view
     *
     * @property kNAV_NMS
     * @type {string}
     * @static
     */
    public static kNAV_NMS:string = "nav-nms";

    /**
     * constants representing location in provisioning view
     * @property kNAV_PROVISION
     * @type {string}
     * @static
     */
    public static kNAV_PROVISION:string = "nav-provision";

    /**
     * constants representing location in analytics view
     *
     * @property kNAV_ANALYTICS
     * @type {string}
     * @static
     */
    public static kNAV_ANALYTICS:string = "nav-analytics";

    /**
     * create and initialize the main app router.
     * Inheriting classes can add their own routes. The base class handles missing routes and change events
     * to update the header navigation area only
     *
     * @method initializeRouter
     * @private
     */
    private initializeRouter() {

        // create kendo router

        this.router = new kendo.Router({

            // goto lost page on bad router

            routeMissing: (e:any) => {

                // track this via the analytics system

                CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kBAD_ROUTE, 0, e.url);

                // goto lost page

                CyApp.I.goLost();
            },

            change: (e:any) => {

                // highlight correct header based on fragment we are navigating to!
                // NOTE: This event is fired before the navigation has occurred so we must supply the destination
                //       to highlight header

                //this.highlightHeader('#' + e.url);

                // cancel all pending ajax request

                CyPendingRequests.I.cancelAll();

            }
        });

    }

    /**
     * handler for the window.resize event
     *
     * @method browserResized
     * @private
     * @return void
     */
    private browserResized():void {

        this.eventBus.trigger(CyApp.kBROWSER_RESIZED, {
            sender: this,
            width: $(window).width(),
            height: $(window).height()
        });

    }

    /**
     * displayed navigation headers
     * @property {Array} navHeaders
     * @default []
     * @private
     */
    private navHeaders:Array = [];

    /**
     * the router that manages the views
     *
     * @property {kendo.Router} _router
     * @private
     */
    private _router:kendo.Router;

    /**
     * the router that manages the views
     *
     * @method router
     * @return {kendo.Router} router
     */
    public get router():kendo.Router {
        return this._router;
    }

    public set router(r:kendo.Router) {
        this._router = r;
    }

    /**
     * the master event bus
     *
     * @method eventBus
     * @return {CyEvents.CyEventManager} eventBus
     */
    private _eventBus:CyEvents.CyEventManager;
    public get eventBus():CyEvents.CyEventManager {

        if (!this._eventBus) {

            this._eventBus = new CyEvents.CyEventManager();
        }

        return this._eventBus;
    }


    /**
     * highlight the correct nav header based on the given url fragment ( window.location.hash ) or pathname ( window.location.pathname )
     */
    public highlightHeader(destination?:string):void {

        // if destination is provided then use that, otherwise use the window hash / pathname

        var hash:string = destination || window.location.hash;

        var pathname:string = destination || window.location.pathname;

        // highlight header link that matches the fragment

        _.each(this.navHeaders, (h:ICyNavigationHeader) => {

            // compare against hash ( by adding a hash mark to the fragment ) or the pathname

            if (('#' + h.fragment) === hash || h.url == pathname) {

                h.widget.addClass('master-page-view-label-selected');

            } else {

                h.widget.removeClass('master-page-view-label-selected');
            }

        }, this);
    }

    /**
     * handle global errors, dispatched to use via the window.onerror event
     *
     * @method handleGlobalErrors
     * @param message
     * @param url
     * @param lineNo
     * @private
     * @returns {boolean}
     */
    private handleGlobalErrors(message, url, lineNo):boolean {

        // only track and report the error if it wasn't a known problem from a known library

        var ignore:string = _.find(CyApp.sourceIgnores, (file:string) => {

            return url.indexOf(file) >= 0;
        });

        if (ignore) {

            console.error("Exception Ignored\n" + message + "\nFile:" + url + ", Line:" + lineNo);

        } else {

            // track this via the analytics system

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kUNHANDLED_EXCEPTION, lineNo, url, { message: message });

            // show exception as grunt

            CyGrunt.showGrunt(message + "</br>File: " + url + "</br>Line: " + lineNo, CyGrunt.kRED);
        }

        // don't let the default handler run

        return true;
    }

    /**
     * unhandled exceptions are occasionally generated by certain libraries. We are forced to ignore
     * certain of these by wiring in the name of the file as it will appear in the url parameter to the window.onerror
     * handler below
     *
     * @property {Array} sourceIgnores
     */
    private static sourceIgnores:string[] = [
        'kendo.web.min.js',
        'jquery.js'
    ];

    /**
     * browser resize event that is dispatched when we get the event ( which varies by browser )
     *
     * @event kBROWSER_RESIZED
     * @static
     */
    public static kBROWSER_RESIZED:string = "cyanapp-browser-resized";

    /**
     * web service endpoint for user account
     */
    private userConnector:CyUserConnector;

    /**
     * user menu widget
     */
    private userMenu:CyUserMenu;

    /**
     * Setup user stuff.  Required for all user authenticated pages.
     */
    public setupUser():void {

        this.userConnector.read();
    }

    /**
     * initializes the user menu
     */
    public addUserMenu():void {

        if (!this.userMenu) {
            this.userMenu = new CyUserMenu(this.userConnector.data());
            this.userMenu.eventBus = this.eventBus;
            this.userMenu.element.appendTo($('.header', CyTemplates.body));
        }

    }

    /**
     * Show the about box
     */
    public showAbout():void {
        if (!this.aboutWindow) {

            this.aboutWindow = new CyAboutWindow();

            this.aboutWindow.on(CyWindow.kEVENT_CLOSING, () => {

                this.aboutWindow = null;
            });
        }
    }

    /**
     * add a navigation header to our collection
     *
     * @method addNavigationHeader
     * @private
     * @param {NavigationHeader} h
     */
    public addNavigationHeader(h:ICyNavigationHeader):void {

        // add to headers

        this.navHeaders.push(h);

        // clone label from templates

        var l:JQuery = $('.master-page-view-label', CyTemplates.templates).clone();

        // set text

        l.html(h.text);

        // make clickable and link to the route in the header

        l.click(function (fragment, url, _this) {

            // track this via the analytics system

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kHEADER_NAVIGATION, -1, fragment);

            return function () {

                // fragments are navigatiable via the router

                if (fragment) {
                    _this.router.navigate(fragment);
                }

                // urls use the browser href

                if (url) {

                    window.location.href = url;
                }
            };

        }(h.fragment, h.url, this));

        // associate widget used to display header with the header

        h.widget = l;

        // add to image strip

        l.appendTo(CyTemplates.imageStrip);

    }


    /**
     * show all the headers
     *
     * @method showNavigationHeaders
     */
    public showNavigationHeaders():void {

        $('.header-hideable').show();

        this.mainMenu.removeClass('hidden');
    }

    /**
     * hide the navigation headers
     *
     * @method hideNavigationHeaders
     */
    public hideNavigationHeaders():void {

        $('.header-hideable').hide();

        this.mainMenu.addClass('hidden');
    }


    /**
     * use the router to navigate to the given fragment or url
     *
     * @method go
     * @param {String} url
     */
    public go(url:string) {

        this.router.navigate(url);
    }

    /**
     * goto the homepage
     *
     * @method goHome
     */
    public goHome():void {

        window.location.href ="/";
    }

    /**
     * goto the lost page
     *
     * @method goHome
     */
    public goLost():void {

        window.location.href = "/lost";
    }

    /**
     * goto the login page with the optional redirect URL
     *
     * @method goLogin
     * @param {String} fragment Optional redirect url.
     */
    public goLogin(fragment?:string):void {

        window.location.href = "/login";
    }

    /**
     * dispose the current view
     *
     * @method disposeView
     * @private
     */
    private disposeView():void {

        if (this.view) {

            // track event

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_VIEW_CLOSED);

            // only need to dispose if the widget was actually built

            if (this.view.isBuilt) {
                CyWidget.disposeTree(this.view.element);
            }

            // reset view

            this._view = null;
        }
    }


    /**
     * the current view that is displayed
     *
     * @property {CyanView} _view
     * @private
     */
    private _view:CyView;
    public get view():CyView {

        return this._view;
    }

    /**
     * set new view
     * @param v
     */
    public set view(v:CyView) {

        // dispose existing view

        this.disposeView();

        // save view and attach primary element to content area

        this._view = v;

        this._view.element.appendTo(CyTemplates.content);
    }
}

export = CyApp;

