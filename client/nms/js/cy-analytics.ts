/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />

import CyUtils = require("./util/cy-utils");
import CyAnalyticsConnector = require("./data/connectors/cy-analytics-connector");
import CyModel = require("./data/models/cy-model");

/**
 * Analytics class
 *
 * @class CyAnalytics
 */
class CyAnalytics {

    /**
     * Initialize CyAnalytics with a data source connector
     */
    constructor() {
        this.connector = new CyAnalyticsConnector();
    }

    /**
     * data source connector
     */
    private connector : CyAnalyticsConnector;

    /**
     * singleton instance for the app class. Access via the I() public/static method
     *
     * @property {CyAnalytics} instance
     * @static
     * @private
     * @writeOnce
     */
    private static instance:CyAnalytics;

    /**
     * singleton accessor for instance of class
     *
     * @returns {CyApp}
     * @static
     * @constructor
     */
    public static get I():CyAnalytics {

        if (!CyAnalytics.instance) {

            CyAnalytics.instance = new CyAnalytics();
        }

        return CyAnalytics.instance;
    }

    /**
     * log track the given event. Category is a top level category for each event. Event
     * is the actual event. The other parameters are optional augmentations to the event.
     *
     * @method track
     * @param {String} category
     * @param {String} event
     * @param {Number} opt_number
     * @param {String} opt_string
     * @param {Object} opt_extra
     */
    public track(category:string, event:string, opt_number?:number, opt_string?:string, opt_extra?:any) {

        // category and event are not options

        CyUtils.assert(_.isString(category), "Category name must be supplied to CyAnalytics.track");

        CyUtils.assert(_.isString(event), "Event name must be supplied to CyAnalytics.track");

        // setup parameters including optional ones if supplied

        var data:any = {
            category: category,
            event   : event
        }

        if (_.isNumber(opt_number)) {
            data.opt_number = opt_number;
        }

        if (_.isString(opt_string)) {
            data.opt_string = opt_string;
        }

        if (_.isObject(opt_extra)) {
            data.opt_extra = JSON.stringify(opt_extra);
        }

        this.connector.write(new CyModel(data));
    }

    /**
     * fired when an unhandled exception occurs, passes the line number, url and message to the analytics system
     *
     * @property {String} kUNHANDLED_EXCEPTION
     * @static
     */
    public static kUNHANDLED_EXCEPTION:string = "unhandled exception";

    /**
     * the category we use for all analytics events we record from this file
     *
     * @property {String} kOPERATE
     * @static
     */
    public static kOPERATE:string = "web operate";

    /**
     * app attempted to navigate to a bad router
     *
     * @property {String} kBAD_ROUTE
     * @static
     */
    public static kBAD_ROUTE:string = "bad route entered";

    /**
     * the event we track when a view is opened. You should supply the name of the view in the optional string
     *
     * @property {String} kANALYTICS_VIEW_OPENED
     * @static
     */
    public static kANALYTICS_VIEW_OPENED:string = "view opened";

    /**
     * when a view is closed
     *
     * @property {String} kANALYTICS_VIEW_CLOSED
     * @static
     */
    public static kANALYTICS_VIEW_CLOSED:string = "view opened";

    // events related to alarm viewer

    /**
     * alarm viewer opened
     *
     * @event kANALYTICS_ALARM_VIEWER_OPENED
     */
    public static kANALYTICS_ALARM_VIEWER_OPENED:string = "cyan mainview alarm viewer opened";

    /**
     * @event kANALYTICS_ALARM_VIEWER_PANEL_OPENED
     */
    public static kANALYTICS_ALARM_VIEWER_PANEL_OPENED:string = "cyan mainview alarm viewer panel opened";

    /**
     * @event kANALYTICS_ALARM_VIEWER_PANEL_CLOSED
     */
    public static kANALYTICS_ALARM_VIEWER_PANEL_CLOSED:string = "cyan mainview alarm viewer panel closed";

    /**
     * @event kANALYTICS_ALARM_VIEWER_PANEL_SELECT
     */
    public static kANALYTICS_ALARM_VIEWER_PANEL_SELECT:string = "cyan mainview alarm viewer panel select";

    /**
     * @event kANALYTICS_ALARM_VIEWER_FILTER_TOGGLED
     */
    public static kANALYTICS_ALARM_VIEWER_FILTER_TOGGLED:string = "cyan mainview alarm viewer filter toggled";


    /**
     * alarm view opened
     *
     * @property {String} kANALYTICS_ALARM_GRID_OPENED
     * @static
     */
    public static kANALYTICS_ALARM_GRID_OPENED:string = "cyan mainview alarm grid opened";

    /**
     * node viewer opened
     *
     * @property {String} kANALYTICS_NODE_VIEWER_OPENED
     * @static
     */
    public static kANALYTICS_NODE_VIEWER_OPENED:string = "cyan mainview node viewer opened";

    /**
     * primary tab opened
     *
     * @property {String} kPRIMARY_TAB_OPENED
     * @static
     */
    public static kPRIMARY_TAB_OPENED:string = "cyan mainview primary tab window opened";

    /**
     * user attempted to login
     */
    public static kLOGIN_ATTEMPT:string = "cyan login attempt";

    /**
     * login success + failure
     */
    public static kLOGIN_SUCCESS:string = "cyan login success";

    public static kLOGIN_FAILURE:string = "cyan login failure";

    /**
     * user initiated navigation via the main header
     */
    public static kHEADER_NAVIGATION:string = "cyan header navigation";

    /**
     * user manipulated the date/time or filter in the analytics view
     */
    public static kANALYTICS_START_CHANGED:string = "filter start time changed";
    public static kANALYTICS_END_CHANGED:string = "filter end time changed";
    public static kANALYTICS_FILTER_CHANGED:string = "filter filter changed";

    /**
     * events related to alarm grid
     */
    public static kALARM_GRID_FILTER_CHANGED:string = "alarm grid filter changed";

    // alarm viewed opened from alarm grid

    public static kALARM_GRID_VIEWER_OPENED:string = "alarm grid viewer opened";

    public static kALARM_GRID_ACKNOWLEDGE_CLICKED:string = "alarm grid acknowledge click";

    /**
     * events related to alarm log grid
     */
    public static kALARM_LOG_GRID_FILTER_CHANGED:string = "alarm grid filter changed";

    // alarm viewed opened from alarm grid

    public static kALARM_LOG_GRID_VIEWER_OPENED:string = "alarm grid viewer opened"

    /**
     * filter changed in link grid
     */
    public static kLINK_GRID_FILTER_CHANGED:string = "link grid filter changed";

    /**
     * node grid analytics event
     */
    public static kNODE_GRID_VIEWER_OPENED:string = "node grid alarm viewer opened";

    public static kNODE_GRID_FILTER_CHANGED:string = "node grid filter changed";

    /**
     * trail grid events
     */
    public static kTRAIL_GRID_FILTER_CHANGED:string = "trail grid filter changed";

    /**
     * affected trails grid event
     */
    public static kAFFECTED_TRAIL_CLICKED:string = "affect trail clicked";

    // affected services related events

    /**
     * @event kAFFECTED_SERVICES_WINDOW_OPENED
     */
    public static kAFFECTED_SERVICES_WINDOW_OPENED:string = "affected services window opened";

    /**
     * @event kAFFECTED_SERVICES_EXPORT_CLICKED
     */
    public static kAFFECTED_SERVICES_GRID_EXPORT_CLICKED:string = "affected services grid export clicked";

}

export = CyAnalytics;
