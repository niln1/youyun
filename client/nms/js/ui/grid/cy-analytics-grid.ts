/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyApp = require('../../cy-app');
import CyEvents = require('../../cy-events');
import CyUtils = require('../../util/cy-utils');
import CyTemplates = require("../../util/cy-templates");

import CyGrid = require('./cy-grid');
import CyAnalytics = require('../../cy-analytics');
import CyAnalyticsConnector = require("../../data/connectors/cy-analytics-connector");

/**
 * the actual analytics data grid, including the toolbar
 */
class CyAnalyticsGrid extends CyGrid {

    constructor(gridConfig?:kendo.ui.GridOptions)  {

        var dataSource = new CyAnalyticsConnector();

        super("CyAnalyticsGrid", dataSource, gridConfig);

    }

    /**
     * date time range pickers
     */
    private get dateRanges():any[] {

        return (<CyAnalyticsConnector>this.connector).dateRanges;

    }

    /**
     * Setting dateRange will reload the grid
     * @param range
     */
    private set dateRanges(range : any[]) {

        (<CyAnalyticsConnector>this.connector).dateRanges = range;

        this.reload(0);

    }

    // column definitions

    public get gridColumns():kendo.ui.GridColumn[] {
        return [
            { field: "category", title: 'Category' },
            { field: "event", title: 'Event' },
            { field: "opt_number", title: 'Value' },
            { field: "opt_string", title: 'Text' },
            { field: "opt_extra", title: 'Extra' },
            { field: "session_id", title: 'Session' },
            { field: "user_id", title: 'User' },
            { field: "date_created", title: 'Created' }
        ];
    }
}

export = CyAnalyticsGrid;

