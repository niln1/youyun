/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />

import CyEnums = require("../../util/cy-enums");
import CyUtils = require("../../util/cy-utils");
import CyTemplates = require("../../util/cy-templates");
import CyInputBox = require("../component/cy-inputbox");
import CyGrid = require("./cy-grid");
import CyAnalytics = require("../../cy-analytics");
import CySocketManager = require("../../cy-socket-manager");
import CyGridComboToolbar = require("../toolbar/cy-grid-combo-toolbar");
import CyAlarmConnector = require("../../data/connectors/cy-alarm-connector");
import CyAlarmModel = require("../../data/models/cy-alarm-model");

/**
 * inject a grid display into the given parent selector
 */
class CyAlarmGrid extends CyGrid {

    /**
     * construct with the parent element into which we will insert the grid
     * @param gridConfig
     */
    constructor(gridConfig?:kendo.ui.GridOptions) {

        var dataSource = new CyAlarmConnector();

        // provide default sorting on severity column
        dataSource.customOptions = {
            sort: {
                field: "severity",
                dir: "desc"
            }};

        super("CyAlarmGrid", dataSource, _.extend(this.alarmGridConfig, gridConfig));

    }

    /**
     * Override buildElement to handle click event
     * @returns {JQuery}
     */
    public buildElement() : JQuery {

        var e = super.buildElement();

        this.on(CySocketManager.kALARMS_CHANGED, () => {
            this.onAlarmsChanged();
        });


        this.on(CyGridComboToolbar.kACKNOWLEDGE_CLICKED, () => {
            this.acknowledgeAlarms();
        });

        return e;

    }

    /**
     * The purpose of handling this event is to fetch the latest data from the grid in response to an alarm change event
     * and save state so it can be properly restored.
     */
    private onAlarmsChanged(e?:any) : void {

        // saved the current selection list

        this.selectedAlarms = [];
        _.each(this.selections, (selection) => {

            this.selectedAlarms.push(selection.id);

        });


        this.refresh();
    }

    /**
     * acknowledges the currently selected list of alarms
     * @method o
     * @param e
     */
    private acknowledgeAlarms() : void {

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kALARM_GRID_ACKNOWLEDGE_CLICKED);


        _.each(this.selections, (alarm) => {

            // check if alarm is already acknowledged

            if (alarm.is_ack) {

                return;

            }

            // update the client

            alarm.set('is_ack', 1);

            // update the server

            this.syncAlarm(alarm);

        });
    }

    /**
     * acknowledge an individual alarm
     * @param alarm     the alarm object
     */
    private syncAlarm(alarm) : void {

        var alarmModel = new CyAlarmModel(alarm.toJSON());

        this.connector.write(alarmModel);

    }

    /**
     * save current state of alarm ack to the server
     * @param e
     */
    private onSave(e:any) : void {

        this.syncAlarm(e.model);

        // disable editing since it is being saved

        this.grid.closeCell();

    }

    public get alarmGridConfig():kendo.ui.GridOptions {
        return {
            dataBound: $.proxy(this.tagAlarms, this),
            save: $.proxy(this.onSave, this),
            editable: true
        }
    }

    public get gridColumns():kendo.ui.GridColumn[] {

        var alarmCatValues = CyEnums.CyEnumerations.KendoMappings.I.getKendoMapping("alarmCategory");

        return [
            { field: "node_name", title: $.t("Window|AlarmGrid|Node"), hidden: false },
            { field: "me_name", title: $.t("Window|AlarmGrid|Source ID"), hidden: false },
            { field: "me_type_label", title: $.t("Window|AlarmGrid|Source Type"), hidden: false },
            { field: "prob_cause_label", title: $.t("Window|AlarmGrid|Prob. Cause"), hidden: false },
            { field: "severity_label", title: $.t("Window|AlarmGrid|Severity"), hidden: false, attributes : { 'class' : 'alarm-severity-column' } },
            { field: "ne_reported_time", title: $.t("Window|AlarmGrid|Timestamp"), template: '#= kendo.toString(new Date(parseInt(ne_reported_time)*1000), "MM/dd/yyyy HH:mm:ss" ) #', hidden: false },
            { field: "add_text", title: $.t("Window|AlarmGrid|Additional"), hidden: false },
            { field: "is_ack_label", title: $.t("Window|AlarmGrid|Acknowledged"), hidden: false },
            { field: "alarm_category", title: $.t("Window|AlarmGrid|Category"), values: alarmCatValues, hidden: true },
            { field: "annot_count", title: $.t("Window|AlarmGrid|Annot Count"), hidden: true},
            { field: "prob_cause_qual_label", title: $.t("Window|AlarmGrid|Prob. Cause Qlty."), hidden: true }

        ];
    }



    private tagAlarms() {

        var self = this;

        this.grid.tbody.find('tr').each(function () {

            var data = (<any>self.grid.dataItem(this));

            // get severity from data

            var severity = data.severity;

            // get row for this item

            var row = $(this);

            // assign alarm id to keep track of this easier

            row.attr('alarm-id', data.id);

            // get selector for cell representing severity

            if (severity == CyEnums.CyEnumerations.AlarmSeverity.Warning) {
                row.addClass('alarm-severity-warning');
            } else if (severity == CyEnums.CyEnumerations.AlarmSeverity.Minor) {
                row.addClass('alarm-severity-minor');
            } else if (severity == CyEnums.CyEnumerations.AlarmSeverity.Major) {
                row.addClass('alarm-severity-major');
            } else if (severity == CyEnums.CyEnumerations.AlarmSeverity.Critical) {
                row.addClass('alarm-severity-critical');
            }
        });

        this.grid.table.addClass('alarm-grid');

        // restore selected alarms if any

        _.each(this.selectedAlarms, (alarm_id) => {

            var row = this.grid.tbody.find('[alarm-id=' + alarm_id + ']');
            row.addClass('k-state-selected');

        });
    }

    private selectedAlarms : number[];
}

export = CyAlarmGrid;


