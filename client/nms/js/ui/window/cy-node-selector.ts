/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />

import CyDialog = require("./cy-dialog");
import CyGrid = require("../grid/cy-grid");
import CyNodeGrid = require("../grid/cy-node-grid");
import CyTemplates = require("../../util/cy-templates");
import CyGridComboToolbar = require("../toolbar/cy-grid-combo-toolbar");
import CyEvents = require("../../cy-events");
import CyMessage = require("../../cy-message");

class CyNodeSelector extends CyDialog {

    constructor(multiple:boolean = true, connectorClass?) {

        super({
            width: 1000,
            title: 'Node Selector',
            resizable: false
        });

        // setup default grid options

        var options:kendo.ui.GridOptions = {
            selectable: "multiple, row",
            pageable: {
                pageSizes: false
            },
            columns: [
                { field: 'user_label', title: $.t('Window|Node|User Label'), hidden: false },
                { field: 'resolved_ip_address', title: $.t('Window|Node|DCN IP Address (resolved)'), hidden: false },
                { field: 'sw_build_version', title: $.t('Window|Node|Software Version'), hidden: false },
                { field: 'communication_state_label', title: $.t('Window|Node|Comm State'), hidden: false }
            ]
        };

        if (!multiple) {
            options.selectable = "row";
        }

        this.gridContainer = CyTemplates.cloneTemplate('cyan-node-selector-grid-template').prependTo(this.clientArea);


        // initialize node grid

        this._nodegrid = new CyNodeGrid(options, connectorClass);

        this._nodegrid.pageSize = 10;

        this._nodegrid.element.prependTo(this.gridContainer);

        this._nodegrid.toolbar = new CyGridComboToolbar('node-grid', ['filter']);

        this.events = new CyEvents.EventIDList(this._nodegrid.eventBus);

        this.events.add(this._nodegrid.on(CyGrid.kSELECTION_CHANGED, $.proxy(this.onSelectionChanged, this)));

        // alert me when the grid content has updated

        this.events.add(this._nodegrid.on(CyMessage.kCONNECTOR_DATA_CHANGED, $.proxy(this.gridUpdate, this)));

        this.events.add(this._nodegrid.on(CyMessage.kGRID_SELECTION_DBLCLICKED, $.proxy(this.onSelectionDblClicked, this)));

        // add dialog buttons

        this.addButton('OK', CyDialog.kMODAL_OK);

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
     * Closes the window when a row a double clicked
     * @param e
     */
    private onSelectionDblClicked(e?:any) : void {

        this.modalResult = CyDialog.kMODAL_OK;
    }

    /**
     * Disables/Enables buttons based on selection
     * @param e
     */
    private onSelectionChanged(e?:any) : void {

        if (e.sender != this._nodegrid) {
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
    private _nodegrid:CyNodeGrid;

    public get nodegrid() : CyNodeGrid {

        return this._nodegrid;

    }

    /**
     * pass through for the node grid's selection
     * @returns {string[]}
     */
    public get selections() : any[] {

        return this._nodegrid.selections;

    }

    /**
     * return identifying information about this window
     * @returns {{displayName: string, windowType: string}}
     */
    public get info () : ICyWindowInfo {

        return {
            displayName : "Node Selector Window",
            windowType  : CyNodeSelector.kWINDOW_TYPE
        }
    }

    /**
     * used to uniquely identify windows
     * @type {string}
     */
    public static kWINDOW_TYPE:string = "Node-Selector-Window";

    /**
     * List of event delegations
     */
    private events : CyEvents.EventIDList;
}

export = CyNodeSelector;