/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/i18next.d.ts" />

/// <reference path="../../cy-app.ts" />
/// <reference path="./cy-grid.ts" />
/// <reference path="../../util/cy-enums.ts" />
/// <reference path="../component/cy-inputbox.ts" />

import CyApp = require("../../cy-app");
import CyUtils = require("../../util/cy-utils");
import CyTemplates = require("../../util/cy-templates");
import CyGrid = require("./cy-grid");
import CyEnums = require("../../util/cy-enums");
import CyInputBox = require("../component/cy-inputbox");
import CyAnalytics = require("../../cy-analytics");
import CyAlarmLogConnector = require("../../data/connectors/cy-alarm-log-connector");

class CyAlarmLogGrid extends CyGrid {

    /**
     * construct with the parent element into which we will insert the nodegrid
     * @param gridConfig
     */
    constructor(gridConfig?:kendo.ui.GridOptions)  {

        var dataSource = new CyAlarmLogConnector();

        super("CyAlarmLogGrid", dataSource, gridConfig);

    }

    /**
     * column definitions for grid
     * @type {Array}
     */
    public get gridColumns():kendo.ui.GridColumn[] {
        var severityValues = CyEnums.CyEnumerations.KendoMappings.I.getKendoMapping("AlarmSeverityEnums");
        var noYesValues = CyEnums.CyEnumerations.KendoMappings.I.getKendoMapping("noYes");
        var probCauseValues = CyEnums.CyEnumerations.KendoMappings.I.getKendoMapping("probableCause");
        var probCauseQualValues = CyEnums.CyEnumerations.KendoMappings.I.getKendoMapping("probableCauseQualifier");
        var typeValues = CyEnums.CyEnumerations.KendoMappings.I.getKendoMapping("type");
        var alarmCatValues = CyEnums.CyEnumerations.KendoMappings.I.getKendoMapping("alarmCategory");

        return [
            { field: "id", title: $.t("Window|AlarmGrid|Alarm ID"), hidden: false },
            { field: "node_name", title: $.t("Window|AlarmGrid|Node"), hidden: false},
            { field: "me_type", title: $.t("Window|AlarmGrid|Source Type"), values: typeValues, hidden: false },
            { field: "prob_cause", title: $.t("Window|AlarmGrid|Prob. Cause"), values: probCauseValues, hidden: false },
            { field: "severity", title: $.t("Window|AlarmGrid|Severity"), values: severityValues, hidden: false, attributes : { 'class' : 'alarm-severity-column' } },
            { field: "state_change", title: $.t("Window|AlarmGrid|State Change"), hidden: false },
            { field: 'ne_time', title: $.t("Window|AlarmGrid|Timestamp"), template: '#= kendo.toString(new Date(parseInt(ne_time)*1000), "MM/dd/yyyy HH:mm:ss" ) #', hidden: false },
            { field: "add_text", title: $.t("Window|AlarmGrid|Additional"), hidden: false },
            { field: "me_name", title: $.t("Window|AlarmGrid|Source ID"), hidden: true},
            { field: "alarm_category", title: $.t("Window|AlarmGrid|Category"), values: alarmCatValues, hidden: true},
            { field: "annot_count", title: $.t("Window|AlarmGrid|Annot Count"), hidden: true},
            { field: "is_ack", title: $.t("Window|AlarmGrid|Acknowledged"), values: noYesValues, hidden: true},
            { field: "prob_cause_qual", title: $.t("Window|AlarmGrid|Prob. Cause Qlty."), values: probCauseQualValues, hidden: true}

        ];
    }
}

export = CyAlarmLogGrid;