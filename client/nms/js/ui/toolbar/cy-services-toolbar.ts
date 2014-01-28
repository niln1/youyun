/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyToolbar = require("./cy-toolbar");
import CyUtils = require("../../util/cy-utils");
import CyServicesGrid = require("../grid/cy-services-grid");
import CyTemplates = require("../../util/cy-templates");
import CyInputBox = require("../component/cy-inputbox");
import CyAnalytics = require("../../cy-analytics");
import CyMessage = require("../../cy-message");

/**
 * Toolbar class meant for CyServicesGrid
 * @class CyServicesToolbar
 */
class CyServicesToolbar extends CyToolbar {

    constructor() {

        super("CyServicesToolbar");

    }

    /**
     * builds the toolbar template
     * @method buildElement
     * @returns {JQuery}
     * @public
     */
    public buildElement() : JQuery {

        var e = CyTemplates.cloneTemplate("cyan-services-toolbar-template");

        // create autocomplete box

        this.inputBox = new CyInputBox("services-filter-box");

        this.inputBox.element.appendTo($('[data-element="filter-box"]', e));

        return e;

    }

    /**
     * Registers the events for the toolbar
     * @method postRegister
     * @public
     */
    public postRegister() : void {

        CyUtils.assert(this.owner instanceof CyServicesGrid, "CyServicesToolbar is attached to a CyServicesGrid instance");

        // sink change to update grid

        this.inputBox.on(CyInputBox.kCHANGED, (e?:any) => {

            // track

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_FILTER_CHANGED, 0, "services");

            this.owner.filter = e.value;
        });

        this.addClickAction("new-services", "new-services");

        this.addClickAction("service-details", 'service-details', () => {
            return this.owner.selections
        });
    }

    private inputBox : CyInputBox;
}

export = CyServicesToolbar;