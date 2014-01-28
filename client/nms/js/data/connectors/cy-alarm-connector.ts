/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyConnector = require("./cy-connector");
import CyModel = require("../models/cy-model");
import CyAlarmModel = require("../models/cy-model");

class CyAlarmConnector extends CyConnector {

    constructor() {

        super("/api/v1/alarms");
    }

    public get dataSourceConfig():kendo.data.DataSourceOptions {
        return {
            transport: {
                read: {
                    url: $.proxy(this.prepareRequest, this),
                    dataType: "json"
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        "node_name": {
                            editable: false
                        },
                        "me_name": {
                            editable: false
                        },
                        "me_type": {
                            editable: false
                        },
                        "prob_cause": {
                            editable: false
                        },
                        "severity": {
                            editable: false
                        },
                        "ne_reported_time": {
                            editable: false
                        },
                        "add_text": {
                            editable: false
                        },
                        "is_ack": {
                            editable: true
                        },
                        "alarm_category": {
                            editable: false
                        },
                        "annot_count": {
                            editable: false
                        },
                        "prob_cause_qual": {
                            editable: false
                        }
                    }
                },
                data: function (response:any):any {
                    return response.objects;
                },
                total: function (response:any):any {
                    return response.total;
                }
            },
            pageSize       : this.pageSize,
            serverPaging   : true,
            serverFiltering: true,
            serverSorting  : true
        }
    }

    public getPostParameters(model : CyModel) {
        return JSON.stringify({
            alarm_id: model.data.id,
            method: (model.data.is_ack) ? "ack" : "un_ack"
        });
    }
}

export = CyAlarmConnector;