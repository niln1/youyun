/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />

import CyGrid = require("./cy-grid");
import CyUtils = require("../../util/cy-utils");
import CyTemplates = require("../../util/cy-templates");
import CyAffectedServicesConnector = require("../../data/connectors/cy-affected-services-connector");

/**
 * Displays a grid for trails affected services
 * @module CyUI
 * @submodule Grid
 */
class CyAffectedServicesGrid extends CyGrid {

    constructor(type, key, gridOptions?:kendo.ui.GridOptions) {

        var dataSource = new CyAffectedServicesConnector(type, key);

        super("CyAffectedServicesGrid", dataSource, gridOptions);

    }

    /*
    public prepareRequest(e:any):string {

        var url = super.prepareRequest(e);

        e.object_type = this.type;

        e.object_key = this.key;

        return url;

    }
    */

    /**
     * column definitions for grid
     * @type {Array}
     */
    public get gridColumns():kendo.ui.GridColumn[] {

        return [
            { field: 'trail_type_name', title: $.t('Window|TrailsGrid|Trail Type'), hidden: true },
            { field: 'name', title: $.t('Window|TrailsGrid|Name'), width: 300, hidden: false },
            { field: 'provision_state', title: $.t('Window|TrailsGrid|Transport Provisioning'), hidden: false },
            { field: 'admin_state_name', title: $.t('Window|TrailsGrid|Admin State'), hidden: false },
            { field: 'static_protection_level_name', title: $.t('Window|TrailsGrid|Static Protection Level'), hidden: true },
            { field: 'user_label', title: $.t('Window|TrailsGrid|User Label'), hidden: true },
            { field: 'owner', title: $.t('Window|TrailsGrid|Owner'), hidden: true },
            { field: 'layer_rate_name', title: $.t('Window|TrailsGrid|Layer Rate'), hidden: true },
            { field: 'a_end_info', title: $.t('Window|TrailsGrid|A-End Info'), hidden: true },
            { field: 'z_end_info', title: $.t('Window|TrailsGrid|Z-End Info'), hidden: true },
            { field: 'service_state_name', title: $.t('Window|TrailsGrid|Service State'), hidden: false},
            { field: 'customer', title: $.t('Window|TrailsGrid|Customer'), hidden: true },
            { field: 'last_transition', title: $.t('Window|TrailsGrid|Last Sync State'), hidden: true }
        ];
    }
}

export = CyAffectedServicesGrid;
