/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />
/// <reference path="../../definitions/i18next.d.ts" />

import CyGrid = require("./cy-grid");
import CyServiceConnector = require("../../data/connectors/cy-service-connector");

class CyServicesGrid extends CyGrid {

    /**
     * construct with the parent element into which we will insert the services grid
     * @param gridConfig
     */
     constructor(gridConfig?:kendo.ui.GridOptions) {

        // set data source

        var dataSource = new CyServiceConnector();

        // call parents
        super("CyServicesGrid", dataSource, gridConfig);

    }

    /**
     * column definitions for grid
     * @type {Array}
     */
    public get gridColumns():kendo.ui.GridColumn[] {

        return [
            { field: 'circuit_id', title: $.t('Grid|ServicesGrid|CircuitID'), hidden: false },
            { field: 'service_state', title: $.t('Grid|ServicesGrid|ServiceState'), hidden: false },
            { field: 'op_state_qual', title: $.t('Grid|ServicesGrid|OpStateQualifier'), hidden: false },
            { field: 'used_template', title: $.t('Grid|ServicesGrid|ServiceType'), hidden: false },
            { field: 'provision_state', title: $.t('Grid|ServicesGrid|TransportProvisioningState'), hidden: false },
            { field: 'description', title: $.t('Grid|ServicesGrid|Description'), hidden: false },
            { field: 'last_transition', title: $.t('Grid|ServicesGrid|LastProvStateTransition'), hidden: true},
            { field: 'owner', title: $.t('Grid|ServicesGrid|Owner'), hidden: true},
            { field: 'service_id', title: $.t('Grid|ServicesGrid|UniqueDBKey'), hidden: true},
            { field: 'admin_state', title: $.t('Grid|ServicesGrid|AdminState'), hidden: true},
            { field: 'trail_type', title: $.t('Grid|ServicesGrid|Type'), hidden: true},
            { field: 'synchronization_status', title: $.t('Grid|ServicesGrid|LastSyncState'), hidden: true}
        ];
    }
}

export = CyServicesGrid;