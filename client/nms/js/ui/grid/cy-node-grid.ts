/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />

import CyApp = require("../../cy-app");
import CyUtils = require("../../util/cy-utils");
import CyTemplates = require("../../util/cy-templates");
import CyInputBox = require("../component/cy-inputbox");
import CyGrid = require("./cy-grid");
import CyAnalytics = require("../../cy-analytics");
import CyGridComboToolbar = require("../toolbar/cy-grid-combo-toolbar")

import CyNodeConnector = require("../../data/connectors/cy-node-connector");

/**
 * inject a node nodegrid display into the given parent selector
 */
class CyNodeGrid extends CyGrid {

    /**
     * construct with the parent element into which we will insert the nodegrid
     * @param gridConfig
     */
     constructor(gridConfig?:kendo.ui.GridOptions, connectorClass?) {

        // set data source
        
        var connectorClass = connectorClass || CyNodeConnector;  

        var dataSource = new connectorClass();

        super("CyNodeGrid", dataSource, gridConfig);

    }

    /**
     * column definitions for grid
     * @type {Array}
     */
    public get gridColumns():kendo.ui.GridColumn[] {

        return [
            { field: 'user_label', title: $.t('Window|Node|User Label'), hidden: false },
            { field: 'ip_address', title: $.t('Window|Node|DCN IP Address'), hidden: false },
            { field: 'resolved_ip_address', title: $.t('Window|Node|DCN IP Address (resolved)'), hidden: true },
            { field: 'sw_build_version', title: $.t('Window|Node|Software Version'), hidden: false },
            { field: 'communication_state_label', title: $.t('Window|Node|Comm State'), hidden: false },
            { field: 'alarm_status_label', title: $.t('Window|Node|Alarm Status'), hidden: false },
            { field: 'ems_in_sync_state_label', title: $.t('Window|Node|In Sync'), hidden: false },
            { field: 'node_sub_type_name', title: $.t('Window|Node|Sub Network'), hidden: false },
            { field: 'comment', title: $.t('Window|Node|Comment'), hidden: true },
            //{ field: 'provisioning_state',          $.t('Window|Node|Provisioning State' ,       hidden : true },          // NOT PRESENT IN API RESULTS
            { field: 'ems_name', title: $.t('Window|Node|Native EMS Name'), hidden: true },
            { field: 'owner', title: $.t('Window|Node|Owner'), hidden: true },
            { field: 'ne_type', title: $.t('Window|Node|Product Name'), hidden: true },
            //{ field: 'Product_Coce',                $.t('Window|Node|Product Coce' ,             hidden : true },          // NOT PRESENT IN API RESULTS
            { field: 'port', title: $.t('Window|Node|DCN Port'), hidden: true },
            { field: 'sw_version', title: $.t('Window|Node|Product Version'), hidden: true },
            { field: 'location_x', title: $.t('Window|Node|Location X'), hidden: true },
            { field: 'location_y', title: $.t('Window|Node|Location Y'), hidden: true },
            { field: 'ems_node_id', title: $.t('Window|Node|EMS Id'), hidden: true },
            { field: 'ea_server_ip', title: $.t('Window|Node|EA Server IP'), hidden: true },
            { field: 'ea_server_port', title: $.t('Window|Node|EA Server Port'), hidden: true },
            { field: 'node_system_id', title: $.t('Window|Node|System Id'), hidden: true },
            { field: 'support_rates', title: $.t('Window|Node|Support Rated'), hidden: true },
            { field: 'type_group', title: $.t('Window|Node|Type Group'), hidden: true },
            { field: 'multi_node_group', title: $.t('Window|Node|Multi-Node Group'), hidden: true }
        ];
    }

}

export = CyNodeGrid;
