/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/i18next.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />

import CyWindow = require("./cy-window");
import CyAffectedServicesGrid = require("../grid/cy-affected-services-grid");
import CyWidget = require("../component/cy-widget");
import CyAffectedServicesToolbar = require("../toolbar/cy-affected-services-toolbar");

/**
 * the window wrapper around the actual grid
 */
class CyAffectedServicesWindow extends CyWindow {

    constructor(type, key) {

        super({
            width: 800,
            height: 500,
            minWidth: 650,
            minHeight: 230,
            maxWidth: 2048,
            maxHeight: 2048,
            title: $.t("MainMenu|WindowMenu|AffectedServicesWindow")
        });

        // center in browser window for now

        this.center();

        // create trail grid in client area

        var options:kendo.ui.GridOptions = {
            selectable  : "multiple, row"
        };

        this._grid = new CyAffectedServicesGrid(type, key, options);

        this._grid.element.appendTo(this.clientArea);

        this._grid.toolbar = new CyAffectedServicesToolbar();

        // grid height must be set explicity to the client area height and maintained as the window
        // is resized

        this._grid.setGridHeight(this.clientArea.height());

        this.on(CyWindow.kEVENT_RESIZED, () => {

            this._grid.setGridHeight(this.clientArea.height());
        });


        // cleanup grid as we are closing and clear the trails selection

        this.once(CyWindow.kEVENT_CLOSING, () => {

            // destroy the grid itself

            CyWidget.disposeTree(this._grid.element);

        });
    }

    /**
     * trail grid within window
     */
    private _grid:CyAffectedServicesGrid;
    public get grid():CyAffectedServicesGrid {
        return this._grid;
    }

    /**
     * base class return generic information about the window, override in child classes
     * @returns {{displayName: string, windowType: string}}
     */
    public get info () : ICyWindowInfo {

        return {
            displayName : "Generic Window Title",
            windowType  : CyAffectedServicesWindow.kAFFECTED_SERVICES_WINDOW_TYPE
        }
    }

    /**
     * used to uniquely identify trail windows to the trail manager
     * @type {string}
     */
    public static kAFFECTED_SERVICES_WINDOW_TYPE:string = "Affected Services Window";
}

export = CyAffectedServicesWindow;
