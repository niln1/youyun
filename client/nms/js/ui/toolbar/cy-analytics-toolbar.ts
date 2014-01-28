/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyToolbar = require("./cy-toolbar");
import CyUtils = require("../../util/cy-utils");
import CyAnalyticsGrid = require("../grid/cy-analytics-grid");
import CyTemplates = require("../../util/cy-templates");
import CyAnalytics = require("../../cy-analytics");
import CyInputBox = require('../component/cy-inputbox');
import CyRangePicker = require('../component/cy-range-picker');

/**
 * Toolbar meant for the AnalyticsGrid
 * @class CyAnalyticsToolbar
 */
class CyAnalyticsToolbar extends CyToolbar {

    constructor() {

        super("CyAnalyticsToolbar");

    }

    /**
     * builds the analytics toolbar
     * @method buildElement
     * @returns {JQuery}
     * @public
     */
    public buildElement() : JQuery {

        var e = CyTemplates.cloneTemplate("cyan-analytics-toolbar-template");

        // create autocomplete box

        this.inputBox = new CyInputBox("analytics-filter-box");

        this.inputBox.element.appendTo($('[data-element="filter-box"]', e));


        // create range picker

        this.rangePicker = new CyRangePicker();

        this.rangePicker.element.appendTo($('[data-element="range-picker"]', e));



        return e;

    }

    /**
     * Registers all events for the toolbar
     * @method postRegister
     * @public
     */
    public postRegister() : void {

        CyUtils.assert(this.owner instanceof CyAnalyticsGrid, "CyAnalyticsToolbar is attached to a CyAnalyticsGrid instance");

        // sink change to update grid

        this.inputBox.on(CyInputBox.kCHANGED, (e?:any) => {

            // track

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_FILTER_CHANGED);

            this.owner.filter = e.value;
        });


        // handle change events for both start and end pickers

        this.rangePicker.on(CyRangePicker.kSTART_PICKER_CHANGED, () => {

            // track

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_START_CHANGED);

            // update grid

            this.owner.dateRanges = [this.rangePicker.startDate, this.rangePicker.endDate];
        });

        this.rangePicker.on(CyRangePicker.kEND_PICKER_CHANGED, () => {

            // track

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_END_CHANGED);

            // update grid

            this.owner.dateRanges = [this.rangePicker.startDate, this.rangePicker.endDate];

        });


    }

    /**
     * input box for filter text
     */
    private inputBox:CyInputBox;

    /**
     * range date picker
     */
    private rangePicker:CyRangePicker;
}

export = CyAnalyticsToolbar;