/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />

import CyDialog = require("./cy-dialog");
import CyGrid = require("../grid/cy-grid");
import CyPortsGrid = require("../grid/cy-ports-grid");
import CyTemplates = require("../../util/cy-templates");
import CyGridComboToolbar = require("../toolbar/cy-grid-combo-toolbar");
import CyEvents = require("../../cy-events");
import CyMessage = require("../../cy-message");

class CyPortsSelector extends CyDialog {

    /**
     * constructs the ports selector window
     * @param node  the name of the node
     * @param multiple
     */
    constructor(node:string, multiple:boolean = true, connectorClass?) {

        super({
            width: 400,
            title: 'Ports Selector',
            resizable: false
        });

        // setup default grid options

        var options:kendo.ui.GridOptions = {
            selectable: "multiple, row",
            pageable: {
                pageSizes: false
            }
        };

        if (!multiple) {
            options.selectable = "row";
        }

        this.gridContainer = CyTemplates.cloneTemplate('cyan-ports-selector-grid-template').prependTo(this.clientArea);


        // initialize node grid

        this._portsgrid = new CyPortsGrid(node, options, connectorClass);

        this._portsgrid.pageSize = 10;

        this._portsgrid.element.prependTo(this.gridContainer);

        this._portsgrid.toolbar = new CyGridComboToolbar('ports-grid', ['filter']);

        this.events = new CyEvents.EventIDList(this._portsgrid.eventBus);

        this.events.add(this._portsgrid.on(CyGrid.kSELECTION_CHANGED, $.proxy(this.onSelectionChanged, this)));

        // alert me when the grid content has updated

        this.events.add(this._portsgrid.on(CyMessage.kCONNECTOR_DATA_CHANGED, $.proxy(this.gridUpdate, this)));

        // add dialog buttons

        this.addButton('Ok', CyDialog.kMODAL_OK);

        this.addButton('Cancel', CyDialog.kMODAL_CANCEL);

        this.enableButton(CyDialog.kMODAL_OK, false);

        this.center();
    }

    /**
     * Clean up
     */
    public close() : void {

        super.close();

        this.events.allOff();
    }

    /**
     * Disables/Enables buttons based on selection
     * @param e
     */
    private onSelectionChanged(e?:any) : void {

        if (e.sender != this._portsgrid) {
            return;
        }

        if (e.selections.length > 0) {
            this.enableButton(CyDialog.kMODAL_OK);
        } else {
            this.enableButton(CyDialog.kMODAL_OK, false);
        }

    }

    /**
     * Center the window after the grid content has updated
     */
    private gridUpdate() {

        this.center();

    }

    private gridContainer:JQuery;

    /**
     * The grid class
     */
    private _portsgrid:CyPortsGrid;

    public get nodegrid() : CyPortsGrid {

        return this._portsgrid;

    }

    /**
     * pass through for the node grid's selection
     * @returns {string[]}
     */
    public get selections() : any[] {

        return this._portsgrid.selections;

    }

    /**
     * return identifying information about this window
     * @returns {{displayName: string, windowType: string}}
     */
    public get info () : ICyWindowInfo {

        return {
            displayName : "Ports Selector Window",
            windowType  : CyPortsSelector.kWINDOW_TYPE
        }
    }

    /**
     * used to uniquely identify windows
     * @type {string}
     */
    public static kWINDOW_TYPE:string = "Ports-Selector-Window";

    /**
     * List of event delegations
     */
    private events : CyEvents.EventIDList;
}

export = CyPortsSelector;