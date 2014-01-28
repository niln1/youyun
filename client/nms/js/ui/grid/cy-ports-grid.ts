/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />

import CyApp = require("../../cy-app");
import CyUtils = require("../../util/cy-utils");
import CyTemplates = require("../../util/cy-templates");
import CyInputBox = require("../component/cy-inputbox");
import CyGrid = require("./cy-grid");
import CyAnalytics = require("../../cy-analytics");
import CyPortConnector = require("../../data/connectors/cy-port-connector");

/**
 * Grid class for displaying ports on a specific node
 * @class CyPortsGrid
 */
class CyPortsGrid extends CyGrid {

    /**
     * Constructs the grid
     * @param node the name of the node
     * @param gridConfig
     */
     constructor(node:string, gridConfig?:kendo.ui.GridOptions, connectorClass?)  {

        var connectorClass = connectorClass || CyPortConnector; 
        var dataSource = new connectorClass(node);

        super("CyPortsGrid", dataSource, gridConfig);
    }

    /**
     * column definitions for grid
     * @type {Array}
     */
    public get gridColumns():kendo.ui.GridColumn[] {

        return [
            { field: 'name', title: 'Port', hidden: false }
        ];
    }

}

export = CyPortsGrid;
