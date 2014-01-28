/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />

import CyApp = require("../../cy-app");
import CyUtils = require("../../util/cy-utils");
import CyTemplates = require("../../util/cy-templates");
import CyGrid = require("./cy-grid");
import CyInputBox = require("../component/cy-inputbox");
import CyAnalytics = require("../../cy-analytics");
import CyTrailConnector = require("../../data/connectors/cy-trail-connector");

/**
 * inject a trail trailgrid display into the given parent selector
 *
 * @module CyUI
 * @submodule Grid
 * @class CyTrailGrid
 */
class CyTrailGrid extends CyGrid {

    /**
     * @constructor
     * @param gridConfig
     */
    constructor(gridConfig?:kendo.ui.GridOptions) {


        var dataSource = new CyTrailConnector();

        super("CyTrailGrid", dataSource, gridConfig);

    }

    /**
     * column definitions for grid
     * @property {kendo.ui.GridColumn[]} defaultGridColumnConfig
     * @public
     */
    public get gridColumns():kendo.ui.GridColumn[] {

        return [
            { field: 'name', title: $.t('Window|TrailsGrid|Name'), hidden: false },
            { field: 'provision_state', title: $.t('Window|TrailsGrid|Transport Provisioning'), hidden: false },
            { field: 'admin_state_name', title: $.t('Window|TrailsGrid|Admin State'), hidden: false },
            { field: 'user_label', title: $.t('Window|TrailsGrid|User Label'), hidden: false },
            { field: 'trail_type_name', title: $.t('Window|TrailsGrid|Trail Type'), hidden: false },
            { field: 'a_end_info', title: $.t('Window|TrailsGrid|A-End Info'), hidden: false },
            { field: 'z_end_info', title: $.t('Window|TrailsGrid|Z-End Info'), hidden: false },
            { field: 'service_state_name', title: $.t('Window|TrailsGrid|Service State'), hidden: false},
            { field: 'static_protection_level_name', title: $.t('Window|TrailsGrid|Static Protection Level'), hidden: true },
            { field: 'owner', title: $.t('Window|TrailsGrid|Owner'), hidden: true },
            { field: 'layer_rate_name', title: $.t('Window|TrailsGrid|Layer Rate'), hidden: true },
            { field: 'customer', title: $.t('Window|TrailsGrid|Customer'), hidden: true },
            { field: 'last_transition', title: $.t('Window|TrailsGrid|Last Sync State'), hidden: true }
        ];
    }
}

export = CyTrailGrid;
