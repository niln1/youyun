/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />

/// <reference path="../../util/cy-enums.ts" />
/// <reference path="../../util/cy-utils.ts" />
/// <reference path="cy-widget.ts">

import CyEnums = require("../../util/cy-enums");
import CyTemplates = require("../../util/cy-templates");
import CyWidget = require("./cy-widget");

/**
 * Provides a info view on current alarms
 *
 * @module CyUI
 * @submodule Component
 * @class CyAlarmInfo
 */
class CyAlarmInfo extends CyWidget {

    /**
     * @constructor
     * @param {JQuery} parent the parent element
     */
        constructor() {

        super("CyAlarmInfo");

        this._datasource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: () => {
                        return "/api/v1/alarms";
                    },
                    dataType: "json"
                }
            },
            schema: {
                data: function (response:any):any {
                    return response.objects;
                }
            },
            // required so Kendo doesn't cache
            serverSorting: true
        });

    }

    public buildElement() : JQuery {

        var e = CyTemplates.cloneTemplate("cyan-alarm-info-template");

        this._criticalDiv = $('[data-element="critical-alarm-header"]', e);

        this._majorDiv =  $('[data-element="major-alarm-header"]', e);

        this._minorDiv =  $('[data-element="minor-alarm-header"]', e);

        this._warningDiv = $('[data-element="warning-alarm-header"]', e);

        this._criticalDiv.click(() => {
            this.trigger(CyAlarmInfo.kCLICKED, {
                sender: this,
                severity: 'Critical'
            });
        });

        this._majorDiv.click(() => {
            this.trigger(CyAlarmInfo.kCLICKED, {
                sender: this,
                severity: 'Major'
            });

        });

        this._minorDiv.click(() => {

            this.trigger(CyAlarmInfo.kCLICKED, {
                sender: this,
                severity: 'Minor'
            });
        });

        this._warningDiv.click(() => {

            this.trigger(CyAlarmInfo.kCLICKED, {
                sender: this,
                severity: 'Warning'
            });
        });

        this._tooltip = e.kendoTooltip({
            filter: 'li',
            content: $.proxy(this.tooltipContent, this)
        });

        this.update();

        return e;
    }

    private tooltipContent(e) {

        var severity;
        var target = e.target;

        if (target.hasClass('.master-page-alarm-critical')) {

            severity = 'critical';

        } else if (target.hasClass('.master-page-alarm-major')) {

            severity = 'major';

        } else if (target.hasClass('.master-page-alarm-minor')) {

            severity = 'minor';

        } else if (target.hasClass('.master-page-alarm-warning')) {

            severity = 'warning';
        }

        return "There are " + target.text()  + " " + severity + " active alarms";

    }

    /**
     * Fetches new data from the data source and update the DOM
     *
     * @method update
     * @public
     */
    public update():void {

        // stop polling on new request for update

        if (this._timer) {

            clearTimeout(this._timer);

        }

        // fetch new alarms

        this._datasource.fetch(() => {

            var alarms = this._datasource.data();

            var critical = 0, major = 0, minor = 0, warning = 0;

            _.each(alarms, (alarm) => {

                if (alarm.severity === CyEnums.CyEnumerations.AlarmSeverity.Critical) {
                    critical += 1;
                } else if (alarm.severity === CyEnums.CyEnumerations.AlarmSeverity.Major) {
                    major += 1;
                } else if (alarm.severity === CyEnums.CyEnumerations.AlarmSeverity.Minor) {
                    minor += 1;
                } else if (alarm.severity === CyEnums.CyEnumerations.AlarmSeverity.Warning) {
                    warning += 1;
                }

            });

            this._criticalDiv.text(critical + " Critical");
            this._majorDiv.text(major + " Major");
            this._minorDiv.text(minor + " Minor");
            this._warningDiv.text(warning + " Warning");

            // poll every 30 seconds
            this._timer = setTimeout(() => {
                this.update();
            }, 30000);

        });
    }

    public dispose() {

        clearTimeout(this._timer);

    }
    /**
     * alarms data source
     * @property {kendo.data.DataSource} _datasource
     * @private
     **/
    private _datasource:kendo.data.DataSource;

    /**
     * main div
     * @property {JQuery} _div
     * @private
     */
    private _div:JQuery;

    /**
     * critical label
     * @property {JQuery} _criticalDiv
     * @private
     */
    private _criticalDiv:JQuery;

    /**
     * major label
     * @property {JQuery} _majorDiv
     * @private
     */
    private _majorDiv:JQuery;

    /**
     * minor label
     * @property {JQeury} _minorDiv
     * @private
     */
    private _minorDiv:JQuery;

    /**
     * warning label
     * @property {JQuery} _warningDiv
     * @private
     */
    private _warningDiv:JQuery;

    /**
     * kendo tooltip
     * @property {JQuery} _tooltip
     * @private
     */
    private _tooltip;

    private _timer;

    /**
     * triggered when an alarm div is clicked
     * @event kCLICKED
     */
    public static kCLICKED = 'cy-alarm-info-clicked';

}

export = CyAlarmInfo;
