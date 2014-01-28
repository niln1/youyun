/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />

import CyGrunt = require("./util/cy-grunt");

/**
 * Captures all ajax requests.
 * @class CyPendingRequests
 */
class CyPendingRequests {

    /**
     * @class CyPendingRequests
     * @constructor
     */
    constructor() {

        // initialize request list

        this.requests = [];

    }


    /**
     * Initialize ajax hooks
     * @method initialize
     * @public
     */
    public initialize() {

        // intercept all ajax calls

        $.ajaxSetup({
            beforeSend: $.proxy(this.catchRequest, this),
            complete: $.proxy(this.releaseRequest, this)
        });

    }

    /**
     * Starts a watch dog timer for when the request completes.  Performs sanity check after each period.
     * @method watchRequests
     * @private
     */
    private watchRequests() {

        // cancel any previous setTimeouts and begin anew

        if (this.timer) {

            clearTimeout(this.timer);

        }

        // perform sanity check after maximum timeout
        this.timer = setTimeout($.proxy(this.sanityCheck, this), CyPendingRequests.kREQUEST_TIME_OUT);
    }

    /**
     * Performs a check to ensure every thing is as it should be
     * @method sanityCheck
     * @private
     */
    private sanityCheck() {

        // if after all this time, the are still requests in the list
        // then we must not be catching all request completions

        _.each(this.requests, function (request) {

            CyGrunt.showGrunt("Request for " + request.requestUrl + " is still pending", CyGrunt.kORANGE);

        });
    }

    /**
     * Hook for ajaxSetup beforeSend.
     * @method catchRequest
     * @param jqXHR
     * @param settings
     * @private
     */
    private catchRequest(jqXHR:JQueryXHR, settings:JQueryAjaxSettings) {


        // store identifying properties for readability

        (<any>jqXHR).requestUrl = settings.url;

        // add to list

        this.requests.push(jqXHR);

        // check that all request completes

        this.watchRequests();

    }

    /**
     * Hook for ajaxSetup complete
     * @method releaseRequest
     * @param jqXHR
     * @param textStatus
     * @private
     */
    private releaseRequest(jqXHR:JQueryXHR, textStatus:String) {

        // update list for request that have finished

        var pos = this.requests.indexOf(jqXHR);

        if (pos !== -1) {

            this.requests.splice(pos, 1);

        }

    }

    /**
     * Cancels all pending requests.
     * @method cancelAll
     * @public
     */
    public cancelAll() {

        // cancel watch dog

        if (this.timer) {

            clearTimeout(this.timer);
        }

        // forcibly abort all remaining requests

        _.each(this.requests, (request) => {

            request.abort();

        });

    }

    /**
     * Get singleton instance of CyPendingRequests
     * @property {CyPendingRequests} I
     * @returns {CyPendingRequests}
     * @public
     */
    public static get I():CyPendingRequests {

        // create new instance

        if (!CyPendingRequests.instance) {

            CyPendingRequests.instance = new CyPendingRequests();
        }

        return CyPendingRequests.instance;

    }

    /**
     * singleton instance of CyPendingRequests
     * @property {CyPendingRequests} instance
     * @public
     * @static
     */
    public static instance:CyPendingRequests;

    /**
     * ajax request list
     * @property {JQueryXHR[]} requests
     * @private
     */
    private requests:JQueryXHR[];

    /**
     * timer id
     * @property timer
     * @private
     */
    private timer;

    /**
     * maximum msecs all requests must be completed in
     * @property {Number} kREQUEST_TIME_OUT
     * @private
     * @static
     */
    private static kREQUEST_TIME_OUT:Number = 30000;
}

export = CyPendingRequests;
