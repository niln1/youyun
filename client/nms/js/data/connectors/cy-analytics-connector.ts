/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyConnector = require("./cy-connector");
import CyRangePicker = require("../../ui/component/cy-range-picker");

class CyAnalyticsConnector extends CyConnector {

    constructor() {

        super("/api/v1/analytics/read");
    }

    /**
     * Start date
     */
    private startDate : Date;

    /**
     * End date
     */
    private endDate : Date;

    /**
     * date time range pickers
     */
    public get dateRanges():any[] {

        if (!this.startDate || !this.endDate) {
            this.startDate = CyRangePicker.defaultRange[0];
            this.endDate = CyRangePicker.defaultRange[1];
        }

        return [ this.startDate, this.endDate ];

    }

    /**
     * Setting dateRange
     * @param range
     */
    public set dateRanges(range : any[]) {

        this.startDate = range[0];
        this.endDate = range[1];

    }

    /**
     * Use different url for posting to analytics service
     * @returns {string}
     */
    public getPostUrl() : string {
        return "/api/v1/analytics/create";
    }

    /**
     * preprocess outbound requests from the grid and return the URL for the API that feeds it
     * @param e
     * @returns {string}
     */
    public prepareRequest(e:any):string {

        var url = super.prepareRequest(e);

        e.start = this.dateRanges[0].getTime();

        e.end = this.dateRanges[1].getTime();

        return url;

    }
}

export = CyAnalyticsConnector;