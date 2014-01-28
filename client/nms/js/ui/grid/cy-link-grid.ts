/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />

import CyApp = require("../../cy-app");
import CyUtils = require("../../util/cy-utils");
import CyTemplates = require("../../util/cy-templates");
import CyGrid = require("./cy-grid");
import CyInputBox = require("../component/cy-inputbox");
import CyAnalytics = require("../../cy-analytics");
import CyLinkConnector = require("../../data/connectors/cy-link-connector");

/**
 * inject a link linkgrid display into the given parent selector
 */
class CyLinkGrid extends CyGrid {

    /**
     * construct with the parent element into which we will insert the linkgrid
     * @param gridConfig
     */
    constructor(gridConfig?:kendo.ui.GridOptions) {

        var dataSource = new CyLinkConnector();

        super("CyLinkGrid", dataSource, gridConfig);

    }

    /**
     * column definitions for grid
     * @type {Array}
     */
    public get gridColumns():kendo.ui.GridColumn[] {

        return [
            { field: 'trail_type_name', title: $.t('Window|LinksGrid|Trail Type'), hidden: true },
            { field: 'name', title: $.t('Window|LinksGrid|Name'), hidden: false },
            { field: 'layer_rate_name', title: $.t('Window|LinksGrid|Layer Rate'), hidden: false },
            { field: 'provision_state', title: $.t('Window|LinksGrid|Transport Provisioning'), hidden: true },
            { field: 'admin_state_name', title: $.t('Window|LinksGrid|Admin State'), hidden: true },
            { field: 'static_protection_level_name', title: $.t('Window|LinksGrid|Static Protection Level'), hidden: true },
            { field: 'user_label', title: $.t('Window|LinksGrid|User Label'), hidden: true },
            { field: 'owner', title: $.t('Window|LinksGrid|Owner'), hidden: true },
            { field: 'a_end_info', title: $.t('Window|LinksGrid|A-End TP'), hidden: false },
            { field: 'z_end_info', title: $.t('Window|LinksGrid|Z-End TP'), hidden: false },
            { field: 'service_state_name', title: $.t('Window|LinksGrid|Service State'), hidden: false},
            { field: 'customer', title: $.t('Window|LinksGrid|Customer'), hidden: true },
            { field: 'last_transition', title: $.t('Window|LinksGrid|Last Sync State'), hidden: true }
        ];

    }

}

export = CyLinkGrid;
