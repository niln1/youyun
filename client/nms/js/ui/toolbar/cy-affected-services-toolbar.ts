/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyToolbar = require("./cy-toolbar");
import CyUtils = require("../../util/cy-utils");
import CyAffectedServicesGrid = require("../grid/cy-affected-services-grid");
import CyTemplates = require("../../util/cy-templates");
import CyAnalytics = require("../../cy-analytics");
import CyAffectedServicesConnector = require("../../data/connectors/cy-affected-services-connector");

/**
 * Toolbar class meant for AffectedServicesGrid
 * @class CyAffectedServicesToolbar
 */
class CyAffectedServicesToolbar extends CyToolbar {

    constructor() {

        super("CyAffectedServicesToolbar");

    }

    /**
     * builds the toolbar template
     * @method buildElement
     * @returns {JQuery}
     * @public
     */
    public buildElement() : JQuery {

        var e = CyTemplates.cloneTemplate("cyan-affected-services-toolbar-template");

        return e;

    }

    /**
     * Registers the events for the toolbar
     * @method postRegister
     * @public
     */
    public postRegister() : void {

        CyUtils.assert(this.owner instanceof CyAffectedServicesGrid, "CyAffectedServicesToolbar is attached to a CyAffectedServicesGrid instance");


        // setup download link for export
        var connector = new CyAffectedServicesConnector(this.owner.connector.type, this.owner.connector.key, 'csv');


        this.addCustomAction('export', function () {
            CyUtils.redirect(connector.buildRequest());
        });

    }

}

export = CyAffectedServicesToolbar;